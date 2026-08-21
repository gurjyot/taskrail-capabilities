import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../index.mjs';
const response=(data={})=>({ok:true,status:200,text:async()=>JSON.stringify(data)});
test('queries Search Analytics with encoded property',async()=>{let seen;const fetchImpl=async(url,opts)=>{seen={url:String(url),opts};return response({rows:[]});};const out=await run({operation:'querySearchAnalytics',accessToken:'token-1234567890',siteUrl:'sc-domain:example.com',params:{startDate:'2026-08-01',endDate:'2026-08-21'},fetchImpl});assert.equal(out.ok,true);assert.match(seen.url,/sc-domain%3Aexample.com/);assert.equal(seen.opts.method,'POST');});
test('URL inspection requires inspection URL',async()=>{await assert.rejects(()=>run({operation:'inspectUrl',accessToken:'token-1234567890',siteUrl:'https://example.com/'}),/inspectionUrl/);});
