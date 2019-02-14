const axios = require('axios'); 


/**
 * @title form 接口测试
 * @path /http/request/api/form
 * @param {Object} params 请求参数
 * @param {Object} options 请求配置
 * @info params
 {
    xxx: '', // {string} * 订单编号 
    yyyy: '', // {string} * 用户名 

 }
 */
exports.api_form = function(params, options){
  let interfaceData={
  "title": "form 接口测试",
  "path": "/http/request/api/form",
  "method": "POST",
  "req_params": [],
  "req_query": [],
  "req_headers": [
    {
      "required": "1",
      "_id": "5c64d26e5f0db102ab3bc81f",
      "name": "Content-Type",
      "value": "application/x-www-form-urlencoded"
    }
  ],
  "req_body_type": "form",
  "req_body_is_json_schema": true,
  "req_body_form": [
    {
      "required": "1",
      "_id": "5c64d26e5f0db102ab3bc821",
      "name": "xxx",
      "type": "text",
      "desc": "订单编号"
    },
    {
      "required": "1",
      "_id": "5c64d26e5f0db102ab3bc820",
      "name": "yyyy",
      "type": "text",
      "example": "",
      "desc": "用户名"
    }
  ],
  "req_body_other": null
};
  return httpRequest(interfaceData,params, options)
}
  

/**
 * @title jsonschema接口测试
 * @path /http/request/api/jsonschema
 * @param {Object} params 请求参数
 * @param {Object} options 请求配置
 * @info params
 {
    a: '', // {string} * 参数a 
    b: '', // {string} * 参数b 
    c: '', // {number}  参数c 

 }
 */
exports.api_jsonschema = function(params, options){
  let interfaceData={
  "title": "jsonschema接口测试",
  "path": "/http/request/api/jsonschema",
  "method": "POST",
  "req_params": [],
  "req_query": [],
  "req_headers": [
    {
      "required": "1",
      "_id": "5c64d29b5f0db102ab3bc824",
      "name": "Content-Type",
      "value": "application/json"
    }
  ],
  "req_body_type": "json",
  "req_body_is_json_schema": true,
  "req_body_form": [],
  "req_body_other": {
    "type": "object",
    "title": "empty object",
    "properties": {
      "a": {
        "type": "string",
        "description": "参数a"
      },
      "b": {
        "type": "string",
        "description": "参数b"
      },
      "c": {
        "type": "number",
        "description": "参数c"
      }
    },
    "required": [
      "a",
      "b"
    ]
  }
};
  return httpRequest(interfaceData,params, options)
}
  

/**
 * @title restful动态路径测试
 * @path /http/request/api/restful/:id
 * @param {Object} params 请求参数
 * @param {Object} options 请求配置
 * @info params
 {
    id: '', // {string}   

 }
 */
exports.get_restful_id = function(params, options){
  let interfaceData={
  "title": "restful动态路径测试",
  "path": "/http/request/api/restful/:id",
  "method": "GET",
  "req_params": [
    {
      "_id": "5c64d2ba5f0db102ab3bc826",
      "name": "id",
      "desc": ""
    }
  ],
  "req_query": [],
  "req_headers": [],
  "req_body_is_json_schema": true,
  "req_body_form": [],
  "req_body_other": null
};
  return httpRequest(interfaceData,params, options)
}
  

/**
 * @title 基本测试
 * @path /http/request/api/m/data/malldatacenter/cptSkuPriceIndex/getCptBrandList
 * @param {Object} params 请求参数
 * @param {Object} options 请求配置
 * @info params
 {
    poiId: '', // {string} * 门店 

 }
 */
exports.cptSkuPriceIndex_getCptBrandList = function(params, options){
  let interfaceData={
  "title": "基本测试",
  "path": "/http/request/api/m/data/malldatacenter/cptSkuPriceIndex/getCptBrandList",
  "method": "GET",
  "req_params": [],
  "req_query": [
    {
      "required": "1",
      "_id": "5c64d2a45f0db102ab3bc825",
      "name": "poiId",
      "example": "11",
      "desc": "门店"
    }
  ],
  "req_headers": [],
  "req_body_is_json_schema": true,
  "req_body_form": [],
  "req_body_other": null
};
  return httpRequest(interfaceData,params, options)
}
  

const Ajv = require('ajv');

function  schemaValidator(schema, params) {
  try {
    const ajv = new Ajv({
      format: false,
      meta: false,
      schemaId: 'id'
    });
    let metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
    ajv.addMetaSchema(metaSchema);
    ajv._opts.defaultMeta = metaSchema.id;
    ajv._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema';
    schema = schema || {
      type: 'object',
      title: 'empty object',
      properties: {}
    };
    const validate = ajv.compile(schema);
    let valid = validate(params);

    let message = '';
    if (!valid) {
      message += ajv.errorsText(validate.errors, { separator: '\n' });
    }

    return {
      valid: valid,
      message: message
    };
  } catch (e) {
    return {
      valid: false,
      message: e.message
    };
  }
};

function checkRequestParams (interfaceData, params) {
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

  const noRequiredArr = [];
  let validResult;

  for (let i = 0, l = interfaceData.req_query.length; i < l; i++) {
    let curQuery = interfaceData.req_query[i];
    if (curQuery && typeof curQuery === 'object' && curQuery.required === '1') {
      if (!params[curQuery.name]) {
        noRequiredArr.push (curQuery.name);
      }
    }
  }

  if (HTTP_METHOD[interfaceData.method].request_body) {
    // form 表单判断

    if (interfaceData.req_body_type === 'form') {
      let isFile = false;
      for (let y = 0; y < interfaceData.req_body_form.length; y++) {
        if (interfaceData.req_body_form[y].type === 'file') {
          isFile = true;
          break;
        }
      }
      if (!isFile) {
        for (
          (j = 0), (len = interfaceData.req_body_form.length);
          j < len;
          j++
        ) {
          let curForm = interfaceData.req_body_form[j];
          if (
            curForm &&
            typeof curForm === 'object' &&
            curForm.required === '1'
          ) {
            if (params[curForm.name]) {
              continue;
            }

            noRequiredArr.push (curForm.name);
          }
        }
      }
    }

    // json schema 判断
    if (
      interfaceData.req_body_type === 'json' &&
      interfaceData.req_body_is_json_schema === true
    ) {
      const schema = interfaceData.req_body_other;
      validResult = schemaValidator (schema, params);
    }
  }

  if (noRequiredArr.length > 0 || (validResult && !validResult.valid)) {
    let message = `错误信息：`;
    message += noRequiredArr.length > 0
      ? `缺少必须字段 ${noRequiredArr.join (',')}  `
      : '';
    message += validResult && !validResult.valid
      ? `shema 验证请求参数 ${validResult.message}`
      : '';

    throw new Error (message);
  }
}

  
function httpRequest(interfaceData, params, options){
  let  url=  interfaceData.path;
  let method = interfaceData.method;

  let isRestful = false;
  if(url.indexOf(':') > 0){
    isRestful = true;
  }else if(url.indexOf('{') > 0 && url.indexOf('}') > 0){
    isRestful = true;
  }

  if(isRestful){
    interfaceData.req_params.forEach(item=>{
      let val = params[item.name];
      if(!val){
        throw new Error('路径参数 ' + item.name + ' 不能为空')
      }
      url = url.replace(":" + item.name , val );
      url = url.replace("{" + item.name + "}", val );
      delete params[item.name]
    })
  }
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
  return request({
    url,
    method, 
    params
  }, options)
  
}
  