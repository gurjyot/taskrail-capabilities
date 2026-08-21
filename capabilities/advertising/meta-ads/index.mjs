const MUTATIONS=new Set(["updateBudget","updateStatus"]);
const READS=new Set(["listCampaigns","listAdSets","listAds","getInsights","getObjectStatus"]);
const ALL=new Set([...READS,...MUTATIONS]);
export async function run({operation,accessToken,objectId,params={},authorizeMutation=false,apiVersion="v23.0",fetchImpl=fetch}){
 if(!ALL.has(operation)) throw new Error("unsupported Meta Ads operation"); if(!accessToken||!objectId) throw new Error("accessToken and objectId are required at runtime");
 if(MUTATIONS.has(operation)&&authorizeMutation!==true) throw new Error("Meta Ads mutation denied by default");
 const fields={listCampaigns:"campaigns",listAdSets:"adsets",listAds:"ads",getInsights:"insights"};
 const path=fields[operation]?`${objectId}/${fields[operation]}`:objectId; const url=new URL(`https://graph.facebook.com/${apiVersion}/${path}`);
 const method=MUTATIONS.has(operation)?"POST":"GET"; const body=new URLSearchParams({...params,access_token:accessToken});
 const r=await fetchImpl(method==="GET"?`${url}?${body}`:url,{method,headers:method==="POST"?{"content-type":"application/x-www-form-urlencoded"}:undefined,body:method==="POST"?body:undefined});
 const data=await r.json(); if(!r.ok||data?.error) throw new Error(`Meta Ads API request failed (${r.status})`); return {ok:true,data};
}
