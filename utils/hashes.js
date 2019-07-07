module.exports.decrypt = (hash, Cryptr = require('cryptr'), key = process.env.ENCRYPTION_KEY) => {
  const cryptr = new Cryptr(key)
  return cryptr.decrypt(hash)
}
module.exports.encrypt = (data, Cryptr = require('cryptr'), key = process.env.ENCRYPTION_KEY) => {
  const cryptr = new Cryptr(key)
  return cryptr.encrypt(JSON.stringify(data))
}
