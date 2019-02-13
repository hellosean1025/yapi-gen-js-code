const axios = require('axios'); 


/**
 * @title form-test
 * @path /api/form
 * 
 */
exports.api_form = function(params, options = {}){
  let interfaceData={
  "title": "form-test",
  "path": "/api/form",
  "method": "POST",
  "req_params": [],
  "req_query": [],
  "req_headers": [
    {
      "required": "1",
      "_id": "5c63851bf85d99daa3666c1a",
      "name": "Content-Type",
      "value": "application/x-www-form-urlencoded"
    }
  ],
  "req_body_type": "form",
  "req_body_is_json_schema": true,
  "req_body_form": [
    {
      "required": "1",
      "_id": "5c63851bf85d99daa3666c1c",
      "name": "xxx",
      "type": "text"
    },
    {
      "required": "1",
      "_id": "5c63851bf85d99daa3666c1b",
      "name": "yyyy",
      "type": "text",
      "example": "",
      "desc": ""
    }
  ],
  "req_body_other": null
};
  return httpRequest(interfaceData,params, options)
}
  

/**
 * @title jsonschema-test
 * @path /api/jsonschema
 * 
 */
exports.api_jsonschema = function(params, options = {}){
  let interfaceData={
  "title": "jsonschema-test",
  "path": "/api/jsonschema",
  "method": "POST",
  "req_params": [],
  "req_query": [],
  "req_headers": [
    {
      "required": "1",
      "_id": "5c638f5bc2590866be46f5f0",
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
        "type": "string"
      },
      "b": {
        "type": "string"
      },
      "c": {
        "type": "string"
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
 * @title restful-test
 * @path /api/restful/:id
 * 
 */
exports.get_restful_id = function(params, options = {}){
  let interfaceData={
  "title": "restful-test",
  "path": "/api/restful/:id",
  "method": "GET",
  "req_params": [
    {
      "_id": "5c637fdb4436b5da8f8d9ac5",
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
 * @title test1
 * @path /api/m/data/malldatacenter/cptSkuPriceIndex/getCptBrandList
 * 
 */
exports.cptSkuPriceIndex_getCptBrandList = function(params, options = {}){
  let interfaceData={
  "title": "test1",
  "path": "/api/m/data/malldatacenter/cptSkuPriceIndex/getCptBrandList",
  "method": "GET",
  "req_params": [],
  "req_query": [
    {
      "required": "1",
      "_id": "5c629e46fff085da992a02c6",
      "name": "poiId",
      "example": "11",
      "desc": ""
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
      default_tab: 'query',
    },
    POST: {
      request_body: true,
      default_tab: 'body',
    },
    PUT: {
      request_body: true,
      default_tab: 'body',
    },
    DELETE: {
      request_body: true,
      default_tab: 'body',
    },
    HEAD: {
      request_body: false,
      default_tab: 'query',
    },
    OPTIONS: {
      request_body: false,
      default_tab: 'query',
    },
    PATCH: {
      request_body: true,
      default_tab: 'body',
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
  return request({
    url,
    method, 
    params
  }, options)
  
}
  