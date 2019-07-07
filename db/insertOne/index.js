const { errorMessages } = require('../../utils/messages')

module.exports.insertOne = async ({
  database = require('../'),
  collection,
  body = {}
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!body.userId && collection !== 'user') {
    console.log(
      `missing userId for insertOne to send to database for collection ${collection} at ${executionTime}`
    )
    throw new Error(errorMessages.internalServerError)
  }
  try {
    if (body.userId) body.userId = database.ObjectID(body.userId)
    const db = await database.connect({})
    const result = await db.collection(collection).insertOne(body)
    return { ...body, _id: result.insertedId }
  } catch (error) {
    console.error(
      `insertOne error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
