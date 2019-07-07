const { findOne } = require('../../db/findOne')
const { find } = require('../../db/find')
const { insertOne } = require('../../db/insertOne')
const { findOneAndUpdate } = require('../../db/findOneAndUpdate')

const { errorMessages } = require('../messages')
const defaultDesiredFieldList = ['content']

const get = async ({ userId, lastId = undefined, limit = undefined }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { userId, deleted: 0 }
    if (lastId) query._id = { $lt: lastId }
    const posts = await find({
      collection: 'post',
      query,
      desiredFieldList,
      limit
    })
    return posts
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const getById = async (_id, { userId }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { _id, userId, deleted: 0 }
    const post = await findOne({
      collection: 'post',
      query,
      desiredFieldList
    })
    if (!post) throw new Error(errorMessages.notFound)
    return post
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const save = async ({ content, userId }) => {
  try {
    const now = new Date().toISOString()
    const body = {
      deleted: 0,
      createdAt: now,
      updatedAt: now,
      content,
      userId
    }
    const post = await insertOne({ collection: 'post', body })
    delete post.deleted
    delete post.userId
    return post
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const update = async (_id, { content = undefined, userId }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const body = {
      $set: {
        updatedAt: new Date().toISOString()
      }
    }
    if (content !== undefined) body.$set.content = content
    const post = await findOneAndUpdate({
      collection: 'post',
      query: { _id, userId, deleted: 0 },
      body,
      desiredFieldList
    })
    if (!post) throw new Error(errorMessages.notFound)
    return post
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const exclude = async (_id, { userId }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const body = {
      $set: {
        deleted: 1,
        updatedAt: new Date().toISOString()
      }
    }
    const post = await findOneAndUpdate({
      collection: 'post',
      query: { _id, userId },
      body,
      desiredFieldList
    })
    if (!post) throw new Error(errorMessages.notFound)
    return post
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

module.exports.get = get
module.exports.getById = getById
module.exports.save = save
module.exports.update = update
module.exports.exclude = exclude
