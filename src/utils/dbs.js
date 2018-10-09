'use strict';

const mysql = require("mysql");

require('dotenv').config()
let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;

let report = require("./report");

let con;

// connectionLimit: 15,
// queueLimit: 30,
// acquireTimeout: 1000000
function handleDisconnect() {
    con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    }); // Recreate the connection, since
    // the old one cannot be reused.

    con.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            err_s(err)
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
        console.log('db error', err.message, err.code, err.errno);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}
handleDisconnect();

let _ = {};
let errors = {
    1045: 'ER_ACCESS_DENIED_ERROR', //
    1062: 'ER_DUP_ENTRY',
};
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
_.checkUserPrefs = (msg) => {
    return new Promise(function(resolve, reject) {
        console.log('user db check start')
        const check = `SELECT * FROM userPrefs WHERE id = ${msg.from.id} LIMIT 1` //WHERE id = ${msg.from.id}
        con.query(check, function(err, result) {
            if (err != null) { // && err.errno == 1062
                err_s(err)
                reject(err)
            } else if (result == '') {
                _.addUser(msg)
                resolve(null)
                return report.user(msg, 'addedToDB', `added user to database`) //add addedToDB to user report switch
            } else if (result[0] != null) { // && checkWaht == 'langPref'
                resolve([result[0].langPref, result[0].descPref, result[0].srcPref])
            } else {
                // err_s(err)
                reject(err)
                throw err;
            }
        })
    })
}

_.changeUserLangPrefs = (msg, ops) => {
    let lang;
    switch (ops) {
        case 'setHebrew':
            lang = 'he'
            break;
        case 'setEnglish':
            lang = 'en'
            break;
        default:
            lang = 'en'
            break;
    }
    let changeLang = `UPDATE userPrefs SET langPref = ${mysql.escape(lang)} WHERE id = ${mysql.escape(msg.from.id)}`;
    con.query(changeLang, function(err, result) {
        if (err != null && err.errno == 1062) {
            console.log(JSON.stringify(err));
            // bot.sendMessage(msg.from.id, 'lang exits?')
        } else if (err == null) {
            // console.log('result', result);
            // console.log("lang changed");
            dataOnUser[msg.from.id]['lang'] = lang;
            return report.user(msg, 'DB_langChange', `Language changed to ${lang}`) //add DB_langChange to user report switch
                // bot.sendMessage(msg.from.id, 'lang changed')
        } else {
            err_s(err)
            console.error(err.message);
            // throw err;
        }
    });
};
_.changeUserDescPrefs = (msg, descSetting) => {
    let changeDesc = `UPDATE userPrefs SET descPref = ${mysql.escape(descSetting)} WHERE id = ${mysql.escape(msg.from.id)}`;
    con.query(changeDesc, function(err, result) {
        if (err != null && err.errno == 1062) {
            // console.log('\n\n\n-------1062')

            console.log(JSON.stringify(err));
            // bot.sendMessage(msg.from.id, 'desc exits?')
        } else if (err == null) {
            // console.log('result', result);
            // console.log("lang changed");
            dataOnUser[msg.from.id]['desc'] = descSetting;
            return report.user(msg, 'DB_descChange', `Description changed to ${descSetting.replace('_','-')}`) //add DB_descChange to user report switch
                // bot.sendMessage(msg.from.id, 'desc changed')
        } else {
            // console.log('\n\n\n-------9')

            err_s(err)
            console.error(err.message);
            // throw err;
        }
    });
};
_.changeUserSrcPrefs = (msg, srcSetting) => {
    let changeDesc = `UPDATE userPrefs SET srcPref = ${mysql.escape(srcSetting)} WHERE id = ${mysql.escape(msg.from.id)}`;
    con.query(changeDesc, function(err, result) {
        if (err != null && err.errno == 1062) {
            console.log(JSON.stringify(err));
            // bot.sendMessage(msg.from.id, 'desc exits?')
        } else if (err == null) {
            dataOnUser[msg.from.id]['src'] = srcSetting;
            return report.user(msg, 'DB_srcChange', `Source changed to ${srcSetting}`) //add DB_descChange to user report switch
                // bot.sendMessage(msg.from.id, 'desc changed')
        } else {
            // console.log('\n\n\n-------9')

            err_s(err)
            console.error(err.message);
            // throw err;
        }
    });
};


// _.setUserLangPrefs = (msg, ops) => {
//     let lang;
//     switch (ops) {
//         case 'setHebrew':
//             lang = 'he'
//         case 'setEnglish':
//             lang = 'en'
//         default:
//             lang = 'en'
//     }
//     let changeLang = `INSERT INTO userPrefs (langPref) VALUES ('${lang}')`;
//     con.query(changeLang, function(err, result) {
//         if (err != null && err.errno == 1062) {
//             console.log(JSON.stringify(err));
//             bot.sendMessage(msg.from.id, 'lang exits?')
//         } else if (err == null) {
//             console.log('result', result);
//             console.log("lang changed");
//             bot.sendMessage(msg.from.id, 'lang changed')
//         } else {
//             console.error(err.message);
//             // throw err;
//         }
//     });
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

_.addUser = (msg) => {
    let addUser = `INSERT INTO userPrefs (ID, LastName, FirstName, UserName) VALUES (${msg.from.id},'${msg.from.last_name}','${msg.from.first_name}','${msg.from.username}')`;
    con.query(addUser, function(err, result) {
        if (err != null && err.errno == 1062) {
            // console.log(err.errno);
            bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${msg.from.id}, User already in DB`)
        } else if (err == null) {
            // console.log('result', result);
            console.log("added user");
            bot.sendMessage(process.env.DEV_TELEGRAM_ID, `[${msg.from.id}](tg://user?id=${msg.from.id}), User added to DB succesfully`, { notification: false, parseMode: "markdown" })
        } else throw err;
    });
};
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

function err_s(err) {
    console.log('\n\n\n-------')
    if (err.errno == 1045) {
        console.log(err.message)
        let ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        let parseMode = 'Markdown';
        let host = err.sqlMessage.match(ipRegex)
            // reject(err)
        console.log('sent link to open port')
            // con.end()

        let addlink = `https://cpanel-box5167.bluehost.com/cpsess3967134238/frontend/bluehost/sql/addhost.html?host=${host}`
        return bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${err.errno}\n[add host](${addlink})\nhost: ${host}`, { parseMode })
    } else if (err.code == 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        console.log('try reconnect')
        console.log(err.message)
            // con.end()
    } else {
        console.log(err)
    }
}




module.exports = _;

// Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'jerusap9_LW'@'37.26.146.185' (using password: YES)