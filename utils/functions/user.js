const { findOneAndUpdate } = require('../../db/findOneAndUpdate')
const { exists } = require('../../db/exists')
const { findOne } = require('../../db/findOne')
const { insertOne } = require('../../db/insertOne')
const { errorMessages } = require('../messages')
const defaultDesiredFieldList = ['email', 'name']

const login = async ({ email, password }) => {
  try {
    const query = { email, deleted: 0 }
    const desiredFieldList = defaultDesiredFieldList
    desiredFieldList.push('password')
    const user = await findOne({ collection: 'user', query, desiredFieldList })
    if (!user) throw new Error(errorMessages.invalidCredentials)
    const bcrypt = require('bcryptjs')
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) throw new Error(errorMessages.invalidCredentials)
    return {
      _id: user._id,
      email: user.email,
      name: user.name
    }
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const getById = async ({ _id }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { _id, deleted: 0 }
    const user = findOne({
      collection: 'user',
      query,
      desiredFieldList
    })
    if (!user) throw new Error(errorMessages.notFound)
    return user
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const getOneByFilters = async data => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const query = { ...data }
    const user = findOne({
      collection: 'user',
      query,
      desiredFieldList
    })
    if (!user) throw new Error(errorMessages.notFound)
    return user
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const save = async ({ name, email, password }) => {
  try {
    const userAlreadyExist = await exists({
      collection: 'user',
      query: { email, deleted: 0 }
    })
    if (userAlreadyExist) throw new Error('User already exist')
    const bcrypt = require('bcryptjs')
    const now = new Date().toISOString()
    const body = {
      password: bcrypt.hashSync(password, 10),
      deleted: 0,
      createdAt: now,
      updatedAt: now,
      name,
      email
    }
    const user = await insertOne({ collection: 'user', body })
    delete user.password
    delete user.deleted
    delete user.verified
    return user
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const update = async (_id, { name = undefined }) => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const body = {
      $set: {
        updatedAt: new Date().toISOString()
      }
    }
    if (name !== undefined) {
      body.$set.name = name
    }
    const updatedUser = await findOneAndUpdate({
      collection: 'user',
      query: { _id, deleted: 0 },
      body,
      desiredFieldList
    })
    if (!updatedUser) throw new Error(errorMessages.notFound)
    return updatedUser
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

const exclude = async _id => {
  try {
    const desiredFieldList = defaultDesiredFieldList
    const body = {
      $set: {
        deleted: 1,
        updatedAt: new Date().toISOString()
      }
    }
    const user = await findOneAndUpdate({
      collection: 'user',
      query: { _id },
      body,
      desiredFieldList
    })
    if (!user) throw new Error(errorMessages.notFound)
    return user
  } catch (error) {
    console.error(error)
    throw new Error(error.message || errorMessages.internalServerError)
  }
}

module.exports.login = login
module.exports.getById = getById
module.exports.save = save
module.exports.update = update
module.exports.getOneByFilters = getOneByFilters
module.exports.exclude = exclude
