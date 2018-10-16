'use strict';

const mysql = require("mysql");

require('dotenv').config()
let bot = require('../botSetup').bot;
// let dataOnUser = require('../botSetup').dataOnUser;
// let report = require("./report");

// let con;

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

let _ = {};

_.searchForAnimeChannel = (searchText) => { //callback, 
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err);
                // callback(true);
                reject(err)
                return;
            }
            const sql = `SELECT searchText,srcChannel,msgForwardID FROM AnimeChannels WHERE searchText LIKE '%${searchText.trim()}%' LIMIT 1`
            connection.query(sql, [], function(err, results) {
                connection.release(); // always put connection back in pool after last query
                if (err) {
                    console.log(err);
                    // callback(true);
                    reject(err)
                    return;
                } //else if (results[0]){
                resolve(results)
                return
                // } else {
                //     reject(err)
                //     return;
                // }
                // callback(false, results); //check if results have anything at all and do somthing with it
            });
        });
    })
};
_.addSearchEntry = (msg) => { // callback, 
    let caption = msg.caption.includes("t.me" || "telegram.me") ? msg.caption.split("t.me" || "telegram.me")[0].replace(/https?:\/\//g, " ").replace(/\n{1,}/g, " ") : msg.caption;
    let searchText = caption.replace(/\`|\\|\'/g, '').toString(),
        srcChannel = msg.forward_from_chat.id,
        msgForwardID = msg.forward_from_message_id;
    pool.getConnection(function(err, connection) {
        if (err) {
            bot.sendMessage(process.env.DEV_TELEGRAM_ID, err)
            console.log(err);
            // callback(true);
            return;
        }
        const sql = `INSERT INTO AnimeChannels (searchText, srcChannel, msgForwardID) VALUES ('${searchText}',${srcChannel},${msgForwardID})`;
        connection.query(sql, [], function(err, results) {
            connection.release(); // always put connection back in pool after last query
            if (err != null && err.errno == 1062) {
                // console.log(err.errno);
                // callback(true);
                bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${searchText}\nalready in DB`)
                if (process.env.DEV_TELEGRAM_ID != msg.from.id) {
                    bot.sendMessage(msg.from.id, `${searchText}\nalready in DB`)
                }
            } else if (err == null) {
                bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${searchText}\nadded to DB succesfully`, { notification: false, parseMode: "markdown" })
                if (process.env.DEV_TELEGRAM_ID != msg.from.id) {
                    bot.sendMessage(msg.from.id, `${searchText}\nadded to DB succesfully`, { notification: false, parseMode: "markdown" })
                }
            } else {
                bot.sendMessage(process.env.DEV_TELEGRAM_ID, err)
                throw err;
            }
            // callback(false, results); //check if results have anything at all and do somthing with it
        });
    });
};

_.removeSearchEntry = (idToRemove, txtToShow) => { // callback, 
    pool.getConnection(function(err, connection) {
        if (err) {
            bot.sendMessage(process.env.DEV_TELEGRAM_ID, err)
            console.log(err);
            // callback(true);
            return;
        }
        const sql = `DELETE FROM AnimeChannels WHERE AnimeChannels.msgForwardID = ${idToRemove}`;
        connection.query(sql, [], function(err, results) {
            connection.release(); // always put connection back in pool after last query
            if (err) {
                // console.log(err.errno);
                // callback(true);
                bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${idToRemove}\n${txtToShow}\ndid not delete`)
            } else {
                bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${idToRemove}\n${txtToShow}\ndeleted old entery`, { notification: false, parseMode: "markdown" })
            }
            // callback(false, results); //check if results have anything at all and do somthing with it
        });
    });
};
// let errors = {
//     1045: 'ER_ACCESS_DENIED_ERROR', //
//     1062: 'ER_DUP_ENTRY',
// };

// function handleDisconnect() {
//     con = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USERNAME,
//         password: process.env.DB_PASS,
//         database: process.env.DB_DATABASE,
//     }); // Recreate the connection, since
//     // the old one cannot be reused.

//     con.connect(function(err) { // The server is either down
//         if (err) { // or restarting (takes a while sometimes).
//             err_s(err) //what does this do?
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
//         } // to avoid a hot loop, and to allow our node script to
//     }); // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     con.on('error', function(err) {
//         console.log('db error', err.message, err.code, err.errno ? err.errno : "");
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect(); // lost due to either server restart, or a
//         } else { // connnection idle timeout (the wait_timeout server variable configures this)
//             throw err;
//         }
//     });
// }
// handleDisconnect();

// err.code: 'ER_ACCESS_DENIED_ERROR'
// err.code: 'PROTOCOL_ENQUEUE_HANDSHAKE_TWICE' 
// err.errno: 1045
// err.sqlMessage: "Access denied for user \'jerusap9_LW\'@\'141.226.11.164\' (using password: YES)", - 1045
// err.sqlMessage: "Duplicate entry '0' for key 'PRIMARY'" - 1062
//
// err.sqlState: '28000',
// err.fatal: true
// ER_NO_SUCH_TABLE
// PROTOCOL_ENQUEUE_HANDSHAKE_TWICE
// ER_PARSE_ERROR
// PROTOCOL_ENQUEUE_AFTER_QUIT
// PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR

// _.tryStart = () => {
//     con.connect(function(err) {
//         // if (err) throw err;
//         if (err != null && err.errno == 1045) {
//             console.log(err);
//             console.log(err.errno);
//             let ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
//             let parseMode = 'Markdown';
//             let host = err.sqlMessage.match(ipRegex)
//             let addlink = `https://cpanel-box5167.bluehost.com/cpsess3967134238/frontend/bluehost/sql/addhost.html?host=${host}`
//             bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${err.errno}\n[add host](${addlink})\nhost: ${host}`, { parseMode })
//         } else if (err != null && err.errno != 1045) {
//             console.log(err);
//             console.log(err.errno);
//             errMsg = "DB error: ";
//             report.error(errMsg, err.stack, false);
//         } else {
//             console.log("Connected!");
//             bot.sendMessage(process.env.DEV_TELEGRAM_ID, `DB Connected!`)
//         }
//     });
//     // setTimeout(() => { con.end() }, 100)
// }

// _.searchForAnimeChannel = (msg) => {
//     return new Promise(function(resolve, reject) {
//         console.log('anime db search')
//         const check = `SELECT * FROM AnimeChannels WHERE searchText LIKE '%${msg.text}%' LIMIT 5` //WHERE id = ${msg.from.id}
//         con.query(check, function(err, result) {
//             if (err != null) { // && err.errno == 1062
//                 err_s(err) //what does this do?
//                 reject(err);
//             } else if (result == '') {
//                 resolve(null);
//                 // return report.user(msg, 'addedToDB', `added user to database`) //add addedToDB to user report switch
//             } else if (result[0] != null) { // && checkWaht == 'langPref'
//                 resolve(result);
//             } else {
//                 // err_s(err) //what does this do?
//                 reject(err);
//                 throw err;
//             }
//         })
//     })
// }

// _.checkUserExists = (msg) => {
//         const check = `SELECT * FROM userPrefs WHERE id = ${msg.from.id} LIMIT 5` //WHERE id = ${msg.from.id}
//         con.query(check, function(err, result, fields) {
//             if (err != null) { // && err.errno == 1062
//                 console.log(err.errno);
//             } else if (result == '') {
//                 _.addUser(msg).then(() => {
//                     con.query(check, function(err, result, fields) {
//                         if (err) throw err;
//                         return result
//                     })
//                 })
//             } else if (err == null) {
//                 // console.log('result', result);
//                 // bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
//                 // console.log(fields);
//                 return result
//             } else throw err;
//         });
//     };
// _.getField = (msg) => {
//     const check = `SELECT * FROM userPrefs LIMIT 10` //WHERE id = ${msg.from.id}
//     con.query(check, function(err, result, fields) {
//         if (err != null) { // && err.errno == 1062
//             console.log(err.errno);
//         } else if (err == null) {
//             console.log('result', result);
//             bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
//             console.log(fields);
//             return result
//         } else throw err;
//     });
// }

// _.addSearchEntry = (msg) => {
//     let searchText, srcChannel, msgForwardID;
//     let addSearchEntry = `INSERT INTO AnimeChannels (searchText, srcChannel, msgForwardID) VALUES ('${searchText}',${srcChannel},${msgForwardID})`;
//     con.query(addSearchEntry, function(err, result) {
//         if (err != null && err.errno == 1062) {
//             // console.log(err.errno);
//             bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${searchText}, already in DB`)
//         } else if (err == null) {
//             bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${searchText} added to DB succesfully`, { notification: false, parseMode: "markdown" })
//         } else throw err;
//     });
// };
// _.addTable = (msg) => {
//     var create_table = `CREATE TABLE IF NOT EXISTS userPrefs (
//         ID int NOT NULL,
//         LastName varchar(255),
//         FirstName varchar(255) NOT NULL,
//         UserName varchar(255),
//         langPref varchar(10),
//         PRIMARY KEY(ID))`;
//     con.connect(function(err) {
//         if (err) {
//             console.log(JSON.stringify(err))

//             // throw err;
//         }
//         console.log("Connected!");
//         con.query(create_table, function(err, result) {
//             if (err) throw err;
//             bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
//             console.log("added");
//         });
//     });
// }
// _.dropTable = (msg) => {
//     var create_table = "DROP TABLE IF EXISTS userPrefs";
//     con.connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");
//         con.query(create_table, function(err, result) {
//             if (err) throw err;
//             bot.sendMessage(msg.from.id, JSON.stringify(result))
//             console.log("DROPPED");
//         });
//     });
// }

// _.checkTable = (msg) => {
//     const check = `SELECT * FROM userPrefs LIMIT 10` // LIMIT 5 WHERE id = ${msg.from.id}
//     con.connect(function(err) { //ER_NO_SUCH_TABLE
//         if (err) throw err;
//         console.log("Connected!");
//         con.query(check, function(err, result, fields) {
//             if (err) throw err;
//             bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
//             console.log("added" + JSON.stringify(result));
//         });
//     });
// }

module.exports = _;