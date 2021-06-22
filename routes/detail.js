const express = require('express')
const handleDB = require('../db/handleDB')
const router = express.Router()
require('../utils/filters')
const common = require('../utils/common')

router.get('/news_detail/:news_id', (req, res) => {
    (async function () {
        // 设置用户登录状态
        let userInfo = await common.getUser(req, res)
        // 右侧点击排行查询
        let result3 = await handleDB.queryClicks(res)
        let {
            news_id
        } = req.params

        let newsResult = await handleDB.queryNewsDetail(res, news_id)

        // 为空
        if (!newsResult[0]) {
            common.abort404(req, res)
            return
        }

        // 点击数+1
        newsResult[0].clicks += 1
        await handleDB.updateClicks(res, newsResult[0].clicks, news_id)

        // 是否收藏
        let isCollected = false
        if (userInfo[0]) { // 已经登录
            // 查询数据库看是否已经收藏
            let collectResult = await handleDB.queryCollection(res, userInfo[0].id, news_id)
            if (collectResult[0]) {
                isCollected = true
            }
        }
        // 查询新闻所有评论
        let commentList = await handleDB.queryCommentList(res, news_id)

        // 添加评论者的头像和昵称
        for (let i = 0; i < commentList.length; i++) {
            let commenterResult = await handleDB.queryUserId(res, commentList[i].user_id)
            commentList[i].commenter = {
                nick_name: commenterResult[0].nick_name,
                avatar_url: commenterResult[0].avatar_url ? commenterResult[0].avatar_url : '/news/images/worm.jpg'
            }
            // 存在parent_id则添加
            if (commentList[i].parent_id) {
                // 查询父评论
                var parentComment = await handleDB.queryParentComment(res, commentList[i].parent_id)
                // 查询父昵称
                var parentUserInfo = await handleDB.queryUserId(res, parentComment[0].user_id)
                commentList[i].parent = {
                    user: {
                        nick_name: parentUserInfo[0].nick_name
                    },
                    content: parentComment[0].content
                }
            }
        }
        // 查询该用户点赞过的评论
        let user_like_comments_ids = []
        if (userInfo[0]) {
            let user_like_commentsResult = await handleDB.queryLike(res, userInfo[0].id)
            user_like_commentsResult.forEach(item => {
                user_like_comments_ids.push(item.comment_id)
            })
        }

        // 查询新闻作者的信息
        let authorInfo = await handleDB.queryUserId(res, newsResult[0].user_id)

        let authorNewsCount = await handleDB.queryAuthorNewsCount(res, authorInfo[0].id)

        // 查询粉丝数
        let fansCount = await handleDB.queryFans(res, authorInfo[0].id)

        // 是否关注作者
        let isFollowed = false
        if (userInfo[0]) { // 已经登录
            // 查询数据库看是否已经关注
            let followResult = await handleDB.queryFollow(res, userInfo[0].id, authorInfo[0].id)
            if (followResult[0]) {
                isFollowed = true
            }
        }

        let data = {
            user_info: userInfo[0] ? {
                nick_name: userInfo[0].nick_name,
                avatar_url: userInfo[0].avatar_url ? userInfo[0].avatar_url : '/news/images/worm.jpg'
            } : false,
            newsClick: result3,
            newsData: newsResult[0],
            isCollected,
            commentList,
            user_like_comments_ids,
            authorInfo: authorInfo[0],
            authorNewsCount: authorNewsCount[0]['count(*)'],
            fansCount: fansCount[0]['count(*)'],
            isFollowed
        }

        res.render('news/detail', data)
    })()

})

// 收藏操作
router.post('/news_detail/news_collect', (req, res) => {
    (async function () {
        let userInfo = await common.getUser(req, res)
        if (!userInfo[0]) {
            res.send({
                errno: '4101'
            })
            return
        }
        let {
            news_id,
            action
        } = req.body
        if (!news_id || !action) {
            res.send({
                errmsg: '参数错误!!!'
            })
            return
        }
        let newsResult = await handleDB.queryNewsDetail(res, news_id)
        if (!newsResult[0]) {
            res.send({
                errmsg: '无该新闻'
            })
            return
        }
        if (action == 'collect') {
            // 收藏
            await handleDB.collectAction(res, action, userInfo[0].id, news_id)
        } else {
            // 取消收藏
            await handleDB.collectAction(res, action, userInfo[0].id, news_id)
        }

        res.send({
            errno: '0',
            errmsg: '操作成功'
        })

    })()
})

// 评论和回复提交
router.post('/news_detail/news_comment', (req, res) => {
    (async function () {
        let userInfo = await common.getUser(req, res)
        if (!userInfo[0]) {
            res.send({
                errno: '4101'
            })
            return
        }
        // 接收参数
        let {
            news_id,
            comment,
            parent_id = null
        } = req.body
        if (!news_id || !comment) {
            res.send({
                errmsg: '参数错误'
            })
            return 0
        }
        // 查询新闻
        let newsResult = await handleDB.queryNewsDetail(res, news_id)
        if (!newsResult[0]) {
            res.send({
                errmsg: '无该新闻'
            })
            return
        }

        if (parent_id) {
            // 查询父评论
            var parentComment = await handleDB.queryParentComment(res, parent_id)
            // 查询父昵称
            var parentUserInfo = await handleDB.queryUserId(res, parentComment[0].user_id)
        }


        // 插入评论
        let insertResult = await handleDB.submitComment(res, userInfo[0].id, news_id, comment, parent_id)
        // 返回给前端的数据
        let data = {
            user: {
                avatar_url: userInfo[0].avatar_url ? userInfo[0].avatar_url : '/news/images/worm.jpg',
                nick_name: userInfo[0].nick_name
            },
            content: comment,
            create_time: new Date().toLocaleString(),
            news_id: news_id,
            id: insertResult.insertId,
            parent: parent_id ? {
                user: {
                    nick_name: parentUserInfo[0].nick_name
                },
                content: parentComment[0].content
            } : null
        }
        // 响应
        res.send({
            errno: '0',
            errmsg: '评论成功',
            data,
        })
    })()
})

// 点赞处理
router.post('/news_detail/comment_like', (req, res) => {
    (async function () {
        let userInfo = await common.getUser(req, res)
        if (!userInfo[0]) {
            res.send({
                errno: '4101',
                errmsg: '用户未登录!!!'
            })
            return
        }
        // 获取前端传来的参数
        let {
            comment_id,
            action
        } = req.body
        if (!comment_id || !action) {
            res.send({
                msg: '参数错误!!!'
            })
            return
        }
        // 查询评论是否存在
        let commentResult = await handleDB.queryComment(res, comment_id)
        if (!commentResult[0]) {
            res.send({
                errmsg: '无该评论'
            })
            return
        }

        if (action == 'add') { // 点赞
            await handleDB.addLike(res, comment_id, userInfo[0].id)
            // +1
            var like_count = commentResult[0].like_count ? commentResult[0].like_count + 1 : 1
        } else { // 取消
            await handleDB.cancleLike(res, comment_id, userInfo[0].id)
            // -1
            var like_count = (commentResult[0].like_count || !0) ? commentResult[0].like_count - 1 : 0
        }
        // 更新数据库点赞数
        await handleDB.updateLike(res, comment_id, like_count)

        res.send({
            errno: '0',
            errmsg: '操作成功'
        })

    })()
})

// 关注处理
router.post('/news_detail/followed_user', (req, res) => {
    (async function () {
        let userInfo = await common.getUser(req, res)
        if (!userInfo[0]) {
            res.send({
                errno: '4101'
            })
            return
        }
        let {
            user_id,
            action
        } = req.body
        if (!user_id || !action) {
            res.send({
                errmsg: '参数错误!!!'
            })
            return
        }
        if (user_id == userInfo[0].id) {
            res.send({
                errmsg: '不能关注自己'
            })
            return
        }

        // 查询作者是否存在
        let userResult = await handleDB.queryUserId(res, user_id)
        if (!userResult[0]) {
            res.send({
                errmsg: '无该新闻'
            })
            return
        }
        if (action == 'follow') {
            // 关注
            await handleDB.followAction(res, action, userInfo[0].id, user_id)
        } else {
            // 取消关注
            await handleDB.followAction(res, action, userInfo[0].id, user_id)
        }

        res.send({
            errno: '0',
            errmsg: '操作成功'
        })
    })()
})

module.exports = router