'use strict';


require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;
// const port = process.env.PORT || 443;
// const host = process.env.HOST;

const searcher = require('./searcher');
// let getUser = require("./search/getUserName").verifyUser;
let report = require("./report");
// let can_i = require("./can_i");
// let utils = require("./utils");
let callbackQuery = require("./callbackQuery");
let lang = require('./LANG');

// const dbs1 = require("./dbs/DBtest");
const dbs = require("./dbs/dbs");

const url = `https://${process.env.HEROKU_NAME}.herokuapp.com/bot${token}/`;

// const DEV_TELEGRAM_ID = parseInt(process.env.DEV_TELEGRAM_ID) || 0;
const ERR_CHNL_CHAT_ID = process.env.ERR_CHNL_CHAT_ID;
// const USERS_CNL = process.env.USERS_CNL;

const axios = require('axios');
// const fetch = require('node-fetch');
const baseUrl = `https://api.telegram.org/bot${token}/`;

let bot = require('./botSetup')


bot.getMe().then(function(me) { //self check
    const botName = me.username;
    console.log('---\nHello! My name is %s!', me.first_name);
    console.log(`And my username is @${ botName }\n---`);
    return botName;
});
bot.on("error", err => { //most telegram errors should get caught here
    console.log("Telegram Error " + err.error.error_code + "\nDescription: " + err.error.description + "\nfull report " + JSON.stringify(err))
    return axios.post(baseUrl + "sendMessage", {
            chat_id: ERR_CHNL_CHAT_ID,
            text: "Telegram Error " + err.error.error_code + "\nDescription: " + err.error.description + "\nfull report " + JSON.stringify(err),
            notification: false
        }).then(response => {
            return console.log('--------Telegram Error sent to error group--------')
        })
        .catch(err => {
            console.log("got error" + err)
            try {
                let errMsg = ''
                report.error(errMsg, err, false)
            } catch (e) { console.log('Error from error sender report.error did not work: ', JSON.stringify(e)) }
            return console.log('Error44 from error sender: ', err.Error)
        })
});
process.on('unhandledRejection', function(reason, p) {
    console.log("Possibly Unhandled Rejection at: Promise reason: ", reason.description, p); //  ", " p,
    try {
        let errMsg = `OK: ${reason.ok}\nError Code: ${reason.error_code}\nReason: ${reason.description}`
        report.error(errMsg, '', false)
    } catch (e) { console.log('Error report.error on unhandledRejection: ', JSON.stringify(e)) }
    // application specific logging here
});

// require("./userCache");

let dataOnUser = require("./userCache");;
let rmFrom_dataOnUser = [];
const DELAY = 60000 * 60 * 24;

// setInterval(() => {
//     console.log(dataOnUser)
// }, 1000);

function userCache(msg) {
    let userID = msg.from.id;
    //check cache, if not there, then check db, if not there, then check getUserLanguage
    if (dataOnUser[userID] === undefined) {
        dataOnUser[userID] = {};
    }
    dataOnUser[userID]['time'] = new Date().valueOf();
    if (dataOnUser[userID]['lang'] === undefined) {
        //then get it ready for next time, but dont wait now...
        dbs.checkUserLangPrefs(msg)
            .then(res => {
                if (res == null) {
                    dataOnUser[userID]['lang'] = getUserLanguage(msg)
                } else {
                    dataOnUser[userID]['lang'] = res
                }
            }).catch(function(err) {
                if (err = 'error') {
                    lang = getUserLanguage(msg)
                }
            });
        return getUserLanguage(msg)
    } else {
        return dataOnUser[userID]['lang']
    }
}

function getUserLanguage(msg) {
    let l = (msg.from != undefined && msg.from.language_code != undefined) ? msg.from.language_code.split("-")[0] : "en";
    let l2 = (msg.from != undefined && msg.from.language_code != undefined) ? msg.from.language_code : "en";
    //report.user(msg, 'lang', l2)
    switch (l) {
        case "en":
            return 'en'
        case "iw" || 'he':
            return 'he'
        default:
            return 'en'
    }
};
bot.on('/updateLang', msg => { //async
    let userLang = userCache(msg); //await

    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton(lang[userLang].setLang.en, { callback: '/english' }), bot.inlineButton(lang[userLang].setLang.he, { callback: '/hebrew' })],
        [bot.inlineButton(lang[userLang].cancel, { callback: '/cancel' })]
    ]);
    return bot.sendMessage(msg.from.id, lang[userLang].setLang.language, { replyMarkup }); //, ask: 'lang'
});
// bot.on('/change', (msg) => {
//     // console.log(msg)
//     bot.sendMessage(msg.from.id, 'ok')
//     dbs.changeUserLangPrefs(msg)
// });
// bot.on('/chktable', (msg) => {
//     // console.log(msg)
//     bot.sendMessage(msg.from.id, 'ok')
//     dbs.checkTable(msg)
// });
// bot.on('/droptable', (msg) => {
//     // console.log(msg)
//     bot.sendMessage(msg.from.id, 'ok')
//     dbs.dropTable(msg)
// });
// bot.on('/table', (msg) => {
//     // console.log(msg)
//     bot.sendMessage(msg.from.id, 'ok')
//     dbs.addTable(msg)
// });

// bot.on("text", (msg, type) => {
//     // console.log(msg)
//     if ((msg.chat.id == 1082225626 || ERR_CHNL_CHAT_ID || -284603852) && (type.type == "text")) {
//         can_i(msg, type)
//     }
// })

// bot.on('text', (msg) => msg.reply.text(msg.text, { asReply: true }));

bot.on('inlineQuery', (msg) => {
    let userLang = userCache(msg);
    // console.log(msg.from.language_code)
    let type = "inline";
    searcher.inline(type, msg, bot, userLang)
});
bot.on('callbackQuery', msg => {
    let userLang = userCache(msg);
    // console.log(msg)
    // bot.answerCallbackQuery(msg.id, { text: "Updating..." }); //
    callbackQuery(bot, msg, userLang)
});

let reactToCommand = require('./talkToBot/commands').reactToCommand;
bot.on(['*', '/*'], (msg, self) => {
    // console.log(self.type)
    // console.log(msg) //lang[userLang].feedback
    if (msg.chat.type == 'private') { //!channel
        if (self.type = ("command") && (msg.chat.id == msg.from.id)) {
            let userLang = userCache(msg);
            // console.log("command")
            reactToCommand(bot, msg, userLang)
        }
    }
});
let ask = require('./talkToBot/ask').ask;
bot.on('ask.router', msg => {
    let userLang = userCache(msg);
    // console.log('ask any', msg.ask)
    let askWhat = msg.ask
    ask(bot, msg, askWhat, userLang)
});

setInterval(() => {
    for (let userID in dataOnUser) {
        let elapsed_time = new Date().valueOf() - dataOnUser[userID]['time'];
        if (elapsed_time > DELAY) {
            try {
                rmFrom_dataOnUser.push(userID);
                console.log('removing user $s from cache', userID)
            } catch (e) {
                console.log('error :(', e)
                report.error('error :( ', e)
            }
        }
        for (let i = rmFrom_dataOnUser.length - 1; i >= 0; i--) {
            delete dataToSend[rmFrom_dataOnUser[i]];
            rmFrom_dataOnUser.splice(i, 1);
        }
    }
}, 60000 * 2 * 60);

// Call API
bot.start();