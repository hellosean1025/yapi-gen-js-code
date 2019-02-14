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
