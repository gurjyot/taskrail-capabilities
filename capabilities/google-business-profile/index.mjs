const OPS=new Set(['getDailyMetrics','fetchMultiDailyMetrics','listSearchKeywordsMonthly']);
function locationName(locationId){const raw=String(locationId||'').trim();if(!raw)throw new Error('locationId is required');return raw.startsWith('locations/')?raw:`locations/${raw}`;}
function addParams(url,params){for(const [key,value] of Object.entries(params||{})){if(value===undefined||value===null||value==='')continue;if(Array.isArray(value)){for(const item of value)url.searchParams.append(key,String(item));}else url.searchParams.set(key,String(value));}}
async function jsonResponse(response){const text=await response.text();let data={};try{data=text?JSON.parse(text):{};}catch{data={raw:text};}if(!response.ok)throw new Error(`Business Profile API request failed (${response.status})`);return data;}
export async function run({operation,accessToken,locationId,params={},fetchImpl=fetch}){
  if(!OPS.has(operation))throw new Error('unsupported Google Business Profile operation');
  if(typeof accessToken!=='string'||accessToken.length<10)throw new Error('accessToken is required at runtime');
  const name=locationName(locationId);let path;
  if(operation==='getDailyMetrics') path=`${name}:getDailyMetricsTimeSeries`;
  if(operation==='fetchMultiDailyMetrics') path=`${name}:fetchMultiDailyMetricsTimeSeries`;
  if(operation==='listSearchKeywordsMonthly') path=`${name}/searchkeywords/impressions/monthly`;
  const url=new URL(`https://businessprofileperformance.googleapis.com/v1/${path}`);addParams(url,params);
  const response=await fetchImpl(url,{headers:{Authorization:`Bearer ${accessToken}`,Accept:'application/json'}});
  return {ok:true,data:await jsonResponse(response)};
}
