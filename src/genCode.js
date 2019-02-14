const fs = require ('fs');
const path = require ('path');
const config = require('./config')
const {getDataByFields, checkHttpRequestHasBody} = require('./utils')

let requestParamsCheckTpl;



const schemaValidator = fs.readFileSync (
  path.resolve (__dirname, './code/schemaValidator.js'),
  'utf8'
);

module.exports = function genCode (interfaceList) {
  if(config.enableValidte){
    requestParamsCheckTpl = fs.readFileSync (
      path.resolve (__dirname, './code/requestParamsCheckTpl.js'),
      'utf8'
    );
  }else{
    requestParamsCheckTpl  = 'function checkRequestParams(){}'
  }
  let templateContent;
  if(typeof config.template === 'string'){
    templateContent = fs.readFileSync (
      path.resolve (__dirname, `../template/${config.template}.js`),
      'utf8'
    );
  }else if(typeof config.template === 'function'){
    templateContent = config.template()
  }
  let code = config.globalCode || '';

  function getParamComment(info){
    return `    ${info.name}: '', // {${info.type}} ${info.required == 1 ? '*' :''} ${info.desc} \n`
  }

  interfaceList.forEach ((interfaceData, index) => {
    let paramsCode = ''
    interfaceData.req_query.forEach(item=>{
      paramsCode += getParamComment({
        ...item,
        type: 'string',
        
      })
    })

    interfaceData.req_params.forEach(item=>{
      paramsCode += getParamComment({
        ...item,
        type: 'string'
      })
    })

    if(checkHttpRequestHasBody(interfaceData.method)){
      if(interfaceData.req_body_type === 'form'){
        interfaceData.req_body_form.forEach(item=>{
          paramsCode += getParamComment({
            ...item,
            type: item.type === 'text' ? 'string' : 'file'
          })
        })
      }else if(interfaceData.req_body_type === 'json' && interfaceData.req_body_is_json_schema === true){
        let schema = interfaceData.req_body_other;
        let required = schema.required  || []
        try{
          Object.keys(schema.properties).forEach(key=>{
            let info = {name: key}
            info.desc = (schema.properties[key].title || '' )+ (schema.properties[key].description || '')
            info.type = schema.properties[key].type;
            if(required.indexOf(key) !== -1){
              info.required = '1'
            }
            paramsCode += getParamComment(info)
          })
        }catch(e){
          console.error(e)
        }
      }
      
    }

    let baseInterfaceData = interfaceData;

    if(!config.enableValidte){
      let fields = [
        'path',
        'method',
        'req_params',
        'req_headers',
        'req_body_type',
      ]
      baseInterfaceData = getDataByFields(interfaceData, fields)
    }
    code += `

/**
 * @title ${interfaceData.title}
 * @path ${interfaceData.path}
 * @param {Object} params 请求参数
 * @param {Object} options 请求配置
 * @info params
 {
${paramsCode}
 }
 */
exports.${config.methodName(interfaceData.path, interfaceData.method)} = function(params, options){
  let interfaceData=${JSON.stringify (baseInterfaceData, null, 2)};
  return httpRequest(interfaceData,params, options)
}
  `;
  });

  code += `

${schemaValidator}

${requestParamsCheckTpl}
  
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
${templateContent} 
  return request({
    url,
    method, 
    params
  }, options)
  
}
  `
  return code;
}