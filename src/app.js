const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const { checkOverload } = require('./helpers/check.connect')

const app = express()

// init middlewares
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())

// init database
require('./dbs/init.mongodb')
checkOverload()

// init routers
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: `Wellcome to eCommerce app`,
        metadata: 'Test compression middleware '.repeat(10000)
    })
})

// handling error

module.exports = app