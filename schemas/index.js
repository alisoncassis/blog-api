const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

module.exports.payloadValidate = (body, schema, method = null) => {
  const payloadSchema = require(`./payload/${schema}`)
  const payloadSchemaFunction = method ? payloadSchema[method] : payloadSchema
  return joi.validate(body, payloadSchemaFunction(joi))
}

module.exports.queryParamsValidate = (query, schema) =>
  joi.validate(query, require(`./queryParams/${schema}`)(joi))

module.exports.formatValidateReturn = validated => ({
  message: validated.error.details[0].message,
  field: validated.error.details[0].path[0]
})
