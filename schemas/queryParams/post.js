module.exports = joi =>
  joi.object().keys({
    lastId: joi.objectId(),
    limit: joi
      .number()
      .integer()
      .max(100)
  })
