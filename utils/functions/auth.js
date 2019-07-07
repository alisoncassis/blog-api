const jwt = require('jsonwebtoken')
const { decrypt, encrypt } = require('../hashes')
const { errorMessages } = require('../messages')
const { exists } = require('../../db/exists')

const validateToken = async data => {
  try {
    const { _id, email } = data
    const query = { _id, email, deleted: 0 }
    const isValid = await exists({ collection: 'user', query })
    return !!isValid
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}
module.exports.validateToken = validateToken

module.exports.generateToken = data =>
  jwt.sign({ data: encrypt(data) }, process.env.SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: 60 * 60
  })

module.exports.verify = async token => {
  if (!token) throw new Error(errorMessages.invalidCredentials)
  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  const decrypted = JSON.parse(decrypt(decoded.data))
  const isValid = await validateToken(decrypted)
  if (isValid) return decrypted
  throw new Error(errorMessages.invalidCredentials)
}
