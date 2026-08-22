import fs from 'node:fs';
import path from 'node:path';

const base = 'capabilities';
const errors = [];
const seen = new Map();
const required = ['name','version','taskrailCompatibility','description','purpose','domain','operations','inputs','outputs','components','sideEffects','idempotency','status','tests','runtime','canonicalPath'];
const allowedSideEffects = new Set(['none','read','write','mixed']);
const allowedIdempotency = new Set(['not-applicable','caller','supported','required']);
function words(s) { return new Set(String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)); }
function sim(a,b) { const A=words(a), B=words(b), i=[...A].filter(x=>B.has(x)).length, u=new Set([...A,...B]).size; return u ? i/u : 0; }

if (fs.existsSync(base)) for (const name of fs.readdirSync(base)) {
  const dir = path.join(base, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  const mf = path.join(dir, 'capability.json');
  if (!fs.existsSync(mf)) { errors.push(`${dir}: missing capability.json`); continue; }
  const c = JSON.parse(fs.readFileSync(mf, 'utf8'));
  for (const k of required) if (c[k] === undefined) errors.push(`${dir}: missing ${k}`);
  if (c.name !== name) errors.push(`${dir}: folder/name mismatch`);
  if (c.taskrailCompatibility !== '3.0.x') errors.push(`${dir}: new publications must target TaskRail 3.0.x`);
  if (typeof c.domain !== 'string' || !c.domain.trim()) errors.push(`${dir}: domain required`);
  if (c.runtime !== 'node') errors.push(`${dir}: unsupported runtime`);
  if (typeof c.canonicalPath !== 'string' || !fs.existsSync(path.join(dir, c.canonicalPath))) errors.push(`${dir}: canonicalPath missing or invalid`);
  if (!fs.existsSync(path.join(dir, 'CAPABILITY.md'))) errors.push(`${dir}: CAPABILITY.md required`);
  if (!Array.isArray(c.operations) || c.operations.length === 0) errors.push(`${dir}: operations required`);
  if (!Array.isArray(c.components)) errors.push(`${dir}: components must be array`);
  if (!allowedSideEffects.has(c.sideEffects)) errors.push(`${dir}: sideEffects must be none|read|write|mixed`);
  if (!allowedIdempotency.has(c.idempotency)) errors.push(`${dir}: idempotency must be not-applicable|caller|supported|required`);
  if (seen.has(c.name)) errors.push(`${dir}: duplicate capability name ${c.name}`);
  for (const [n,x] of seen) if (sim(`${c.name} ${c.purpose} ${c.operations?.join(' ')}`, `${x.name} ${x.purpose} ${x.operations?.join(' ')}`) >= 0.75) errors.push(`${dir}: semantically overlaps ${n}`);
  seen.set(c.name,c);
  const text = fs.readFileSync(mf,'utf8');
  if (/password|bearer |api[_-]?key|connection[_-]?string/i.test(text)) errors.push(`${dir}: possible secret-like manifest content`);
  const mutation = c.authorization?.mutation;
  if (mutation !== undefined && !['denied','none','explicit'].includes(mutation)) errors.push(`${dir}: unsupported mutation authorization`);
  if (mutation === 'explicit' && !['write','mixed'].includes(c.sideEffects)) errors.push(`${dir}: explicit mutation requires write or mixed sideEffects`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`TaskRail 3 capability governance PASS (${seen.size})`);
