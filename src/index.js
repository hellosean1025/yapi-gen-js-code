const axios = require ('axios');
const fs = require ('fs');
const path = require ('path');
const genCode = require ('./genCode');
const json5 = require('json5');
const config = require('./config')

function json_parse(json){
  try{
    return json5.parse(json)
  }catch(err){
    return null;
  }
}

module.exports = gen;

async function gen (options = {}) {
  Object.assign (config, options);
  let result;
  try{
    result = await axios.get (
      `${config.server}/api/interface/list?limit=10000&token=${config.token}`
    );
    
  }catch(err){
    console.log('调用 /api/interface/list 失败，请检查网络')
  }

  let list = result.data.data.list;

  let fields = [
    'title',
    'path',
    'method',
    'req_params',
    // 'res_body_type',   // 返回数据type
    // 'res_body_is_json_schema',  //返回数据结构是否为json-schema
    // 'res_body'  //返回数据内容
  ];

  if(process.env.NODE_ENV !== 'production'){
    fields = [].concat(fields, [
      'req_query',
      'req_headers',
      'req_body_type',
      'req_body_is_json_schema',
      'req_body_form',
      'req_body_other',
    ])
  } 
  
  let interfaceList = []

  for(let i=0; i< list.length; i++){
    if(config.categoryId){
      if(list[i].catid != config.categoryId)continue;
    }
    let result = await axios.get(
      `${config.server}/api/interface/get?id=${list[i]._id}&token=${config.token}`
    );
    
    let interfaceData = result.data.data;
    interfaceData = getDataByFields(interfaceData, fields)
    interfaceData.req_body_other = json_parse(interfaceData.req_body_other);
    interfaceList.push(interfaceData)
  }


  let code = genCode (interfaceList);

  fs.writeFileSync (config.dist, code, 'utf8');
}

function getDataByFields (data, field) {
  if (!data || !field || !Array.isArray (field)) {
    return null;
  }

  var arr = {};

  field.forEach (f => {
    typeof data[f] !== 'undefined' && (arr[f] = data[f]);
  });

  return arr;
}
