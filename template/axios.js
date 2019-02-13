function request(baseinfo, options = {}){
  let params = baseinfo.params;

  options = Object.assign({}, {
    url: baseinfo.url,
    method: baseinfo.method,
    data: params
  }, options)

  if(checkRequestParams && typeof checkRequestParams === 'function'){
    checkRequestParams(interfaceData ,params)
  }

  return axios(options)
}