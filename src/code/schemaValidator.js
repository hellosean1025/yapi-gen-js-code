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