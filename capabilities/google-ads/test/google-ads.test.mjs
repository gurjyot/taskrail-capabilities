import test from 'node:test';
import assert from 'node:assert/strict';
import {run} from '../index.mjs';

test('builds GAQL search request', async()=>{
  let seen;
  const fetchImpl=async(url,opts)=>{seen={url,opts};return {ok:true,json:async()=>({results:[]})};};
  const out=await run({operation:'search',accessToken:'token',developerToken:'dev',customerId:'123-456',query:'SELECT campaign.id FROM campaign',fetchImpl});
  assert.equal(out.ok,true);
  assert.match(seen.url,/\/v25\/customers\/123456\/googleAds:search$/);
});

test('denies mutation by default', async()=>{
  await assert.rejects(()=>run({operation:'mutate',accessToken:'token',developerToken:'dev',customerId:'123',service:'campaigns',payload:{}}),/denied by default/);
});
