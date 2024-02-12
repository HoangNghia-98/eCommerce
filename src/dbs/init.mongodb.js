'use strict'

const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect');
const { db: { host, port, name }  } = require('../configs/config')

const connectionString = `mongodb://${host}:${port}/${name}`
const MAX_POLL_SIZE = 50;
const TIME_OUT_CONNECT = 3000;

class Database {
    constructor() {
        this.connectMongoDB()
    }

    //connect
    connectMongoDB() {
        if (process.env.NODE_ENV === 'dev') {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: TIME_OUT_CONNECT,
            maxPoolSize: MAX_POLL_SIZE
        })
            .then(() => {
                try {
                    console.log(`Connected to MongoDB PRO`)
                    countConnect()
                } catch (error) {
                    console.log(error)
                }
            })
            .catch(err => console.log(`Error connecting to MongoDB: `, err))

        mongoose.connection.on('connected', () => {
            console.log('Mongodb connected to db success');
        });
        mongoose.connection.on('error', err => {
            console.error('Mongodb connected to db error' + err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongodb disconnected db success');
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB