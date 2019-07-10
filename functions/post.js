const { error, success } = require('../utils/request')
const { errorMessages } = require('../utils/messages')
const {
  payloadValidate,
  formatValidateReturn,
  queryParamsValidate
} = require('../schemas')

exports.handler = async function (
  event,
  context,
  callback,
  verify = require('../utils/functions/auth').verify,
  post = require('../utils/functions/post')
) {
  if (event.httpMethod === 'OPTIONS') return success({})
  const handlerInitAt = new Date().toLocaleString('pt-br')
  let currentUserId
  try {
    const method = event.httpMethod
    const decodedToken = await verify(event.headers.authorization)
    currentUserId = decodedToken._id
    console.info(
      `post handler init wih method ${method} for user ${currentUserId} at ${handlerInitAt}`
    )
    const matchedId = event.path.match(/\/post\/(\w+)/)
    const _id = matchedId ? matchedId[1] : null
    if (!_id && ['DELETE', 'PUT'].includes(method)) {
      console.error(
        `post ${method} missing id for user ${currentUserId} starting at ${handlerInitAt}`
      )
      return error({
        route: event.path,
        payloadFromRequest: event.body,
        statusCode: 400,
        body: { field: '_id', message: '_id is required', statusCode: 400 }
      })
    }
    if (['POST', 'PUT'].includes(method)) {
      const parsedBody = JSON.parse(event.body)
      if (parsedBody.slug && parsedBody.slug.includes(' ')) {
        return error({
          route: event.path,
          payloadFromRequest: event.body,
          statusCode: 400,
          body: {
            field: 'slug',
            message: 'slug should not contain empty spaces',
            statusCode: 400
          }
        })
      }

      const validation = payloadValidate(event.body, 'post', method)
      if (validation.error) {
        const validationError = formatValidateReturn(validation)
        console.error(
          `post ${method} validation error starting at ${handlerInitAt} for user ${currentUserId} with message ${
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
    if (method === 'GET') {
      const validation = queryParamsValidate(
        event.queryStringParameters,
        'post'
      )
      if (validation.error) {
        const validationError = formatValidateReturn(validation)
        console.error(
          `post ${method} validation error starting at ${handlerInitAt} for user ${currentUserId} with message ${
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
        result = _id
          ? await post.getById(_id, {
            userId: currentUserId
          })
          : await post.get({
            ...event.queryStringParameters,
            userId: currentUserId
          })
        break
      case 'DELETE':
        result = await post.exclude(_id, { userId: currentUserId })
        break
      case 'POST':
        result = await post.save({
          ...JSON.parse(event.body),
          userId: currentUserId,
          author: decodedToken.name
        })
        break
      case 'PUT':
        result = await post.update(_id, {
          ...JSON.parse(event.body),
          userId: currentUserId
        })
        break
      default:
        throw new Error(errorMessages.methodNotAllowed)
    }
    return success({ body: result })
  } catch (err) {
    console.error(
      `post error at method ${
        event.httpMethod
      } with user ${currentUserId} starting at ${handlerInitAt} with error ${err}`
    )
    return error({
      route: event.path,
      payloadFromRequest: event.body,
      body: { message: err.message, statusCode: 400 }
    })
  }
}
