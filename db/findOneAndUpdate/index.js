const { errorMessages } = require('../../utils/messages')

module.exports.findOneAndUpdate = async ({
  database = require('../'),
  collection,
  query,
  body = {},
  desiredFieldList = []
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId && collection !== 'user') {
    console.log(
      `missing userId for findOneAndUpdate to send to database for collection ${collection} at ${executionTime}`
    )
    throw new Error(errorMessages.internalServerError)
  }
  try {
    const fields = {}
    if (desiredFieldList.length > 0) {
      desiredFieldList.forEach(key => {
        fields[key] = 1
      })
    }
    if (query.userId) query.userId = database.ObjectID(query.userId)
    if (query._id) query._id = database.ObjectID(query._id)
    const db = await database.connect({})
    const result = await db
      .collection(collection)
      .findOneAndUpdate(query, body, {
        projection: fields,
        returnOriginal: false
      })
    return result.value
  } catch (error) {
    console.error(
      `findOneAndUpdate error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
