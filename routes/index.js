const express = require('express')
const router = express.Router()
const handleDB = require('../db/handleDB')
require('../utils/filters')
const common = require('../utils/common')

// 首页接口
router.get('/', (req, res) => {
    (async function () {
        // 设置用户登录状态
        let userInfo = await common.getUser(req, res)
        // 头部分类信息
        let result2 = await handleDB.queryCategory(res)

        // 点击量查询
        let result3 = await handleDB.queryClicks(res)
        // 向前端传递需要渲染的数据
        let data = {
            user_info: userInfo[0] ? {
                nick_name: userInfo[0].nick_name,
                avatar_url: userInfo[0].avatar_url
            } : false,
            category: result2,
            newsClick: result3
        }
        res.render('news/index', data)
    })()
})

router.get('/news_list', (req, res) => {
    (async function () {
        // 获取参数
        let {
            cid = 1, per_page = 5, page = 1
        } = req.query // 设置默认值

        // 查询数据库
        let result = await handleDB.queryNewList(res, page, cid, per_page)

        // 计算总页数
        let result2 = await handleDB.queryNewsCounts(res, cid)
        let totalPage = Math.ceil(result2[0]['count(*)'] / per_page)
        res.send({
            newsList: result,
            totalPage,
            currentPage: Number(page)
        })
    })()
})


module.exports = router