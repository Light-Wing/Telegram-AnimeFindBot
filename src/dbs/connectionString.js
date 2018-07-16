var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 100,
    host: '162.241.224.74',
    port: 3306,
    user: 'jerusap9_light',
    password: 'ManMan770',
    database: 'jerusap9_telegram_bot_db',
});

exports.getConnection = function(callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            return callback(err);
        }
        callback(err, conn);
    });
};


// var mysql = require('mysql');
// var pool  = mysql.createPool(...);

// pool.getConnection(function(err, connection) {
//   if (err) throw err; // not connected!

//   // Use the connection
//   connection.query('SELECT something FROM sometable', function (error, results, fields) {
//     // When done with the connection, release it.
//     connection.release();

//     // Handle error after the release.
//     if (error) throw error;

//     // Don't use the connection here, it has been returned to the pool.
//   });
// });