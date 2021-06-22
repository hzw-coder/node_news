const express = require('express')
const handleDB = require('../db/handleDB')
const router = express.Router()
const md5 = require('md5')
const keys = require('../keys')
require('../utils/filters')
const common = require('../utils/common')
const multer = require('multer')
const upload = multer({
    dest: 'public/news/upload/avatar'
})


router.get('/profile', (req, res) => {
    (async function () {
        let userInfo = await common.getUserInfo(req, res)

        let data = {
            user_info: {
                nick_name: userInfo[0].nick_name,
                avatar_url: userInfo[0].avatar_url ? userInfo[0].avatar_url : '/news/images/worm.jpg'
            },
        }
        res.render('news/user', data)
    })()
})

// 基本信息页面
router.all('/user/base_info', (req, res) => {
    (async function () {
        let userInfo = await common.getUserInfo(req, res)

        if (req.method == 'GET') {

            let data = {
                nick_name: userInfo[0].nick_name,
                signature: userInfo[0].signature,
                gender: userInfo[0].gender ? userInfo[0].gender : 'MAN'
            }
            res.render('news/user_base_info', data)
        } else if (req.method == 'POST') {
            let {
                signature,
                nick_name,
                gender
            } = req.body
            if (!signature || !nick_name || !gender) {
                res.send({
                    errmsg: '缺少必填参数!!!'
                })
                return
            }
            await handleDB.updateUser(res, userInfo[0].id, nick_name, signature, gender)

            res.send({
                errno: '0',
                errmsg: '修改用户信息成功'
            })
        }
    })()
})

// 密码修改
router.all('/user/pass_info', (req, res) => {
    (async function () {
        let userInfo = await common.getUserInfo(req, res)

        if (req.method == 'GET') {
            res.render('news/user_pass_info')
        } else if (req.method == 'POST') {
            let {
                old_password,
                new_password,
                new_password2
            } = req.body
            if (!old_password || !new_password || !new_password2) {
                res.send({
                    errmsg: "密码不能为空"
                })
                return
            }
            if (new_password !== new_password2) {
                res.send({
                    errmsg: '两次密码不一致'
                })
                return
            }
            if (md5(md5(old_password) + keys.password_key) !== userInfo[0].password_hash) {
                res.send({
                    errmsg: '旧密码错误'
                })
                return
            }
            await handleDB.updatePassword(res, userInfo[0].id, md5(md5(new_password) + keys.password_key))

            res.send({
                errno: '0',
                errmsg: '修改密码成功'
            })
        }
    })()
})

router.get('/user/pic_info', (req, res) => {
    res.render('news/user_pic_info')
})

// 修改头像
router.post('/user/pic_info', upload.single("avatar"), (req, res) => {
    (async function () {
        res.send({
            errmsg: '暂不支持该服务',
            errno: '40'
        })
        return
    })()
})

//展示收藏界面 
router.get('/user/collection', (req, res) => {
    (async function () {
        let userInfo = await common.getUserInfo(req, res)
        let {
            p = 1
        } = req.query
        let currentPage = p

        let counts = await handleDB.queryCollectionCounts(res, userInfo[0].id)
        let totalPage = Math.ceil(counts[0]['count(*)'] / 10)


        let collectionNewsIdList = await handleDB.queryCollectionNewList(res, userInfo[0].id, currentPage)

        let collectionNewsList = []
        for (var i = 0; i < collectionNewsIdList.length; i++) {
            // collectionNewsIdList[i].news_id
            let ret = await handleDB.queryNewsDetail(res, collectionNewsIdList[i].news_id)
            collectionNewsList.push(ret[0])
        }

        let data = {
            currentPage,
            totalPage,
            collectionNewsList,
        }
        res.render('news/user_collection', data)
    })()


})


module.exports = router