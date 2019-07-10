const { error, success } = require('../utils/request')
const { errorMessages } = require('../utils/messages')
const { payloadValidate, formatValidateReturn } = require('../schemas')

exports.handler = async function (
  event,
  context,
  callback,
  verify = require('../utils/functions/auth').verify,
  user = require('../utils/functions/user')
) {
  if (event.httpMethod === 'OPTIONS') return success({})
  const handlerInitAt = new Date().toLocaleString('pt-br')
  let currentUserId
  try {
    const method = event.httpMethod
    const body = JSON.parse(event.body)
    let decodedToken
    if (method !== 'POST') {
      decodedToken = await verify(event.headers.authorization)
      currentUserId = decodedToken._id
    }
    console.info(
      `user handler init wih method ${method} for user ${currentUserId} at ${handlerInitAt}`
    )
    if (['POST', 'PUT'].includes(method)) {
      const validation = payloadValidate(body, 'user', method)
      if (validation.error) {
        const validationError = formatValidateReturn(validation)
        console.error(
          `user ${method} validation error starting at ${handlerInitAt} for user ${currentUserId} with message ${
            validationError.message
          }`
        )
        return error({
          route: event.path,
          payloadFromRequest: event.body,
          statusCode: 400,
          body: { ...validationError, statusCode: 400 }
        })
      }
    }
    let result
    switch (method) {
      case 'GET':
        result = await user.getById({ _id: currentUserId })
        break
      case 'POST':
        result = await user.save({ ...body })
        break
      case 'PUT':
        result = await user.update(currentUserId, {
          ...body
        })
        break
      case 'DELETE':
        result = await user.exclude(currentUserId)
        break
      default:
        throw new Error(errorMessages.methodNotAllowed)
    }
    return success({ body: result })
  } catch (err) {
    console.error(
      `user error at method ${
        event.httpMethod
      } with user ${currentUserId} starting at ${handlerInitAt}  with error ${err}`
    )
    return error({
      route: event.path,
      payloadFromRequest: event.body,
      body: { message: err.message, statusCode: 400 }
    })
  }
}
