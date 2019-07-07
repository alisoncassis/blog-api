const { errorMessages } = require('../../utils/messages')

module.exports.updateMany = async ({
  database = require('../'),
  collection,
  query,
  body = {}
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId) {
    console.log(
      `missing userId for updateMany to send to database for collection ${collection} at ${executionTime}`
    )
    throw new Error(errorMessages.internalServerError)
  }
  try {
    if (query.userId) query.userId = database.ObjectID(query.userId)
    if (query._id && query._id.$in) {
      query._id.$in = query._id.$in.map(_id => database.ObjectID(_id))
    }
    const db = await database.connect({})
    const result = await db.collection(collection).updateMany(query, body)
    return result.matchedCount === result.modifiedCount
  } catch (error) {
    console.error(
      `updateMany error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
