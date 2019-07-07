const { errorMessages } = require('../../utils/messages')

module.exports.exists = async ({
  database = require('../'),
  collection,
  query
}) => {
  try {
    if (query._id) query._id = database.ObjectID(query._id)
    const db = await database.connect({})
    const exists = await db.collection(collection).findOne(query)
    return !!exists
  } catch (error) {
    console.error(
      `exists error for collection ${collection} at ${new Date().toLocaleString(
        'pt-br'
      )} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
