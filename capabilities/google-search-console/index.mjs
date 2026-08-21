const OPS = new Set(['listSites','querySearchAnalytics','listSitemaps','inspectUrl']);
function encodeSite(siteUrl){return encodeURIComponent(siteUrl);}
async function jsonResponse(response){const text=await response.text();let data={};try{data=text?JSON.parse(text):{};}catch{data={raw:text};}if(!response.ok)throw new Error(`Search Console API request failed (${response.status})`);return data;}
export async function run({operation,accessToken,siteUrl='',inspectionUrl='',params={},fetchImpl=fetch}){
  if(!OPS.has(operation)) throw new Error('unsupported Search Console operation');
  if(typeof accessToken!=='string'||accessToken.length<10) throw new Error('accessToken is required at runtime');
  let url; let method='GET'; let body;
  if(operation==='listSites') url='https://www.googleapis.com/webmasters/v3/sites';
  if(operation==='querySearchAnalytics'){
    if(!siteUrl) throw new Error('siteUrl is required');
    url=`https://www.googleapis.com/webmasters/v3/sites/${encodeSite(siteUrl)}/searchAnalytics/query`; method='POST'; body=params;
  }
  if(operation==='listSitemaps'){
    if(!siteUrl) throw new Error('siteUrl is required');
    url=`https://www.googleapis.com/webmasters/v3/sites/${encodeSite(siteUrl)}/sitemaps`;
  }
  if(operation==='inspectUrl'){
    if(!siteUrl||!inspectionUrl) throw new Error('siteUrl and inspectionUrl are required');
    url='https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'; method='POST'; body={inspectionUrl,siteUrl,...params};
  }
  const response=await fetchImpl(url,{method,headers:{Authorization:`Bearer ${accessToken}`,Accept:'application/json',...(method==='POST'?{'content-type':'application/json'}:{})},body:method==='POST'?JSON.stringify(body):undefined});
  return {ok:true,data:await jsonResponse(response)};
}
