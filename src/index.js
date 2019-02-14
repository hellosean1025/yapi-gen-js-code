const axios = require ('axios');
const fs = require ('fs');
const genCode = require ('./genCode');
const json5 = require('json5');
const config = require('./config')
const {getDataByFields} = require('./utils')

function json_parse(json){
  try{
    return json5.parse(json)
  }catch(err){
    return null;
  }
}

module.exports = gen;

function errLog(message){
  console.log(message)
  process.exit(1)
} 

async function getProjectInfo(config){
  let result;
  try{
    result = await axios.get(`${config.server}/api/project/get?token=${config.token}`)
  }catch(e){
    errLog('请求 /api/project/get 失败，请检查网络或 token')
  }
  return result.data.data;
}

async function getInterfaceList(config){
  let result;
  try{
    result = await axios.get (
      `${config.server}/api/interface/list?limit=10000&token=${config.token}`
    );
    
  }catch(err){
    errLog('调用 /api/interface/list 失败，请检查网络或 token')
  }

  return result.data.data.list;
}

async function gen (options = {}) {
  Object.assign (config, options);
  const projectData = await getProjectInfo(config)
  const list = await getInterfaceList(config)

  let fields = [
    'title',
    'path',
    'method',
    'req_params',
    'req_query',
    'req_headers',
    'req_body_type',
    'req_body_is_json_schema',
    'req_body_form',
    'req_body_other',
    // 'res_body_type',   // 返回数据type
    // 'res_body_is_json_schema',  //返回数据结构是否为json-schema
    // 'res_body'  //返回数据内容
  ];
  
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
    interfaceData.path = projectData.basepath + interfaceData.path;
    interfaceList.push(interfaceData)
  }


  let code = genCode (interfaceList);

  fs.writeFileSync (config.dist, code, 'utf8');
}


