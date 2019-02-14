exports.getDataByFields = function getDataByFields (data, field) {
  if (!data || !field || !Array.isArray (field)) {
    return null;
  }

  var arr = {};

  field.forEach (f => {
    typeof data[f] !== 'undefined' && (arr[f] = data[f]);
  });

  return arr;
}

exports.checkHttpRequestHasBody = function(method){
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
  return HTTP_METHOD[method].request_body
}