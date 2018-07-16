'use strict';

const mysql = require("mysql");

require('dotenv').config()
let bot = require('../botSetup')

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

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
setTimeout(() => {
    con.connect(function(err) {
        // if (err) throw err;
        if (err != null && err.errno == 1045) {
            console.log(err);
            console.log(err.errno);
            let ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
            let parseMode = 'Markdown';
            let host = err.sqlMessage.match(ipRegex)
            let addlink = `https://cpanel-box5167.bluehost.com/cpsess3967134238/frontend/bluehost/sql/addhost.html?host=${host}`
            bot.sendMessage(process.env.DEV_TELEGRAM_ID, `${err.errno}\n[add host](${addlink})\nhost: ${host}`, { parseMode })
        } else if (err != null && err.errno != 1045) {
            console.log(err);
            console.log(err.errno);
        } else {
            console.log("Connected!");
            // bot.sendMessage(process.env.DEV_TELEGRAM_ID, `DB Connected!`)
        }
    });
    // setTimeout(() => { con.end() }, 100)
}, 100)

_.checkUserLangPrefs = (msg) => {
    // connectFunc()
    return new Promise(function(resolve, reject) {
        console.log('user db check start')
        const check = `SELECT * FROM userPrefs WHERE id = ${msg.from.id} LIMIT 1` //WHERE id = ${msg.from.id}
        let lang;
        con.query(check, function(err, result) {
                if (err != null) { // && err.errno == 1062
                    console.log(err);
                    console.log(err.errno);
                    reject(err)
                } else if (result == '') {
                    _.addUser(msg)
                        // console.log('test1', result)
                        // bot.sendMessage(msg.from.id, 'result empty')
                    lang = null
                    resolve(null)
                } else if (result[0].langPref != null) {
                    // bot.sendMessage(msg.from.id, 'dbs not null - lang is: ' + result[0].langPref)
                    // console.log('user db check end')
                    // lang = result[0].langPref
                    resolve(result[0].langPref)
                } else if (result[0].langPref == null) {
                    // console.log('test3', result[0].langPref)
                    lang = null
                    resolve(null)
                } else if (err == null) {
                    // console.log('test4', result[0].langPref)
                    lang = result[0].langPref
                    resolve(result[0].langPref)
                } else {
                    reject(err)
                    throw err;
                }
            })
            // return lang
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
            bot.sendMessage(msg.from.id, 'lang exits?')
        } else if (err == null) {
            // console.log('result', result);
            // console.log("lang changed");
            bot.sendMessage(msg.from.id, 'lang changed')
        } else {
            console.error(err.message);
            // throw err;
        }
    });
}
_.setUserLangPrefs = (msg, ops) => {
    let lang;
    switch (ops) {
        case 'setHebrew':
            lang = 'he'
        case 'setEnglish':
            lang = 'en'
        default:
            lang = 'en'
    }
    let changeLang = `INSERT INTO userPrefs (langPref) VALUES ('${lang}')`;
    con.query(changeLang, function(err, result) {
        if (err != null && err.errno == 1062) {
            console.log(JSON.stringify(err));
            bot.sendMessage(msg.from.id, 'lang exits?')
        } else if (err == null) {
            console.log('result', result);
            console.log("lang changed");
            bot.sendMessage(msg.from.id, 'lang changed')
        } else {
            console.error(err.message);
            // throw err;
        }
    });
}

_.checkUserExists = (msg) => {
    const check = `SELECT * FROM userPrefs WHERE id = ${msg.from.id} LIMIT 5` //WHERE id = ${msg.from.id}
    con.query(check, function(err, result, fields) {
        if (err != null) { // && err.errno == 1062
            console.log(err.errno);
        } else if (result == '') {
            _.addUser(msg).then(() => {
                con.query(check, function(err, result, fields) {
                    if (err) throw err;
                    return result
                })
            })
        } else if (err == null) {
            // console.log('result', result);
            // bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
            // console.log(fields);
            return result
        } else throw err;
    });
}
_.getField = (msg) => {
    const check = `SELECT * FROM userPrefs LIMIT 10` //WHERE id = ${msg.from.id}
    con.query(check, function(err, result, fields) {
        if (err != null) { // && err.errno == 1062
            console.log(err.errno);
        } else if (err == null) {
            console.log('result', result);
            bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
            console.log(fields);
            return result
        } else throw err;
    });
}

_.addUser = (msg) => {
    var alter_table = "ALTER TABLE userPrefs ADD COLUMN id INT NOT NULL PRIMARY KEY"; // AUTO_INCREMENT
    let addUser = `INSERT INTO userPrefs (ID, LastName, FirstName, UserName) VALUES (${msg.from.id},'${msg.from.last_name}','${msg.from.first_name}','${msg.from.username}')`;
    // con.query(alter_table, function(err, result) {
    //     if (err) throw err;
    //     console.log("alter_table");
    // });
    con.query(addUser, function(err, result) {
        if (err != null && err.errno == 1062) {
            // console.log(err.errno);
            bot.sendMessage(msg.from.id, 'User already in DB')
        } else if (err == null) {
            console.log('result', result);
            console.log("added");
            bot.sendMessage(msg.from.id, 'User added to DB succesfully')
        } else throw err;
    });
}
_.addTable = (msg) => {
    var create_table = `CREATE TABLE IF NOT EXISTS userPrefs (
        ID int NOT NULL,
        LastName varchar(255),
        FirstName varchar(255) NOT NULL,
        UserName varchar(255),
        langPref varchar(10),
        PRIMARY KEY(ID))`;
    con.connect(function(err) {
        if (err) {
            console.log(JSON.stringify(err))

            // throw err;
        }
        console.log("Connected!");
        con.query(create_table, function(err, result) {
            if (err) throw err;
            bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
            console.log("added");
        });
    });
}
_.dropTable = (msg) => {
    var create_table = "DROP TABLE IF EXISTS userPrefs";
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(create_table, function(err, result) {
            if (err) throw err;
            bot.sendMessage(msg.from.id, JSON.stringify(result))
            console.log("DROPPED");
        });
    });
}

_.checkTable = (msg) => {
    const check = `SELECT * FROM userPrefs LIMIT 10` // LIMIT 5 WHERE id = ${msg.from.id}
    con.connect(function(err) { //ER_NO_SUCH_TABLE
        if (err) throw err;
        console.log("Connected!");
        con.query(check, function(err, result, fields) {
            if (err) throw err;
            bot.sendMessage(msg.from.id, 'x' + JSON.stringify(result))
            console.log("added" + JSON.stringify(result));
        });
    });
}


module.exports = _;

// Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'jerusap9_LW'@'37.26.146.185' (using password: YES)