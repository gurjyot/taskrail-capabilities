const READ_OPS = new Set(['listAccessibleCustomers','search','searchStream']);
const OPS = new Set([...READ_OPS,'mutate']);

export async function run({operation,accessToken,developerToken,customerId='',loginCustomerId='',query='',service='',payload={},apiVersion='v25',authorizeMutation=false,fetchImpl=fetch}) {
  if (!OPS.has(operation)) throw new Error('unsupported Google Ads operation');
  if (!accessToken || !developerToken) throw new Error('accessToken and developerToken required at runtime');
  const headers = {
    authorization: `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'content-type': 'application/json'
  };
  if (loginCustomerId) headers['login-customer-id'] = String(loginCustomerId).replace(/-/g,'');
  let url;
  let body;
  if (operation === 'listAccessibleCustomers') {
    url = `https://googleads.googleapis.com/${apiVersion}/customers:listAccessibleCustomers`;
  } else {
    const cid = String(customerId).replace(/-/g,'');
    if (!cid) throw new Error('customerId required');
    if (operation === 'search' || operation === 'searchStream') {
      if (!query) throw new Error('GAQL query required');
      url = `https://googleads.googleapis.com/${apiVersion}/customers/${cid}/googleAds:${operation}`;
      body = {query};
    } else {
      if (authorizeMutation !== true) throw new Error('Google Ads mutation denied by default');
      if (!service) throw new Error('service required for mutate');
      url = `https://googleads.googleapis.com/${apiVersion}/customers/${cid}/${service}:mutate`;
      body = payload;
    }
  }
  const response = await fetchImpl(url,{method:body?'POST':'GET',headers,body:body?JSON.stringify(body):undefined});
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(`Google Ads API request failed (${response.status})`);
  return {ok:true,data};
}
