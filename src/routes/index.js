const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')

// init routes
router.use('/v1/api', authRoutes)

module.exports = router