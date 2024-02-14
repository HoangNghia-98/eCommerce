'use strict'

require('dotenv').config()

const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const { checkOverload } = require('./helpers/check.connect')
const routes = require('./routes')

const app = express()

// init middlewares
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())

// setting body parser, cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// init database
require('./dbs/init.mongodb')
checkOverload()

// init routers
app.use('', routes)

// handling error

module.exports = app