const apiKeyModel = require('../models/apikey.model')

const findAPIKey = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

module.exports = {
    findAPIKey
}