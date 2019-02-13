const rewire = require("rewire");
const genCode = rewire('../demo/yapi-gen-js-code')
const test = require('ava')


genCode.__set__({
  'axios': (params)=>{
    return params;
  }
})

test('test restful api', async t=>{
  let data = await genCode.get_restful_id({
    id: '11'
  })
  t.is(data.url, '/api/restful/11')
  t.is(data.method, 'GET')
})

test('test form api', async t=>{
  let data = genCode.api_form({
    xxx: '1111',
    yyyy: '2222'
  })
  t.is(data.url, '/api/form');
  t.is(data.method, 'POST');
  t.deepEqual(data.data, {
    xxx: '1111',
    yyyy: '2222'
  })
})

test('api_jsonschema', async t=>{
  let data = genCode.api_jsonschema({
    a: '1111',
    b: '333',
    c: '2222'
  })
  t.is(data.url, '/api/jsonschema');
  t.is(data.method, 'POST');
  t.deepEqual(data.data, {
    a: '1111',
    b: '333',
    c: '2222'
  })
})

