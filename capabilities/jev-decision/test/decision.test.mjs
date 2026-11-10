import test from 'node:test';
import assert from 'node:assert/strict';
import { decide } from '../index.mjs';
const input={state:{blocked:2},question:'Choose urgency',choices:['high','low']};
test('typed decision gates confidence and rejects unknown choices',async()=>{
 assert.equal((await decide({...input,evaluate:async()=>({choice:'high',confidence:.99})})).status,'decided');
 assert.equal((await decide({...input,evaluate:async()=>({choice:'high',confidence:.4})})).status,'review');
 assert.equal((await decide({...input,evaluate:async()=>({choice:'oops',confidence:.99})})).status,'unknown');
});
test('transport failure is unknown without exposing error text',async()=>{
 const result=await decide({...input,evaluate:async()=>{throw new Error('secret');}});
 assert.equal(result.status,'unknown');assert.ok(!JSON.stringify(result).includes('secret'));
});
