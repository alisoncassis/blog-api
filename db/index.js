let db = null
module.exports = {
  connect: async ({
    dbUser = process.env.DB_USER,
    dbHost = process.env.DB_HOST,
    dbPassword = process.env.DB_PASSWORD,
    dbName = process.env.DB_NAME,
    dbPort = process.env.DB_PORT,
    mongoClient = require('mongodb').MongoClient
  }) => {
    try {
      const url =
        dbUser && dbPassword
          ? `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`
          : `mongodb://${dbHost}:${dbPort}/${dbName}`

      if (db) return db
      const client = await mongoClient.connect(url, { useNewUrlParser: true })
      db = client.db(dbName)
      return db
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  },
  ObjectID: require('mongodb').ObjectID
}
