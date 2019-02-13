const fs = require ('fs');
const path = require ('path');
const config = require('./config')

const requestParamsCheckTpl = fs.readFileSync (
  path.resolve (__dirname, './requestParamsCheckTpl.js'),
  'utf8'
);

const schemaValidator = fs.readFileSync (
  path.resolve (__dirname, './schemaValidator.js'),
  'utf8'
);

module.exports = function genCode (interfaceList) {
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

  interfaceList.forEach ((interfaceData, index) => {
    code += `

/**
 * @title ${interfaceData.title}
 * @path ${interfaceData.path}
 * 
 */
exports.${config.methodName(interfaceData.path, interfaceData.method)} = function(params, options = {}){
  let interfaceData=${JSON.stringify (interfaceData, null, 2)};
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