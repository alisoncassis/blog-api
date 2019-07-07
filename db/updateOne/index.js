const { errorMessages } = require('../../utils/messages')

module.exports.updateOne = async ({
  database = require('../'),
  collection,
  query,
  body = {}
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId) {
    console.log(
      `missing userId for updateOne to send to database for collection ${collection} at ${executionTime}`
    )
    throw new Error(errorMessages.internalServerError)
  }
  try {
    if (query.userId) query.userId = database.ObjectID(query.userId)
    if (query._id) query._id = database.ObjectID(query._id)
    const db = await database.connect({})
    const result = await db.collection(collection).updateOne(query, body)
    return result.matchedCount === 1
  } catch (error) {
    console.error(
      `updateOne error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
