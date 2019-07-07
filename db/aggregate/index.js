const { errorMessages } = require('../../utils/messages')

module.exports.aggregate = async ({
  database = require('../'),
  collection,
  query,
  aggregations = [],
  limit = 20
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId) {
    console.log(
      `missing userId for aggregate to send to database for collection ${collection} at ${executionTime}`
    )
    throw new Error(errorMessages.internalServerError)
  }
  try {
    if (query.userId) query.userId = database.ObjectID(query.userId)
    if (query._id && query._id.$lt) {
      query._id.$lt = database.ObjectID(query._id.$lt)
    }
    const aggregation = [{ $match: query }]
    if (aggregations.length > 0) aggregation.push(...aggregations)
    const db = await database.connect({})
    return db
      .collection(collection)
      .aggregate(aggregation)
      .limit(limit)
      .toArray()
  } catch (error) {
    console.error(
      `aggregate error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
