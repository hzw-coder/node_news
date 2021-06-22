const express = require('express')
const appConfig = require('./config')
const app = express()

appConfig(app)


app.listen(3000, () => {
    console.log('server is running...');
})