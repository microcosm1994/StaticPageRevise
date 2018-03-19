const fs = require('fs')
const path = require('path')
const template_url = '../template'

exports.template_list = (req, res) =>{
    let result = {
        status: 0,
        message: '模板列表获取成功'
    }
    fs.readdir(path.join(__dirname,template_url), (err, files) => {
        if (err) throw err
        if (files) {
            result.data = files
            res.json(result)
        } else {
            result.status = 1
            result.message = '没有可用的模板列表'
            res.json(result)
        }
    })
}

exports.template_read = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件获取成功'
    }
    let filename = req.query.filename
    let url = path.join(template_url, filename)
    // mkdir(path.join(__dirname, url.replace(/\btemplate\b/, 'views')))
    travel(path.join(__dirname, url), function (pathname) {
        let views_url1 = pathname.replace(/\btemplate\b/, 'views')
        let readable=fs.createReadStream(pathname)//创建读取流
        let writable=fs.createWriteStream(views_url1)//创建写入流
        readable.pipe(writable)
    })
    res.json(result)
}

/**
 * 复制文件夹
 * */
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function(file) {
        let pathname = path.join(dir, file)
        if(fs.statSync(pathname).isDirectory()) {
            mkdir(pathname.replace(/\btemplate\b/, 'views'))
            travel(pathname, callback)
        }else {
            callback(pathname)
        }
    })
}

/**
 * 创建文件夹
 * */
function mkdir (url) {
    if (fs.existsSync(url)) {
        return true
    } else {
        if (mkdir(path.dirname(url))) {
            fs.mkdirSync(url)
            return true
        }
    }
}


