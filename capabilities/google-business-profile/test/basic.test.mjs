import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../index.mjs';
const response=(data={})=>({ok:true,status:200,text:async()=>JSON.stringify(data)});
test('builds multi-metric GBP performance request',async()=>{let seen;const fetchImpl=async(url)=>{seen=String(url);return response({multiDailyMetricTimeSeries:[]});};const out=await run({operation:'fetchMultiDailyMetrics',accessToken:'token-1234567890',locationId:'12345',params:{dailyMetrics:['WEBSITE_CLICKS','CALL_CLICKS']},fetchImpl});assert.equal(out.ok,true);assert.match(seen,/locations\/12345:fetchMultiDailyMetricsTimeSeries/);assert.match(seen,/dailyMetrics=WEBSITE_CLICKS/);assert.match(seen,/dailyMetrics=CALL_CLICKS/);});
test('normalizes full location resource names',async()=>{let seen;await run({operation:'listSearchKeywordsMonthly',accessToken:'token-1234567890',locationId:'locations/99',fetchImpl:async(url)=>{seen=String(url);return response({});}});assert.match(seen,/locations\/99\/searchkeywords/);});
