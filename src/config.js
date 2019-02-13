const path = require('path')


module.exports = {
  template: 'axios',
  globalCode: `const axios = require('axios'); \n`,
  categoryId: null,
  methodName: function(apipath, method){
    let  apipaths = apipath.split('/');
    let name = []
    if(apipath.indexOf(':') > 0){
      name = [method.toLowerCase()]
    }else if(apipath.indexOf('{') > 0 && apipath.indexOf('}') > 0){
      name = [method.toLowerCase()]
    }
    if(apipaths.length > 1){
      name = [].concat(name,[
        apipaths[apipaths.length - 2],
        apipaths[apipaths.length - 1]
      ])
    }else if(apipaths.length === 1){
      name = [].concat(name, [apipaths[0]])
    }
    name = name.map(p=>{
      return p.replace(/[^a-zA-Z0-9\_]+/g, '')
    })
    return name.join('_')
  },
  server: '',
  token: '项目token',
  dist: path.resolve(process.cwd(), 'yapi-gen-js-code.js')
}