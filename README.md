# yapi-gen-js-code

根据 YApi 的接口定义生成 javascript 的请求函数，目前内置了 axios 请求模板

## 安装

```
npm i -g yapi-gen-js-code

```

## 使用

1.首先需要创建 `yapi-gen.config.js` 配置文件，如下所示：

```js
module.exports = {
  server: 'http://127.0.0.1:3000',
  token: '1f048e410bc22208297dec1113136cda58306d28fb0fa819652e659b16764be6',
  categoryId: 323
}

```

2.在当前目前执行 yapi-gen-js-code

```
yapi-gen-js-code
```

执行完成后，即可生成 yapi-gen-js-code.js 请求文件

## yapi-gen.config.js配置项说明

| name | 类型 | 默认值 | 描述信息 |  
| ---- | --- | --- | ---- | 
| server | String | - | 服务器地址，比如: http://yapi.demo.qunar.com | 
| token | String | - | 项目token |  
| dist | String | - | 生成文件路径 |  
| template | String Or Function | axios | 模板名，目前仅内置了 axios 模板，自定义请查看下面文档 | 
| globalCode | String |const axios = require('axios'); | 全局代码，会注入到最前面 |  
| methodName | Function | 请参考源码 | 方法名生成函数，一般无需改动 |
| categoryId | String | - | 项目分类id, 填写后只生成某个分类下的接口，默认生成该项目所有接口请求代码 | 


## 自定义模板

自定义模板就是写一个函数，返回一个 request 函数片段，接收两个参数，第一个 baseinfo,包含了请求 url, method, 请求参数等

```js
{
  template: function(){
    return `function request(baseinfo, options = {}){
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
      }`
  }
}


```
