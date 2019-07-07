const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}
module.exports.error = ({
  statusCode = 500,
  body = {},
  headers = defaultHeaders,
  route,
  payloadFromRequest
}) => {
  const {
    invalidCredentials,
    invalidPassword,
    invalidQuantity,
    methodNotAllowed,
    notFound,
    dataDoesNotExist,
    internalServerError,
    userAlreadyExist,
    slugAlreadyExist
  } = require('./messages').errorMessages
  if (
    [
      invalidPassword,
      invalidQuantity,
      dataDoesNotExist,
      userAlreadyExist,
      slugAlreadyExist
    ].includes(body.message)
  ) {
    body.statusCode = 400
    statusCode = 400
  }
  if (body.message === invalidCredentials) {
    body.statusCode = 401
    statusCode = 401
  }
  if (body.message === methodNotAllowed) {
    body.statusCode = 405
    statusCode = 405
  }
  if (body.message === internalServerError) {
    body.statusCode = 500
    statusCode = 500
  }
  if (body.message === notFound) {
    body.statusCode = 404
    statusCode = 404
  }
  console.error({ statusCode, body, route, payloadFromRequest })
  return { statusCode, headers, body: JSON.stringify({ ...body, error: true }) }
}
module.exports.success = ({
  statusCode = 200,
  body = {},
  headers = defaultHeaders
}) => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
})
