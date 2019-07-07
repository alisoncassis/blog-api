module.exports = {
  POST: joi =>
    joi.object().keys({
      content: joi.string().required()
    }),
  PUT: joi =>
    joi.object().keys({
      content: joi.string().required()
    })
}
