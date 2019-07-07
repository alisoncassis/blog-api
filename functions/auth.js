const { error, success } = require('../utils/request')
const { errorMessages } = require('../utils/messages')
const { payloadValidate, formatValidateReturn } = require('../schemas')
exports.handler = async function(
  event,
  context,
  callback,
  login = require('../utils/functions/user').login,
  generateToken = require('../utils/functions/auth').generateToken
) {
  if (event.httpMethod === 'OPTIONS') return success({})
  const handlerInitAt = new Date().toLocaleString('pt-br')
  try {
    if (event.httpMethod !== 'POST') {
      throw new Error(errorMessages.methodNotAllowed)
    }
    const validation = payloadValidate(event.body, 'auth')
    if (validation.error) {
      const validationError = formatValidateReturn(validation)
      console.error(
        `auth POST validation error starting at ${handlerInitAt} with message ${
          validationError.message
        }`
      )
      return error({
        payloadFromRequest: event.body,
        route: event.path,
        statusCode: 400,
        body: { ...validationError, statusCode: 400 }
      })
    }
    const body = JSON.parse(event.body)
    const user = await login({
      email: body.email,
      password: body.password
    })
    const token = await generateToken({
      _id: user._id,
      email: user.email
    })
    return success({
      body: {
        user,
        token
      }
    })
  } catch (err) {
    console.error(
      `auth error at method POST with params ${
        event.body
      } starting at ${handlerInitAt} with error ${err}`
    )
    return error({
      payloadFromRequest: event.body,
      route: event.path,
      body: { message: err.message, statusCode: 400 }
    })
  }
}
