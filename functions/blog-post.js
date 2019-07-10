const { error, success } = require('../utils/request')
const { errorMessages } = require('../utils/messages')
const { formatValidateReturn, queryParamsValidate } = require('../schemas')

exports.handler = async function (
  event,
  context,
  callback,
  post = require('../utils/functions/post')
) {
  if (event.httpMethod === 'OPTIONS') return success({})
  const handlerInitAt = new Date().toLocaleString('pt-br')
  try {
    const method = event.httpMethod
    if (method !== 'GET') {
      throw new Error(errorMessages.methodNotAllowed)
    }
    console.info(`post handler init wih method GET at ${handlerInitAt}`)
    const matchedSlug = event.path.match(/\/blog-post\/(\S+)/)
    const slug = matchedSlug ? matchedSlug[1] : null
    if (method === 'GET') {
      const validation = queryParamsValidate(
        event.queryStringParameters,
        'post'
      )
      if (validation.error) {
        const validationError = formatValidateReturn(validation)
        console.error(
          `post ${method} validation error starting at ${handlerInitAt} with message ${
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
        result = slug
          ? await post.getBySlug({
            slug
          })
          : await post.get({
            ...event.queryStringParameters
          })
        break
    }
    return success({ body: result })
  } catch (err) {
    console.error(
      `post error at method ${
        event.httpMethod
      } starting at ${handlerInitAt} with error ${err}`
    )
    return error({
      route: event.path,
      payloadFromRequest: event.body,
      body: { message: err.message, statusCode: 400 }
    })
  }
}
