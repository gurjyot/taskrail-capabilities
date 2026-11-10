import path from 'node:path';
import { realpath, stat } from 'node:fs/promises';
export async function inspect({ gateway, file, allowedRoots, modality = 'image', timeoutMs = 60000 }) {
  if (typeof gateway !== 'function' || !Array.isArray(allowedRoots) || !allowedRoots.length) throw new Error('Gateway and explicit media roots required');
  if (typeof file !== 'string' || !path.isAbsolute(file) || !['image', 'audio', 'video'].includes(modality)) throw new Error('Local absolute file and supported modality required');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120000) throw new Error('Invalid timeout');
  const resolved = await realpath(file);
  const roots = await Promise.all(allowedRoots.map(root => realpath(root)));
  if (!roots.some(root => { const rel = path.relative(root, resolved); return rel !== '' && !rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel); })) throw new Error('Media outside authorized roots');
  const info = await stat(resolved);
  if (!info.isFile() || info.size > 100 * 1024 * 1024) throw new Error('Media exceeds limit or is not a file');
  const controller = new AbortController();
  let timer;
  try {
    const result = await Promise.race([
      Promise.resolve().then(() => gateway({ file: resolved, modality, signal: controller.signal })),
      new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, timeoutMs); }),
    ]);
    if (!['ok', 'partial', 'unknown', 'provider_error'].includes(result?.status) || !Array.isArray(result.evidence)) throw new Error('Invalid gateway envelope');
    return result;
  } catch { return { status: 'provider_error', evidence: [], source: 'multimodal-gateway' }; }
  finally { clearTimeout(timer); }
}
