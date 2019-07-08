const { findOne } = require('../../db/findOne')
const { find } = require('../../db/find')
const { insertOne } = require('../../db/insertOne')
const { findOneAndUpdate } = require('../../db/findOneAndUpdate')
const { exists } = require('../../db/exists')

const { errorMessages } = require('../messages')
const defaultDesiredFieldList = ['content', 'title', 'slug', 'mainImageUrl']

const get = async ({ userId = undefined, lastId = undefined, limit = undefined }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { deleted: 0 }
    if (userId) query.userId = userId
    if (lastId) query._id = { $lt: lastId }
    const posts = await find({
      collection: 'post',
      query,
      desiredFieldList,
      limit,
      withoutUserId: !userId
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

const getBySlug = async ({ slug }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { slug, deleted: 0 }
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

const save = async ({ content, title, slug, mainImageUrl, userId, author }) => {
  try {
    const now = new Date().toISOString()
    const body = {
      deleted: 0,
      createdAt: now,
      updatedAt: now,
      content,
      title,
      slug,
      mainImageUrl,
      userId,
      author
    }
    if (await exists({ collection: 'post', query: { slug, deleted: 0 } })) { throw new Error(errorMessages.slugAlreadyExist) }
    const post = await insertOne({ collection: 'post', body })
    delete post.deleted
    delete post.userId
    return post
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const update = async (_id, { content = undefined, title = undefined, slug = undefined, mainImageUrl = undefined, userId }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const body = {
      $set: {
        updatedAt: new Date().toISOString()
      }
    }
    if (content !== undefined) body.$set.content = content
    if (title !== undefined) body.$set.title = title
    if (slug !== undefined) body.$set.slug = slug
    if (mainImageUrl !== undefined) body.$set.mainImageUrl = mainImageUrl
    if (await exists({ collection: 'post', query: { slug, deleted: 0 } })) throw new Error(errorMessages.slugAlreadyExist)
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
module.exports.getBySlug = getBySlug
module.exports.save = save
module.exports.update = update
module.exports.exclude = exclude
