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

// handling errors
const { logErrorMiddleware, returnError, is404Handler, isOperationalError } = require("./middleware/errorHandler");
const { exit } = require("./middleware/common");
app.use(is404Handler)
app.use(logErrorMiddleware)
app.use(returnError)

// if the Promise is rejected this will catch it
process.on('SIGINT', () => {
    console.log('Ctrl + C:: Service stop!!!')
    exit()
});  // CTRL+C
process.on('SIGQUIT', () => {
    console.log('Keyboard quit:: Service stop!!!')
    exit()
}); // Keyboard quit
process.on('SIGTERM', () => {
    console.log('Kill command:: Service stop!!!')
    exit()
}); // `kill` command

// catch all uncaught exceptions
process.on('unhandledRejection', error => {
    throw error
})

process.on('uncaughtException', error => {
    // if isOperational is false -> exit service
    if (!isOperationalError(error)) {
        exit()
    }
})

module.exports = app