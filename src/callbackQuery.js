'use strict';

let _ = {}
let utils = require("./utils");
let report = require("./report");
const searcher = require('./searcher');
const dbs = require("./dbs/dbs");
let dataOnUser = require("./userCache");;
let lang = require('./LANG');

_ = (bot, msg, userLang) => {
    // console.log(msg)
    if (msg.data == '/cancel') {
        console.log(lang[userLang].cancelled) //
        let chatId = msg.message.chat.id
        let messageId = msg.message.message_id
        bot.editMessageText({ chatId, messageId }, lang[userLang].cancelled)
        bot.answerCallbackQuery(msg.id, { text: lang[userLang].cancelled });
        return 'cancel'
    }
    if (msg.data == '/hebrew') {
        let chatId = msg.message.chat.id
        let messageId = msg.message.message_id
        bot.editMessageText({ chatId, messageId }, 'שפה שונתה לעברית')
        bot.answerCallbackQuery(msg.id, { text: 'שפה שונתה לעברית' });
        dataOnUser[msg.from.id]['lang'] = 'he'
        return dbs.changeUserLangPrefs(msg, 'setHebrew')
    }
    if (msg.data == '/english') {
        let chatId = msg.message.chat.id
        let messageId = msg.message.message_id
        bot.editMessageText({ chatId, messageId }, "Language changed to English")
        bot.answerCallbackQuery(msg.id, { text: "Language changed to English" });
        dataOnUser[msg.from.id]['lang'] = 'en'
        return dbs.changeUserLangPrefs(msg, 'setEnglish')
    }
    let startTime = new Date().valueOf()
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
    //This is a story about you. A tale about the inside of your body... According to a new study, the human body consists of approximately 37 trillion cells. These cells are hard at work every day within...    
    switch (callbackOps[2]) {
        case 'd':
            searcher.description(id, type, 195).then(function(res) {
                let re;
                let description = res.data.synopsis.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n');
                if (description == (null || undefined || '')) {
                    re = lang[userLang].desc_not_available;
                } else if (description.length >= 200) {
                    let tempDesc = description.substring(0, 197);
                    let last = tempDesc.lastIndexOf(" ");
                    let descriptionFinal = description.substring(0, last);
                    re = descriptionFinal + "...";
                } else re = description;
                //console.log(msg)
                bot.sendMessage(msg.from.id, description) //cant send to msg.chat.id, need to find another way
                return re
            }).then(function(res) {
                return bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 0 }); //604800000
            }).then(() => {
                let timeDiff = new Date().valueOf() - startTime;
                let msgText = 'Description took ' + timeDiff + 'ms';
                report.user(msg, "desc", msgText, timeDiff);
            });
            break;
        case 'nxt':
            let currentSavedEP = callbackOps[3];
            if ((currentSavedEP - new Date().valueOf()) > 0) {
                // report.user(msg, "epDate", text);
                let timeDiff = currentSavedEP - new Date().valueOf()
                    // console.log(timeDiff)

                let nextEpAir = utils.msToTime(timeDiff);
                return bot.answerCallbackQuery(msg.id, { text: "Next Ep Airs in:\n" + nextEpAir, showAlert: true, cacheTime: 30000 }).then(() => {
                    let timeDiff = new Date().valueOf() - startTime;
                    let extraInfo = false; // 'Next Ep Air Date took ' + timeDiff + 'ms (without extra lookup)😁';
                    report.user(msg, "next", extraInfo, timeDiff);
                });
            } else {
                searcher.nextEp(id, type).then(res => {
                    let resToISO = res.data.nextRelease.replace(' ', 'T').replace(' ', '')
                    let resToMilisec = new Date(resToISO).valueOf()
                    return resToMilisec
                }).then(res => {
                    let timeDiff = res - new Date().valueOf()
                    let nextEpAir = utils.msToTime(timeDiff);
                    return bot.answerCallbackQuery(msg.id, { text: "Next Ep Airs in:\n" + nextEpAir, showAlert: true, cacheTime: 30000 });
                }).then(() => {
                    let timeDiff = new Date().valueOf() - startTime;
                    let extraInfo = true; // 'Next Ep Air Date took ' + timeDiff + 'ms (with extra lookup)😔';
                    report.user(msg, "next", extraInfo, timeDiff);
                });
            }
            break;
        case 'g':
            // console.log("genre lookup")
            searcher.getGenres(id, type).then(res => {
                    // console.log(res)
                    let genres_sting = '';
                    if (res.meta.count == 0) {
                        return lang[userLang].no_genres;
                    }
                    genres_sting += lang[userLang].genres + ':\n'
                    for (let i = 0, len = res.meta.count; i < len; i++) {
                        genres_sting += '-' + res.data[i].name + '\n' //(i != len - 1 ? ', ' : '');
                    }
                    return genres_sting
                }).then(res => {
                    bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 604800000 });
                })
                .then(() => {
                    let timeDiff = new Date().valueOf() - startTime;
                    let msgText = 'Genres took ' + timeDiff + 'ms';
                    report.user(msg, "genre", msgText, timeDiff);
                    // bot.sendMessage(process.env.USERS_CNL, msgText);
                });
            break;
        default:
            null;
            break;
    }
}

module.exports = _;