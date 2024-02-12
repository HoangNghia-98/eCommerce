const mongoose = require('mongoose')

const connectionString = 'mongodb://127.0.0.1:27017/eCommerce'

mongoose.connect(connectionString)
    .then(() => console.log(`Connected Mongodb Success`))
    .catch(err => console.log(`Error Connect Mongodb ::: ${err}`))

module.exports = mongoose