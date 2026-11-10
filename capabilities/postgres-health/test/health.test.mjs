import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect, assessEvidence } from '../index.mjs';
test('fixed probe starts read-only transaction and always rolls back', async () => {
 const commands=[];
 const client={async query(text){commands.push(text);return {rows:[{connections:2,max_connections:100,blocked_queries:0,idle_transactions:0}]};}};
 const result=await inspect({client});
 assert.equal(result.status,'healthy');assert.equal(commands[0],'BEGIN READ ONLY');assert.equal(commands.at(-1),'ROLLBACK');
 client.query=async text=>{commands.push(text);if(text.startsWith('SELECT'))throw new Error('secret');return {};};
 assert.equal((await inspect({client})).status,'unknown');assert.equal(commands.at(-1),'ROLLBACK');
});
test('stale freshness, missing restore and pressure remain visible',()=>{
 const now=new Date('2026-01-02T00:00:00Z');
 const probe={status:'healthy',latencyMs:2,metrics:{connections:90,max_connections:100,blocked_queries:0,idle_transactions:0}};
 const result=assessEvidence({probe,now,freshness:{observedAt:'2026-01-01T00:00:00Z',maxAgeMs:1000},backup:{observedAt:now.toISOString(),maxAgeMs:1000}});
 assert.equal(result.status,'unknown');assert.equal(result.checks.find(c=>c.name==='freshness').status,'stale');assert.equal(result.checks[0].status,'degraded');
});
