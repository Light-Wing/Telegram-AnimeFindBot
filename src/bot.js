'use strict';

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;

// const url = `https://${process.env.HEROKU_NAME}.herokuapp.com/bot${token}/`;

// const DEV_TELEGRAM_ID = parseInt(process.env.DEV_TELEGRAM_ID) || 0;
const ERR_CHNL_CHAT_ID = process.env.ERR_CHNL_CHAT_ID;
// const USERS_CNL = process.env.USERS_CNL;

const axios = require('axios');
// const fetch = require('node-fetch');
const baseUrl = `https://api.telegram.org/bot${token}/`;

let bot = require('./botSetup').bot;

let dataOnUser = require('./botSetup').dataOnUser;
let userCache = require('./utils/utils').userCache;

let report = require("./utils/report");
const searcher = require('./respond/search');

let askRouter = require('./respond/ask').ask;
let commandRouter = require('./respond/commands').reactToCommand;
let channelFinder = require('./respond/channelFinder');
let callbackQuery = require("./respond/callbackQuery");

// let lang = require('./LANG');

let rmFrom_dataOnUser = [];
const DELAY = 60000 * 60 * 24; //one day

// setInterval(() => {
//     console.log(dataOnUser)
// }, 3000)

bot.getMe().then(function (me) { //self check
    const botName = me.username;
    console.log('---\nHello! My name is %s!', me.first_name);
    console.log(`And my username is @${botName}\n---`);
    return botName;
})
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
process.on('unhandledRejection', function (reason, p) {
    if (reason.error_code == 429) {
        return setTimeout(() => {
            let errMsg = `OK: ${reason.ok}\nError Code: ${reason.error_code}\nReason: ${reason.description}`
            report.error(errMsg, '', false)
        }, 60000)
    }
    console.log("Possibly Unhandled Rejection at: Promise reason: ", reason.description, p); //  ", " p,
    try {
        let errMsg = `OK: ${reason.ok}\nError Code: ${reason.error_code}\nReason: ${reason.description}`
        report.error(errMsg, '', false)
    } catch (e) { console.log('Error report.error on unhandledRejection: ', JSON.stringify(e)) }
    // application specific logging here
});

bot.on('inlineQuery', (msg) => {
    userCache(msg);
    let lang = (dataOnUser[msg.from.id]['lang'] !== (undefined && null)) ? dataOnUser[msg.from.id]['lang'] : msg.from.language_code;
    report.user(msg, 'lang', lang)
    // console.log(userLang)

    let type = "inline";
    searcher.inline(msg, type)
    return
});

bot.on('callbackQuery', msg => {
    userCache(msg);
    // console.log('------------', msg)
    // return bot.answerCallbackQuery(msg.id, { text: msg.data })
    let lang = (dataOnUser[msg.from.id]['lang'] !== (undefined && null)) ? dataOnUser[msg.from.id]['lang'] : msg.from.language_code;
    report.user(msg, 'lang', lang)
    callbackQuery(msg)
    return
});

// { id: -1001295220327,title: 'ערוצי אנימה',username: 'channel_animes',type: 'channel' }


bot.on('forward', (msg) => {
    userCache(msg);
    return channelFinder.reactToForward(msg);
});
bot.on('ask.router', msg => {
    userCache(msg);
    let askWhat = msg.ask
    askRouter(msg, askWhat)
    return
});
bot.on(/\/\w+/, (msg, self) => {
    if (msg.chat.type == 'supergroup') {
        userCache(msg)
        return channelFinder.searchText(msg);
    }
    // console.log(self);
    // console.log('/command', msg);
    if (msg.chat.type == 'private') {
        userCache(msg)
        commandRouter(msg)
    };
    //lang[userLang].feedback
});
//bot.on(['*'], msg => {
//  console.log(msg)
//})






setInterval(() => {
    for (let userID in dataOnUser) {
        let elapsed_time = new Date().valueOf() - dataOnUser[userID]['time'];
        if (elapsed_time > DELAY) { //if its more then a day
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
}, 60000 * 2 * 60); //2 hours

// Call API
bot.start();