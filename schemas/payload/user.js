module.exports = {
  POST: joi =>
    joi.object().keys({
      name: joi.string().required(),
      email: joi
        .string()
        .email()
        .required(),
      password: joi.string().required()
    }),
  PUT: joi =>
    joi.object().keys({
      name: joi.string()
    })
}
