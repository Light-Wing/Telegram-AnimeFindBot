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

let dataOnUser = require("./userCache");
let userCache = require('./utils').userCache;
let rmFrom_dataOnUser = [];
const DELAY = 60000 * 60 * 24;

bot.getMe().then(function(me) { //self check
        const botName = me.username;
        console.log('---\nHello! My name is %s!', me.first_name);
        console.log(`And my username is @${ botName }\n---`);
        return botName;
    }) //.then(() => {
    //update usercache from db
    // let userLang = userCache(msg);
    //need to make a function to check for db users and fill cache with the info from there...
    // });
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

// bot.on('/genre', async msg => {
//     let list = await searcher.getGenres2()
//     console.log(list)
//     bot.sendMessage(process.env.DEV_TELEGRAM_ID, list.toString()) //.replace(/,/g, '\n'))
// })
bot.on('inlineQuery', (msg) => {
    let userLang = userCache(msg);
    let lang;
    if (dataOnUser[msg.from.id]['lang'] !== (undefined && null)) {
        lang = dataOnUser[msg.from.id]['lang']
    } else {
        lang = (msg.from != undefined && msg.from.language_code != null) ? msg.from.language_code : "en";
    }
    report.user(msg, 'lang', lang)
        // console.log(userLang)

    let type = "inline";
    searcher.inline(type, msg, bot, userLang)
});
bot.on('callbackQuery', msg => {
    let userPref = userCache(msg, 'both');
    // console.log('------------', userPref)
    let lang;
    if (dataOnUser[msg.from.id]['lang'] !== (undefined && null)) {
        lang = dataOnUser[msg.from.id]['lang']
    } else {
        lang = (msg.from != undefined && msg.from.language_code != null) ? msg.from.language_code : "en";
    }
    report.user(msg, 'lang', lang)
    callbackQuery(bot, msg, userPref)
});

let reactToCommand = require('./talkToBot/commands').reactToCommand;
bot.on(['*', '/*'], (msg, self) => {
    // console.log(self)
    // console.log(msg) //lang[userLang].feedback
    if (msg.chat.type == 'private') { //!channel
        if (msg.chat.id == msg.from.id) { //self.type == ("command") && 
            let userLang = userCache(msg);
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
// setInterval(() => {
//     console.log(dataOnUser)
// }, 1000);

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

//a one time function that runs at bot strt to update cache from db

// Call API
bot.start();

// https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=jjj%40gmail%2ecom&lc=US&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHostedGuest