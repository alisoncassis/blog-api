const { errorMessages } = require('../../utils/messages')

module.exports.insertMany = async ({
  database = require('../'),
  collection,
  list
}) => {
  const executionTime = new Date().toLocaleString('pt-br')
  try {
    for (const item of list) {
      if (!item.userId) {
        console.log(
          `missing userId for insertMany to send to database for collection ${collection} at ${executionTime}`
        )
        throw new Error(errorMessages.internalServerError)
      }
      if (item.userId) item.userId = database.ObjectID(item.userId)
    }
    const db = await database.connect({})
    const result = await db.collection(collection).insertMany(list)
    for (let index = 0; index < list.length; index++) {
      list[index]._id = result.insertedIds[index]
    }
    return list
  } catch (error) {
    console.error(
      `insertMany error for collection ${collection} at ${executionTime} with message ${error}`
    )
    throw new Error(errorMessages.internalServerError)
  }
}
