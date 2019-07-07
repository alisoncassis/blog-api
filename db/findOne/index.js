const { errorMessages } = require('../../utils/messages')

module.exports.findOne = async ({
  database = require('../'),
  collection,
  query,
  desiredFieldList = []
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  if (!query.userId && collection !== 'user') {
    console.log(
      `missing userId for findOne to send to database for collection ${collection} at ${executionTime}`
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
      if (query._id.$nin) {
        query._id.$nin = query._id.$nin.map(_id => database.ObjectID(_id))
      } else {
        query._id = database.ObjectID(query._id)
      }
    }
    if (query.userId) {
      if (query.userId.$ne) {
        query.userId.$ne = database.ObjectID(query.userId.$ne)
      } else {
        query.userId = database.ObjectID(query.userId)
      }
    }
    const db = await database.connect({})
    return db.collection(collection).findOne(query, { fields })
  } catch (error) {
    console.error(
      `findOne error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
