const HTTP_METHOD = {
  GET: {
    request_body: false,
  },
  POST: {
    request_body: true,
  },
  PUT: {
    request_body: true,
  },
  DELETE: {
    request_body: true,
  },
  HEAD: {
    request_body: false,
  },
  OPTIONS: {
    request_body: false,
  },
  PATCH: {
    request_body: true,
  },
};

function request(baseinfo, options = {}){
  let params = baseinfo.params;

  options = Object.assign({}, {
    url: baseinfo.url,
    method: baseinfo.method,
    
  }, options)

  if(HTTP_METHOD[baseinfo.method].request_body){
    options.data = params;
  }else{
    options.params = params;
  }

  if(checkRequestParams && typeof checkRequestParams === 'function'){
    checkRequestParams(interfaceData ,params)
  }

  return axios(options)
}