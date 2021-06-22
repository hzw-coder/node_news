const express = require('express')
const Captcha = require('../utils/captcha/index')
const router = express.Router()
const handleDB = require('../db/handleDB')
const md5 = require('md5')
const keys = require('../keys')
const jwt = require('jsonwebtoken')

// 获取验证码接口
router.get('/passport/image_code/:float', (req, res) => {
    let captchaObj = new Captcha()
    let captcha = captchaObj.getCode()
    // captcha.text  验证码文本
    // captcha.data  图片验证码
    // 保存成图片到session
    req.session['ImageCode'] = captcha.text
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(captcha.data)
})

// 注册接口
router.post('/passport/register', (req, res) => {
    (async function () {
        // 获取请求参数
        let {
            username,
            image_code,
            password,
            agree
        } = req.body

        if (!username || !image_code || !password || !agree) {
            res.send({
                errmsg: '缺少参数'
            })
            return
        }

        if (image_code.toLowerCase() !== req.session['ImageCode'].toLowerCase()) {
            res.send({
                errmsg: '验证码错误'
            })
            return
        }
        // 查询数据库
        let result = await handleDB.queryUser(res, username)
        if (result.length > 0) {
            res.send({
                errmsg: '该用户已被注册,请重新注册'
            })
            return
        }
        // 添加数据
        let result2 = await handleDB.addUser(res,
            username,
            md5(md5(password) + keys.password_key),
            username,
            new Date().toLocaleString()
        )
        // result2.insertId插入数据时,自动生成这个id
        // 保持用户的登录状态
        req.session['user_id'] = result2.insertId

        // 设置最后一次登录时间(修改字段)
        await handleDB.updateTime(res, result2.insertId, new Date().toLocaleString())

        // 注册成功
        res.send({
            errno: '0',
            errmsg: '注册成功'
        })
    })()



})

// 登录接口
router.post('/passport/login', (req, res) => {
    (async function () {
        let {
            username,
            password
        } = req.body

        if (!username || !password) {
            res.send({
                errmsg: '用户名或密码不能为空!'
            })
            return
        }
        // let result = await handleDB.login(res, username, md5(md5(password) + keys.password_key))
        // if (result.length <= 0) {
        //     res.send({
        //         errmsg: '用户名或密码错误'
        //     })
        //     return
        // }

        let loginResult = await handleDB.queryUser(res, username)
        if (loginResult <= 0) {
            res.send({
                errno: '-1',
                errmsg: "用户名不存在"
            })
            return
        } else {
            var result = await handleDB.login(res, username, md5(md5(password) + keys.password_key))
            if (result.length <= 0) {
                res.send({
                    errmsg: '用户名或密码错误'
                })
                return
            }
        }

        // 设置登录状态
        req.session['user_id'] = result[0].id
        // 设置最后一次登录时间(修改字段)
        await handleDB.updateTime(res, result[0].id, new Date().toLocaleString())

        res.send({
            errno: '0',
            errmsg: '登录成功'
        })
    })()
})

// 退出登录
router.post('/passport/logout', (req, res) => {
    // 删除(session)登录状态
    delete req.session['user_id']
    res.send({
        errno: '0',
        errmsg: '退出登录成功'
    })
})

// 生成token
router.get('/passport/token', (req, res) => {
    // Restful风格
    // 生成token
    const token = jwt.sign({
        ID: 1,
        username: 'zhangsan'
    }, keys.jwt_salt, {
        expiresIn: 60 * 60 * 2
    })
    // 颁发
    res.send({
        errmsg: 'success',
        errno: '0',
        reson: '登陆请求',
        result: {
            token
        }
    })
})

module.exports = router