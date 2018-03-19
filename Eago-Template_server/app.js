const express = require('express')
const path = require('path')
const file_router = require(path.join(__dirname,'router/file_router.js'))

const app = express()
app.use('/',function (req, res, next) {
    next()
})
app.use('/file',file_router)

const server = app.listen(3000,() => {
    console.log('success')
})