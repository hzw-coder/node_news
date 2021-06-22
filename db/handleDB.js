const db = require('./db')

// 注册查询
async function queryUser(res, username) {
    let result
    try {
        const sql = `select * from info_user where username='${username}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询用户id
async function queryUserId(res, user_id) {
    let result
    try {
        const sql = `select * from info_user where id='${user_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 注册用户
async function addUser(res, username, password_hash, nick_name, last_login) {
    let result
    try {
        const sql = `insert into info_user(username, password_hash, nick_name, last_login) values('${username}','${password_hash}','${nick_name}','${last_login}')`
        result = await new Promise((resolve, reject) => {
            // 操作数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "注册用户失败"
        })
        return
    }
    return result
}

// 登录
async function login(res, username, password_hash) {
    let result
    try {
        const sql = `select * from info_user where username='${username}' and password_hash='${password_hash}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '登录失败'
        })
        return
    }
    return result
}

// 更新最后登录时间
async function updateTime(res, id, last_login) {
    let result
    try {
        const sql = `update info_user set last_login='${last_login}' where id='${id}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '修改时间失败'
        })
        return
    }
    return result
}

// 查询分类列表
async function queryCategory(res) {
    let result
    try {
        const sql = `select name from info_category`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询点击排行
async function queryClicks(res) {
    let result
    try {
        const sql = `select * from info_news order by clicks desc limit 6`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 更新点击数
async function updateClicks(res, clicks, id) {
    let result
    try {
        const sql = `update info_news set clicks='${clicks}' where id='${id}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '修改失败'
        })
        return
    }
    return result
}

// 新闻列表查询
async function queryNewList(res, page, cid, per_page) {
    let result
    let sql
    try {
        if (cid == 1) {
            sql = `select * from info_news where 1 order by create_time desc limit ${page},${per_page}`
        } else {
            sql = `select * from info_news where category_id='${cid}' order by create_time desc limit ${page},${per_page}`
        }
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询新闻总条数
async function queryNewsCounts(res, cid) {
    let result
    let sql
    try {
        if (cid == 1) {
            sql = `select count(*) from info_news`
        } else {
            sql = `select count(*) from info_news where category_id='${cid}'`
        }
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询新闻内容
async function queryNewsDetail(res, news_id) {
    let result
    try {
        const sql = `select * from info_news where id='${news_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询收藏表
async function queryCollection(res, user_id, news_id) {
    let result
    try {
        const sql = `select * from info_user_collection where user_id='${user_id}' and news_id='${news_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 收藏操作
async function collectAction(res, action, user_id, news_id) {
    let result
    let sql
    try {
        if (action == 'collect') {
            // 收藏
            sql = `insert into info_user_collection(user_id, news_id) values('${user_id}','${news_id}')`
        } else {
            // 取消收藏
            sql = `delete from info_user_collection where user_id='${user_id}' and news_id='${news_id}'`
        }
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "操作收藏失败"
        })
        return
    }
    return result
}

// 提交评论
async function submitComment(res, user_id, news_id, content, parent_id) {
    let result
    let sql
    try {
        if (parent_id == null) {
            // 普通评论
            sql = `insert into info_comment(user_id, news_id, content) values('${user_id}','${news_id}','${content}')`
        } else {
            // 回复评论
            sql = `insert into info_comment(user_id, news_id, content, parent_id) values('${user_id}','${news_id}','${content}','${parent_id}')`
        }
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "提交评论失败"
        })
        return
    }
    return result
}

// 查询评论内容
async function queryCommentList(res, news_id) {
    let result
    try {
        const sql = `select * from info_comment where news_id='${news_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询父评论
async function queryParentComment(res, parent_id) {
    let result
    try {
        const sql = `select * from info_comment where id='${parent_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

async function queryComment(res, comment_id) {
    let result
    try {
        const sql = `select * from info_comment where id='${comment_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 添加点赞
async function addLike(res, comment_id, user_id) {
    let result
    try {
        const sql = `insert into info_comment_like(comment_id, user_id) values('${comment_id}','${user_id}')`
        result = await new Promise((resolve, reject) => {
            // 操作数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "添加失败"
        })
        return
    }
    return result
}

// 取消点赞
async function cancleLike(res, comment_id, user_id) {
    let result
    try {
        const sql = `delete from info_comment_like where user_id='${user_id}' and comment_id='${comment_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "删除失败"
        })
        return
    }
    return result
}

// 更新点赞
async function updateLike(res, comment_id, like_count) {
    let result
    try {
        const sql = `update info_comment set like_count='${like_count}' where id='${comment_id}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '修改失败'
        })
        return
    }
    return result
}

// 查询点赞
async function queryLike(res, user_id) {
    let result
    try {
        const sql = `select * from info_comment_like where user_id='${user_id}'`
        result = await new Promise((resolve, reject) => {
            // 操作数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "添加失败"
        })
        return
    }
    return result
}

// 查询作者发布的新闻总数
async function queryAuthorNewsCount(res, user_id) {
    let result
    try {
        const sql = `select count(*) from info_news where user_id='${user_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询粉丝数
async function queryFans(res, followed_id) {
    let result
    try {
        const sql = `select count(*) from info_user_fans where followed_id='${followed_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询关注
async function queryFollow(res, follower_id, followed_id) {
    let result
    try {
        const sql = `select * from info_user_fans where follower_id='${follower_id}' and followed_id='${followed_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 关注操作
async function followAction(res, action, follower_id, followed_id) {
    let result
    let sql
    try {
        if (action == 'follow') {
            // 关注
            sql = `insert into info_user_fans(follower_id, followed_id) values('${follower_id}','${followed_id}')`
        } else {
            // 取消关注
            sql = `delete from info_user_fans where follower_id='${follower_id}' and followed_id='${followed_id}'`
        }
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "操作关注失败"
        })
        return
    }
    return result
}

// 修改用户信息
async function updateUser(res, id, nick_name, signature, gender) {
    let result
    try {
        const sql = `update info_user set nick_name='${nick_name}',signature='${signature}',gender='${gender}' where id='${id}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '修改失败'
        })
        return
    }
    return result
}
// 修改密码
async function updatePassword(res, id, password_hash) {
    let result
    try {
        const sql = `update info_user set password_hash='${password_hash}'where id='${id}'`
        result = await new Promise((resolve, reject) => {
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error);
        res.send({
            errmsg: '修改失败'
        })
        return
    }
    return result
}

// 查询用户收藏数量
async function queryCollectionCounts(res, user_id) {
    let result
    try {
        const sql = `select count(*) from info_user_collection where user_id='${user_id}'`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}

// 查询个人收藏的所有新闻
async function queryCollectionNewList(res, user_id, currentPage) {
    let result
    try {
        const sql = `select * from info_user_collection where user_id='${user_id}' limit ${(currentPage-1)*10},10`
        result = await new Promise((resolve, reject) => {
            // 查询数据库
            db.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    } catch (error) {
        console.log(error)
        res.send({
            errmsg: "查询出错"
        })
        return
    }
    return result
}


module.exports = {
    queryUser,
    addUser,
    login,
    queryUserId,
    updateTime,
    queryCategory,
    queryClicks,
    queryNewList,
    queryNewsCounts,
    queryNewsDetail,
    updateClicks,
    queryCollection,
    collectAction,
    submitComment,
    queryCommentList,
    queryParentComment,
    queryComment,
    addLike,
    updateLike,
    cancleLike,
    queryLike,
    queryAuthorNewsCount,
    queryFans,
    queryFollow,
    followAction,
    updateUser,
    updatePassword,
    queryCollectionCounts,
    queryCollectionNewList
}