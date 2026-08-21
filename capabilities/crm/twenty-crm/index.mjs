const MUTATIONS=new Set(["createRecord","updateRecord","deleteRecord"]); const OPS=new Set(["query",...MUTATIONS]);
export async function run({operation,endpoint,accessToken,query,variables={},authorizeMutation=false,fetchImpl=fetch}){
 if(!OPS.has(operation)) throw new Error("unsupported Twenty operation"); if(!/^https:\/\//.test(endpoint||"")) throw new Error("HTTPS endpoint required"); if(!accessToken||!query) throw new Error("accessToken and query are required at runtime");
 if(MUTATIONS.has(operation)&&authorizeMutation!==true) throw new Error("Twenty mutation denied by default");
 const r=await fetchImpl(endpoint,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${accessToken}`},body:JSON.stringify({query,variables})}); const body=await r.json();
 if(!r.ok||body?.errors?.length) throw new Error(`Twenty API request failed (${r.status})`); return {ok:true,data:body.data};
}
