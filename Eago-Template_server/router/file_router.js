const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const router = express.Router()
const file_control = require(path.join(__dirname,'../control/file_control.js'))

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/template_list', jsonParser, file_control.template_list)
router.get('/template_read', jsonParser, file_control.template_read)

module.exports = router