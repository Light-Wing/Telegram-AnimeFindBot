'use strict';

let _ = {}
let utils = require("./utils");
let report = require("./report");
const searcher = require('./searcher');

_ = (bot, msg, userLang) => {
    // console.log(msg)
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
    switch (callbackOps[2]) {
        case 'd':
            searcher.description(id, type).then(function(res) {
                let re;
                let description = res.data.synopsis.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n');
                if (description == null) {
                    return re = userLang.desc_not_available;
                } else if (description.length >= 199) {
                    description = description.substring(0, 196);
                    let last = description.lastIndexOf(" ");
                    description = description.substring(0, last);
                    return re = description + "...";
                } else return re = description;
            }).then(function(res) {
                return bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 604800000 });
            }).then(() => {
                let timeDiff = new Date().valueOf() - startTime;
                let msgText = 'Description took ' + timeDiff + 'ms';
                report.user(msg, "desc", msgText, timeDiff);
            });
            break;
        case 'nxt':
            let currentSavedEP = callbackOps[3];
            if ((currentSavedEP - new Date().valueOf()) > 0) {
                // report.user(bot, msg, "epDate", text);
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
                        return userLang.no_genres;
                    }
                    genres_sting += userLang.genres + ':\n'
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