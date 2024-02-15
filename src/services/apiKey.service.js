const { catchAsync } = require('../middleware/catch.async')
const apiKeyModel = require('../models/apikey.model')

const findById = catchAsync(async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
})

module.exports = {
    findById
}