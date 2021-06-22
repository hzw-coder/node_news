const mysql = require('mysql')

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'news'
})

let query = (sql, callback) => {
    pool.getConnection((err, connection) => {
        connection.query(sql, (err, rows) => {
            callback(err, rows)
            connection.release()
        })
    })
}

exports.query = query