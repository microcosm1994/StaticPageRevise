const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const async = require('async')
const template_url = '/home/demo.eago.world/template'
const views_url = '/home/demo.eago.world/views'

exports.template_list = (req, res) => {
    let result = {
        status: 0,
        message: '模板列表获取成功'
    }
    fs.readdir(path.join(template_url), (err, files) => {
        if (err) throw err
        if (files) {
            result.data = []
            for (let i = 0; i < files.length; i++) {
                let template = {}
                template.filename = files[i]
                template.fileurl = 'http://demo.eago.world/template/' + files[i]
                result.data.push(template)
            }
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
        message: '模板文件复制成功'
    }
    let filename = req.query.filename
    let url = path.join(template_url, filename)
    travel(path.join(url), function (pathname) {
        let views_url1 = pathname.replace(/\btemplate\b/, 'views')
        let readable = fs.createReadStream(pathname)//创建读取流
        let writable = fs.createWriteStream(views_url1)//创建写入流
        readable.pipe(writable)
    })
    result.data = {
        url: path.join(views_url, filename)
    }
    res.json(result)
}

exports.revise_view = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件修改成功'
    }
    let data = req.body
    let url = path.join(views_url, data.name, 'index.html')
    async.auto({
        func1: function (callback) {
            fs.readFile(url, 'utf8', function (err, file) {
                if (err) throw err
                if (file) {
                    callback(null, file)
                } else {
                    result.status = 1
                    result.message = '没有获取到模板内容'
                    res.json(result)
                }
            })
        },
        func2: ['func1', function (results, callback) {
            const $ = cheerio.load(results.func1.toString())
            let obj = data.value
            for (let key in obj) {
                let k = key
                let value = obj[key]
                if (value) {
                    if (k === 'title') {
                        $('h1').text(value)
                    }
                    if (k === 'url') {
                        $('a').attr('href', value)
                    }
                    if (k === 'btn') {
                        $('.btn>a').text(value)
                    }
                }
            }
            callback(null, $.html())
        }],
        func3: ['func2', function (results, callback) {
            fs.writeFile(url, results.func2, 'utf8', function (err, data) {
                if (err) throw err
                callback(null)
            })
        }]
    }, function (err, results) {
        if (err) throw err
        res.json(result)
    })
}

exports.deletedir = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件已删除'
    }
    let dirname = req.query.name
    deletedir(path.join(views_url, dirname))
    res.json(result)
}

exports.uploadlogo = (req, res) => {
    let result = {
        status: 0,
        message: '图片上传成功'
    }
    let imgurl = path.join(views_url, req.body.name, 'img')
    if (fs.existsSync(imgurl)) {
        let readable = fs.createReadStream(path.join('/usr/local/server/uploads/', req.file.filename))//创建读取流
        let writable = fs.createWriteStream(path.join(imgurl, req.file.originalname))//创建写入流
        readable.pipe(writable)
    } else {
        mkdir(imgurl)
        let readable = fs.createReadStream(path.join('/usr/local/server/uploads/', req.file.filename))//创建读取流
        let writable = fs.createWriteStream(path.join(imgurl, req.file.originalname))//创建写入流
        readable.pipe(writable)
    }
    if (fs.existsSync(path.join(imgurl, req.file.originalname))){
        async.auto({
            func1: function (callback) {
                fs.readFile(path.join(views_url, req.body.name, 'index.html'), 'utf8', function (err, file) {
                    if (err) throw err
                    if (file) {
                        callback(null, file)
                    } else {
                        result.status = 1
                        result.message = '没有获取到模板内容'
                        res.json(result)
                    }
                })
            },
            func2: ['func1', function (results, callback) {
                const $ = cheerio.load(results.func1.toString())
                if (req.body.type === 'logo') $('.logo>img').attr('src', './img/' + req.file.originalname)
                if (req.body.type === 'banner') $('.banner>img').attr('src', './img/' + req.file.originalname)
                if (req.body.type === 'regex') {
                    $('img[src ="' + req.body.imgurl_regex + '" ]').attr('src', './img/' + req.file.originalname)
                }
                callback(null, $.html())
            }],
            func3: ['func2', function (results, callback) {
                fs.writeFile(path.join(views_url, req.body.name, 'index.html'), results.func2, 'utf8', function (err, data) {
                    if (err) throw err
                    callback(null)
                })
            }]
        }, function (err, results) {
            if (err) throw err
            res.json(result)
        })
    } else {
        result.status = 1
        result.message = '操作失败,请稍后再试'
        res.json(result)
    }
}

/**
 * 复制文件夹
 * */
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        let pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
            let domain_url = pathname.replace(/\btemplate\b/, 'views')
            mkdir(domain_url)
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

/**
 * 创建文件夹
 * */
function mkdir(url) {
    if (fs.existsSync(url)) {
        return true
    } else {
        if (mkdir(path.dirname(url))) {
            fs.mkdirSync(url)
            return true
        }
    }
}

/**
 * 删除文件夹
 * */
function deletedir(path) {
    let files = []
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function(file, index) {
            var curPath = path + "/" + file
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deletedir(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        });
        fs.rmdirSync(path)
    }
}

