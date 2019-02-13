function request(baseinfo, options = {}){
  let params = baseinfo.params;

  options = Object.assign({}, {
    url: baseinfo.url,
    method: baseinfo.method,
    data: params
  }, options)

  /**
   * 只有在测试环境，才会开启请求参数验证
   */
  if(process.env.NODE_ENV !== 'production' && checkRequestParams && typeof checkRequestParams === 'function'){
    checkRequestParams(interfaceData ,params)
  }

  return axios(options)
}