const MUTATIONS = new Set(["editMessageText","deleteMessage"]);
const OPS = new Set(["sendMessage","editMessageText","deleteMessage","sendDocument"]);
export async function run({operation,botToken,payload={},authorizeMutation=false,fetchImpl=fetch}) {
  if(!OPS.has(operation)) throw new Error("unsupported Telegram operation");
  if(typeof botToken!=="string" || botToken.length<10) throw new Error("botToken is required at runtime");
  if(MUTATIONS.has(operation) && authorizeMutation!==true) throw new Error("Telegram mutation denied by default");
  const r=await fetchImpl(`https://api.telegram.org/bot${botToken}/${operation}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
  const body=await r.json();
  if(!r.ok || body?.ok!==true) throw new Error(`Telegram API request failed (${r.status})`);
  return {ok:true,result:body.result};
}
