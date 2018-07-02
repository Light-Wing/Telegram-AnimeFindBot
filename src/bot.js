'use strict';

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;
const port = process.env.PORT || 443;
const host = process.env.HOST;

const TeleBot = require('telebot');
const usePlugins = ['askUser', 'namedButtons', 'commandButton'];
const BUTTONS = require('./buttons').buttons;
const searcher = require('./searcher');
let getUser = require("./search/getUserName").verifyUser;
let report = require("./report");
let can_i = require("./can_i");

const url = `https://${process.env.HEROKU_NAME}.herokuapp.com/bot${token}/`;

const DEV_TELEGRAM_ID = parseInt(process.env.DEV_TELEGRAM_ID) || 0;
const ERR_CHNL_CHAT_ID = process.env.ERR_CHNL_CHAT_ID;
const USERS_CNL = process.env.USERS_CNL;



const axios = require('axios');
const fetch = require('node-fetch');
const baseUrl = `https://api.telegram.org/bot${token}/`;

const Kitsu = require('kitsu');
const kitsu = new Kitsu();

let bot;
if (process.env.NPM_CONFIG_PRODUCTION) {
    console.log('----Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginConfig: {
            namedButtons: {
                buttons: BUTTONS
            }
        },
        webHook: { port: port, host: host }
    });
} else {
    console.log('----non-Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginConfig: {
            namedButtons: {
                buttons: BUTTONS
            }
        },
        polling: true
    });
};
bot.getMe().then(function(me) { //self check
    const botName = me.username;
    console.log('---\nHello! My name is %s!', me.first_name);
    console.log(`And my username is @${ botName }\n---`);
    return botName;
});
bot.on("error", err => { //most telegram errors should get caught here
    console.log("Telegram Error " + err.error_code + "\nDescription: " + err.description + "\nfull report " + JSON.stringify(err))
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
                report.error(bot, errMsg, err, false)
            } catch (e) { console.log('Error from error sender report.error did not work: ', JSON.stringify(e)) }
            return console.log('Error44 from error sender: ', err.Error)
        })
});
process.on('unhandledRejection', function(reason, p) {
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    try {
        let errMsg = `OK: ${reason.ok}\nError Code: ${reason.error_code}\nReason: ${reason.description}`
        report.error(bot, errMsg, '', false)
    } catch (e) { console.log('Error report.error on unhandledRejection: ', JSON.stringify(e)) }
    // application specific logging here
});

function getUserLanguage(msg) {
    let lang = require('./LANG');
    let l = (msg.from != undefined) ? msg.from.language_code.split("-")[0] : "en";
    switch (l) {
        case "en":
            return lang.en;
        case "iw":
            return lang.he;
        default:
            console.log("default lang choosen")
            return lang.he;
    }
};

// bot.on("text", (msg, type) => {
//     // console.log(msg)
//     if ((msg.chat.id == 1082225626 || ERR_CHNL_CHAT_ID || -284603852) && (type.type == "text")) {
//         can_i(msg, type)
//     }
// })

// bot.on('text', (msg) => msg.reply.text(msg.text, { asReply: true }));


bot.on('inlineQuery', (msg) => {
    let userLang = getUserLanguage(msg);
    // console.log(msg.from.language_code)
    let type = "inline";
    searcher.inline(type, msg, bot, userLang);
});
bot.on('callbackQuery', msg => {
    let userLang = getUserLanguage(msg);
    // console.log(msg)
    // bot.answerCallbackQuery(msg.id, { text: "Updating..." }); //
    let callbackOps = msg.data.split('-');
    let id = callbackOps[0];
    let type;
    switch (callbackOps[1]) {
        case 'a': //genre
            type = 'anime';
            break;
        case 'm': //genre
            type = 'manga';
            break;
        default:
            type = null;
            break;
    }
    switch (callbackOps[2]) {
        case 'd':
            searcher.description(id, type).then(function(res) {
                let description = res.data.synopsis.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n');
                if (description == null) {
                    return userLang.desc_not_available;
                }
                if (description.length >= 199) {
                    description = description.substring(0, 200);
                    let last = description.lastIndexOf(" ");
                    description = description.substring(0, last);
                    return description + "...";
                }
                return description;
            }).then(function(res) {
                return bot.answerCallbackQuery(msg.id, { text: res, showAlert: true });
            });
            break;
        case 'nxt':
            let currentSavedEP = callbackOps[3];
            if (currentSavedEP - time() > 0) {
                let text = "Got Ep Air date (without extra lookup)😁";
                report.user(bot, msg, "epDate", text);
                let timeDiff = currentSavedEP - time()
                let nextEpAir = msToTime(timeDiff);
                return bot.answerCallbackQuery(msg.id, { text: "Next Ep Airs in:\n" + nextEpAir, showAlert: true });
            } else {
                let text = "Got Ep Air date (with extra lookup)😔";
                report.user(bot, msg, "epDate", text);
                searcher.nextEp(id, type).then(res => {
                    let resToISO = res.data.nextRelease.replace(' ', 'T').replace(' ', '')
                    let resToMilisec = new Date(resToISO).valueOf()
                    return resToMilisec
                }).then(res => {
                    let timeDiff = res - time()
                    let nextEpAir = msToTime(timeDiff);
                    return bot.answerCallbackQuery(msg.id, { text: "Next Ep Airs in:\n" + nextEpAir, showAlert: true });
                });
            }
            break;
        case 'g':
            // console.log("genre lookup")
            searcher.getGenres(id, type).then(res => {
                let genres_sting = '';
                genres_sting += userLang.genres + ':\n'
                for (let i = 0, len = res.meta.count; i < len; i++) {
                    genres_sting += '-' + res.data[i].name + '\n' //(i != len - 1 ? ', ' : '');
                }
                return genres_sting
            }).then(res => {
                bot.answerCallbackQuery(msg.id, { text: res, showAlert: true });
            });
            break;
        default:
            null;
            break;
    }
});

function time() {
    // res = 2018-07-08T09:30:00+0900
    var time = new Date().valueOf();
    return time
}

function msToTime(duration) {
    if (duration < 0) {
        return 0
    }
    let
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt((duration / (1000 * 60 * 60 * 24))),
        d_h_space, h_m_space;

    d_h_space = ((days > 0) && ((hours > 0) || (minutes > 0))) ? " " : "";
    h_m_space = ((hours > 0) && (minutes > 0)) ? " " : "";
    minutes = (minutes > 0) ? minutes + "m" : "";
    hours = (hours > 0) ? hours + "h" : "";
    days = (days > 0) ? days + "d" : "";
    let mstime = days + d_h_space + hours + h_m_space + minutes;
    return mstime
}
//links: { self: 'https://kitsu.io/api/edge/anime/6570' },
bot.on("/*", (msg, type) => {
    console.log(type.type)
    if (type.type = ("command")) {
        let userLang = getUserLanguage(msg);
        let msgText = msg.text;
        if (msgText.includes("/start")) {
            // console.log(JSON.stringify(userLang));
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(userLang.check_it_out, { inlineCurrent: '' })]
            ]);
            // let replyMarkup = bot.keyboard([
            //     [BUTTONS.hello.label, BUTTONS.world.label],
            //     [BUTTONS.hide.label]
            // ], { resize: true });

            return bot.sendMessage(msg.chat.id, userLang.see_keyboard_below, { replyMarkup });
        }
        if (msgText.includes("/hello")) {
            bot.sendAction(msg.chat.id, 'typing')
            return bot.sendMessage(msg.chat.id, 'Hello!');
        }
        if (msgText.includes("/test")) {
            console.log(msg);
            let parseMode = 'Markdown';
            bot.sendMessage(msg.chat.id, `[inline mention of a user](tg://user?id=${msg.from.id})`, { parseMode });
        }
        if (msgText.includes("/search") && msg.text.substr(msg.text.indexOf(' ') + 1) != (undefined || null)) {
            let type = "inchat";
            console.log(`inchat search for ${msg.text.substr(msg.text.indexOf(' ') + 1)}`)
            searcher.inline(type, msg, bot, fetch, kitsu);
        }
    }
})


// Call API
bot.start();