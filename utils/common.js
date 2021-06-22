const handleDB = require('../db/handleDB')

function getRandomString(n) {
    var str = ''
    while (str.length < n) {
        str += Math.random().toString(36).substr(2)
    }
    return str.substr(str.length - n)
}

function csrfProtect(req, res, next) {
    let method = req.method
    if (method === 'GET') {
        let csrf_token = getRandomString(48)
        res.cookie('csrf_token', csrf_token)
        next()
    } else if (method === 'POST') {
        console.log(req.headers['x-csrftoken']);
        console.log(req.cookies['csrf_token']);

        if (req.headers['x-csrftoken'] === req.cookies['csrf_token']) {
            console.log('csrf验证通过');
            next()
        } else {
            res.send({
                errmsg: 'csrf验证不通过!!!'
            })
            return
        }
    }
}

// 获取用户登录状态
async function getUser(req, res) {
    let user_id = req.session['user_id']
    let result = []
    if (user_id) {
        result = await handleDB.queryUserId(res, user_id)

    }
    return result
}


async function getUserInfo(req, res) {
    let userInfo = await getUser(req, res)
    if (!userInfo[0]) {
        res.redirect('/')
        return
    }
    return userInfo
}

// 抛出404页面
async function abort404(req, res) {
    let userInfo = await getUser(req, res)
    let data = {
        user_info: userInfo[0] ? {
            nick_name: userInfo[0].nick_name,
            avatar_url: userInfo[0].avatar_url
        } : false
    }
    res.render('news/404', data)
}


module.exports = {
    csrfProtect,
    getUser,
    abort404,
    getUserInfo
}