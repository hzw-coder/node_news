const express = require('express')
const path = require('path')
const indexRouter = require('./routes/index')
const passportRouter = require('./routes/passport.js')
const detailRouter = require('./routes/detail')
const profileRouter = require('./routes/profile')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const common = require('./utils/common')
const keys = require('./keys')


let appConfig = app => {
    // 配置post请求参数
    app.use(express.json()) //解析json格式
    app.use(express.urlencoded({
        extended: false
    }))

    // 注册cooki和session
    app.use(cookieSession({
        name: 'my_session',
        keys: [keys.session_key],
        maxAge: 1000 * 60 * 60 * 24 * 2
    }))

    app.use(cookieParser())

    // 注册路由
    app.use(common.csrfProtect, indexRouter)
    app.use(common.csrfProtect, passportRouter)
    app.use(common.csrfProtect, detailRouter)
    app.use(common.csrfProtect, profileRouter)
    // app.use((req, res) => {   放在此处，以下静态资源以及模板无法访问
    //     common.abort404(req, res)
    // })

    // 设置在public下查找资源(以public为根去找静态资源)
    app.use(express.static(path.join(__dirname, 'public')))

    // 引入express-art-template
    app.engine('html', require('express-art-template'))
    // 项目环境的设置 生产(线上)production  开发development
    app.set('view options', {
        debug: process.env.NODE_ENV !== 'development'
    })
    // 设置查找文件的路径
    app.set('views', path.join(__dirname, 'views'))
    // 设置模板的后缀名为html
    app.set('view engine', 'html')

    // 设置404页面
    // 该设置一定要放在最后面，防止阻止静态文件以及其他路径的访问
    app.use((req, res) => {
        common.abort404(req, res)
    })
}

module.exports = appConfig