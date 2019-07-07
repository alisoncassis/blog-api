const { errorMessages } = require('../../utils/messages')

module.exports.find = async ({
  database = require('../'),
  collection,
  query,
  desiredFieldList = [],
  limit = 100,
  withoutUserId = false
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId && !withoutUserId) {
    console.log(
      `missing userId for find to send to database for collection ${collection} at ${executionTime}`
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
    if (query._id) {
      if (query._id.$lt) query._id.$lt = database.ObjectID(query._id.$lt)
      if (query._id.$in) {
        query._id.$in = query._id.$in.map(_id => database.ObjectID(_id))
      }
    }
    if (query.userId) {
      if (query.userId.$in) {
        query.userId.$in = query.userId.$in.map(userId =>
          database.ObjectID(userId)
        )
      } else {
        query.userId = database.ObjectID(query.userId)
      }
    }
    const db = await database.connect({})
    const list = db
      .collection(collection)
      .find(query, { projection: fields })
      .sort({ _id: -1 })
    return limit ? list.limit(limit).toArray() : list.toArray()
  } catch (error) {
    console.error(
      `find error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
