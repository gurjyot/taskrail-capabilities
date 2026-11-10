import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspect } from '../index.mjs';
test('authorized local media delegates and symlink escapes fail',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'media-'));
 const outside=await mkdtemp(path.join(tmpdir(),'outside-'));
 try {
  const file=path.join(root,'image.png');await writeFile(file,'fixture');
  const gateway=async()=>({status:'partial',evidence:[]});
  assert.equal((await inspect({gateway,file,allowedRoots:[root]})).status,'partial');
  const target=path.join(outside,'image.png');await writeFile(target,'outside');await symlink(target,path.join(root,'link.png'));
  await assert.rejects(inspect({gateway,file:path.join(root,'link.png'),allowedRoots:[root]}),/outside/);
  assert.equal((await inspect({gateway:async()=>({bad:true}),file,allowedRoots:[root]})).status,'provider_error');
 } finally {await rm(root,{recursive:true,force:true});await rm(outside,{recursive:true,force:true});}
});
