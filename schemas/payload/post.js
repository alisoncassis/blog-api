module.exports = {
  POST: joi =>
    joi.object().keys({
      content: joi.string().required(),
      title: joi.string().required(),
      slug: joi.string().required(),
      mainImageUrl: joi.string().uri().required()
    }),
  PUT: joi =>
    joi.object().keys({
      content: joi.string(),
      title: joi.string(),
      slug: joi.string(),
      mainImageUrl: joi.string().uri()
    })
}
