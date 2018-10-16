'use strict';

let _ = {}
let utils = require("../utils/utils");
let report = require("../utils/report");
const searcher = require('../respond/search');
const dbs = require("../utils/dbs");
let lang = require('../langFiles/LANG');
let getPic = require('../utils/getPic')
const genreList = require("../langFiles/genres");


const fetch = require('node-fetch');
const anilist = require('../search/anilist')

let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;

_ = msg => {
    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    let userDesc = dataOnUser[userID]['desc'];
    //let userSource = dataOnUser[userID]['src'];

    // console.log(msg)
    // let userData = dataOnUser[msg.from.id]
    if (msg.message && msg.message.chat.id == msg.from.id) {
        let chatId = msg.from.id
        let messageId = msg.message.message_id
        if (msg.data == 'cancel') {
            console.log(lang[userLang].cancelled) //
            bot.editMessageText({ chatId, messageId }, lang[userLang].cancelled)
            bot.answerCallbackQuery(msg.id, { text: lang[userLang].cancelled });
            return 'cancel'
        }
        if (msg.data == 'descSetting') {
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].setDesc.sendDesc, { callback: 'sendDesc' }), bot.inlineButton(lang[userLang].setDesc.dontSendDesc, { callback: 'dontSendDesc' })],
                [bot.inlineButton(lang[userLang].cancel, { callback: 'cancel' })]
            ]);
            bot.editMessageText({ chatId, messageId }, lang[userLang].setDesc.desc, { replyMarkup })
            bot.answerCallbackQuery(msg.id);
            return
        }
        if (msg.data == 'sendDesc') {
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].setDesc.descNotiSilent, { callback: 'sendDesc_silent' })],
                [bot.inlineButton(lang[userLang].setDesc.deskNotiNonSilent, { callback: 'sendDesc_nonsilent' })]
            ]);
            bot.editMessageText({ chatId, messageId }, lang[userLang].setDesc.descNotiYes, { replyMarkup })
            bot.answerCallbackQuery(msg.id);
            dataOnUser[msg.from.id]['desc'] = 'sendDesc_silent'
            return dbs.changeUserDescPrefs(msg, 'sendDesc_silent')
        }
        if (msg.data == 'dontSendDesc') {
            bot.editMessageText({ chatId, messageId }, lang[userLang].setDesc.dontSendDesc_done)
            bot.answerCallbackQuery(msg.id);
            dataOnUser[msg.from.id]['desc'] = 'dontSendDesc'
            return dbs.changeUserDescPrefs(msg, 'dontSendDesc')
        }
        if (msg.data == 'sendDesc_silent') {
            bot.editMessageText({ chatId, messageId }, lang[userLang].setDesc.SendDescSilent_done)
            bot.answerCallbackQuery(msg.id);
            dataOnUser[msg.from.id]['desc'] = 'sendDesc_silent'
            return dbs.changeUserDescPrefs(msg, 'sendDesc_silent')
        }
        if (msg.data == 'sendDesc_nonsilent') {
            bot.editMessageText({ chatId, messageId }, lang[userLang].setDesc.SendDescNonSilent_done)
            bot.answerCallbackQuery(msg.id);
            dataOnUser[msg.from.id]['desc'] = 'sendDesc_nonsilent'
            return dbs.changeUserDescPrefs(msg, 'sendDesc_nonsilent')
        }
        if (msg.data == 'setLang') {
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].setLang.en, { callback: 'english' }), bot.inlineButton(lang[userLang].setLang.he, { callback: 'hebrew' })],
                [bot.inlineButton(lang[userLang].cancel, { callback: 'cancel' })]
            ]);
            bot.editMessageText({ chatId, messageId }, lang[userLang].setLang.language, { replyMarkup })
            bot.answerCallbackQuery(msg.id);
            return
        }
        if (msg.data == 'hebrew') {
            bot.editMessageText({ chatId, messageId }, 'שפה שונתה לעברית')
            bot.answerCallbackQuery(msg.id, { text: 'שפה שונתה לעברית' });
            dataOnUser[msg.from.id]['lang'] = 'he'
            return dbs.changeUserLangPrefs(msg, 'setHebrew')
        }
        if (msg.data == 'english') {
            bot.editMessageText({ chatId, messageId }, "Language changed to English")
            bot.answerCallbackQuery(msg.id, { text: "Language changed to English" });
            dataOnUser[msg.from.id]['lang'] = 'en'
            return dbs.changeUserLangPrefs(msg, 'setEnglish')
        }
        if (msg.data == 'setSource') {
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].anilist, { callback: 'anilist' }), bot.inlineButton(lang[userLang].kitsu, { callback: 'kitsu' })],
                [bot.inlineButton(lang[userLang].cancel, { callback: 'cancel' })]
            ]);
            bot.editMessageText({ chatId, messageId }, lang[userLang].setSource, { replyMarkup })
            bot.answerCallbackQuery(msg.id);
            return
        }
        if (msg.data == 'anilist') {
            bot.editMessageText({ chatId, messageId }, lang[userLang].newSrcAnilist)
            bot.answerCallbackQuery(msg.id, { text: lang[userLang].newSrcAnilist });
            dataOnUser[msg.from.id]['src'] = 'anilist'
            return dbs.changeUserSrcPrefs(msg, 'anilist')
        }
        if (msg.data == 'kitsu') {
            bot.editMessageText({ chatId, messageId }, lang[userLang].newSrcKitsu)
            bot.answerCallbackQuery(msg.id, { text: lang[userLang].newSrcKitsu });
            dataOnUser[msg.from.id]['src'] = 'kitsu'
            return dbs.changeUserSrcPrefs(msg, 'kitsu')
        }
    }
    let startTime = new Date().valueOf()
    let callbackOps = msg.data.split('-'); //id-m/a-d/g/nxt-secounds  id-anilist-d/nxt-secounds-epNum
    let id = callbackOps[0]; // the id on anilist or kitsu
    let type;
    switch (callbackOps[1]) {
        case 'a': //genre
            type = 'anime';
            break;
        case 'm': //genre
            type = 'manga';
            break;
        case 'anilist': //genre
            type = 'anilist';
            break;
        default:
            type = null;
            break;
    }
    switch (callbackOps[2]) {
        case 'd':
            if (type == 'anilist') {
                let anilistQuery = anilist.queryAnilistByID(id, 'description');
                fetch(anilistQuery.url, anilistQuery.options)
                    .then(handleResponse => {
                        return handleResponse.json().then(function(json) {
                            return handleResponse.ok ? json : Promise.reject(json);
                        });
                    })
                    .then(handleData => {
                        let re, message, data = handleData.data.Media;
                        // data = JSON.parse(JSON.stringify(data).replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').replace(/\*/g, "＊").replace(/(`)/g, ''))
                        let description = utils.md2tgmd(data.description);
                        if (description == (null || undefined || '')) {
                            re = lang[userLang].desc_not_available;
                        } else if (description.length >= 200) {
                            re = lang[userLang].descLong;
                        } else re = description;
                        if (userDesc !== 'dontSendDesc') {
                            let notification;
                            switch (userDesc) {
                                case 'sendDesc_silent':
                                    notification = false
                                    break;
                                case 'sendDesc_nonsilent':
                                    notification = true;
                                    break;
                                default:
                                    notification = false
                                    break
                            }
                            message = messageDescToSendAnilist(data, userLang)
                            bot.sendMessage(msg.from.id, message, { notification, parseMode: 'Markdown' }).catch(err => { //cant send to msg.chat.id, need to find another way    
                                if (err.error_code == 403) {
                                    // report.error(err.description, '', false)
                                    report.user(msg, 'error', err.description.replace(/(`)/g, '') + ' ' + err.error_code)
                                    console.log(err.description)
                                } else {
                                    console.log(err)
                                }
                            })
                        }
                        return re
                    }).then(function(res) {
                        return bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 604800 }); //604800000
                    })
                    .then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let msgText = 'Description took ' + timeDiff + 'ms';
                        report.user(msg, "desc", msgText, timeDiff);
                    }).catch(handleError => {
                        report.error(`AniList fetch error1: ${(JSON.stringify(handleError) === undefined || null || false || {})?handleError:JSON.stringify(handleError)}`, handleError)
                        report.error(`AniList fetch error2: ${handleError}`)
                        console.log(`---\nAniList fetch error: ${JSON.stringify(handleError)}\n---`)
                        console.log(`---\nAniList fetch error: ${handleError}\n---`)
                    });
            } else {
                searcher.description(id, type).then(function(res) {
                    let re, message, data = res.data;
                    data = JSON.parse(utils.md2tgmd(JSON.stringify(data)))
                    let description = res.data.synopsis;
                    if (description == (null || undefined || '')) {
                        re = lang[userLang].desc_not_available;
                    } else if (description.length >= 200) {
                        re = lang[userLang].descLong;
                    } else re = description;
                    if (userDesc !== 'dontSendDesc') {
                        let notification;
                        switch (userDesc) {
                            case 'sendDesc_silent':
                                notification = false
                                break;
                            case 'sendDesc_nonsilent':
                                notification = true;
                                break;
                            default:
                                notification = false
                                break
                        }
                        message = messageSent(data, userLang, data.type, data.id)
                        bot.sendMessage(msg.from.id, message, { notification, parseMode: 'Markdown' }).catch(err => { //cant send to msg.chat.id, need to find another way    
                            if (err.error_code == 403) {
                                // report.error(err.description, '', false)
                                report.user(msg, 'error', err.description.replace(/(`)/g, '') + ' ' + err.error_code)
                                console.log(err.description)
                            } else {
                                console.log(err)
                            }
                        })
                    }
                    return re
                }).then(function(res) {
                    return bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 604800 }); //604800000
                }).then(() => {
                    let timeDiff = new Date().valueOf() - startTime;
                    let msgText = 'Description took ' + timeDiff + 'ms';
                    report.user(msg, "desc", msgText, timeDiff);
                }).catch(err => {
                    if (err.error_code == 403) {
                        console.log(err.description)
                    } else {
                        console.log(err)
                    }
                });
            }
            break;
        case 'nxt':
            if (type == 'anilist') {
                let timeToAir = callbackOps[3];
                if ((timeToAir * 1000 - new Date().getTime()) > 0) {
                    let nextEP = callbackOps[4];

                    let nextEpAir = utils.msToTime(timeToAir * 1000 - new Date().getTime(), userLang);
                    return bot.answerCallbackQuery(msg.id, { text: lang[userLang].episode + ' ' + nextEP + ' ' + lang[userLang].airsOn + ":\n" + nextEpAir, showAlert: true, cacheTime: 40 }).then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let extraInfo = false; // 'Next Ep Air Date took ' + timeDiff + 'ms (without extra lookup)😁';
                        report.user(msg, "next", extraInfo, timeDiff);
                    });
                } else {
                    let anilistQuery = anilist.queryAnilistByID(id, 'airdate');
                    fetch(anilistQuery.url, anilistQuery.options)
                        .then(handleResponse => {
                            return handleResponse.json().then(function(json) {
                                return handleResponse.ok ? json : Promise.reject(json);
                            });
                        })
                        .then(handleData => {
                            let data = handleData.data.Media;
                            let airTime = data.nextAiringEpisode.airingAt
                            let nextEP = data.nextAiringEpisode.episode

                            let nextEpAir = utils.msToTime(airTime * 1000 - new Date().getTime(), userLang);
                            return bot.answerCallbackQuery(msg.id, { text: lang[userLang].episode + ' ' + nextEP + ' ' + lang[userLang].airsOn + ":\n" + nextEpAir, showAlert: true, cacheTime: 40 }).then(() => {
                                let timeDiff = new Date().valueOf() - startTime;
                                let extraInfo = false; // 'Next Ep Air Date took ' + timeDiff + 'ms (without extra lookup)😁';
                                report.user(msg, "next", extraInfo, timeDiff);
                            });
                        }).then(() => {
                            let timeDiff = new Date().valueOf() - startTime;
                            let extraInfo = true; // 'Next Ep Air Date took ' + timeDiff + 'ms (with extra lookup)😔';
                            report.user(msg, "next", extraInfo, timeDiff);
                        }).catch(handleError => {
                            report.error(`AniList fetch error3: ${(JSON.stringify(handleError) === undefined || null || false || {})?handleError:JSON.stringify(handleError)}`, handleError)
                            report.error(`AniList fetch error4: ${handleError}`)
                            console.log(`---\nAniList fetch error: ${JSON.stringify(handleError)}\n---`)
                            console.log(`---\nAniList fetch error: ${handleError}\n---`)
                        });
                }
            } else {
                let currentSavedEP = callbackOps[3];
                if ((currentSavedEP - new Date().valueOf()) > 0) {
                    // report.user(msg, "epDate", text);
                    let timeDiff = currentSavedEP - new Date().valueOf()
                        // console.log(timeDiff)

                    let nextEpAir = utils.msToTime(timeDiff, userLang);
                    return bot.answerCallbackQuery(msg.id, { text: lang[userLang].nextRelease + ":\n" + nextEpAir, showAlert: true, cacheTime: 40 }).then(() => {
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
                        let nextEpAir = utils.msToTime(timeDiff, userLang);
                        return bot.answerCallbackQuery(msg.id, { text: lang[userLang].nextRelease + ":\n" + nextEpAir, showAlert: true, cacheTime: 40 });
                    }).then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let extraInfo = true; // 'Next Ep Air Date took ' + timeDiff + 'ms (with extra lookup)😔';
                        report.user(msg, "next", extraInfo, timeDiff);
                    });
                }
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
                        let genre
                        if (userLang == 'he') {
                            genre = genreList[res.data[i].name][1]
                        } else if (userLang == 'en') {
                            genre = genreList[res.data[i].name][0]
                        }
                        genres_sting += '-' + genre + '\n' //(i != len - 1 ? ', ' : '');
                    }
                    return genres_sting
                }).then(res => {
                    bot.answerCallbackQuery(msg.id, { text: res, showAlert: true, cacheTime: 604800 }); //604800000
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

function messageSent(data, userLang, type, id) {
    //titles - romaji english native
    let titleRJ = data.titles.en_jp ? `🇺🇸 [${data.titles.en_jp}](https://kitsu.io/${type}/${id})\n` : (data.canonicalTitle != (null || undefined) ? `🇺🇸 [${data.canonicalTitle}](https://kitsu.io/${type}/${id})\n` : '');
    let titleJP = data.titles.ja_jp ? `🇯🇵 ${data.titles.ja_jp}\n` : '';
    let titleEN = data.titles.en ? `🇬🇧 ${data.titles.en}\n` : '';
    //cover - banner
    //imageCover = data.coverImage.large != null ? `[\u200B](${data.coverImage.large})` : '';
    let pic = getPic(data, 'full')
    let imageCover = pic != null ? `[\u200B](${pic})` : null;
    //trailer
    let trailer = (data.youtubeVideoId) ? (`🎥 [${lang[userLang].trailer}](https://youtu.be/${data.youtubeVideoId})\n`) : '';
    //eps 
    let episodeCount = data.episodeCount ? `\n- ${lang[userLang].episodes}: *${data.episodeCount}*` : '';
    let episodeLength = (data.episodeLength && data.episodeCount) ? ` (${data.episodeLength} ${lang[userLang].minutes_per_episode})` : '';
    //volumes 
    // these two dont work yet, need to get kitsu to search manga as well
    let volumes = data.volumes ? `\n- ${lang[userLang].volumes}: *${data.volumes}*` : '';
    //chapters
    // these two dont work yet, need to get kitsu to search manga as well
    let chapters = data.chapters ? `\n- ${lang[userLang].chapters}: *${data.chapters}*` : '';
    //description
    let description = (data.synopsis != null) ? `\n\n${data.synopsis}` : '';
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodeCount}${episodeLength}${volumes}${chapters}${description}`;
}

function messageDescToSendAnilist(aniData, userLang) {
    let titleEN, titleJP, titleRJ, imageCover, episodes, trailer, chapters, description;
    titleRJ = aniData.title.romaji ? `🇺🇸 [${aniData.title.romaji}](${aniData.siteUrl})\n` : '';
    titleJP = aniData.title.native ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english ? `🇬🇧 ${aniData.title.english}\n` : '';
    imageCover = aniData.bannerImage ? `[\u200B](${aniData.bannerImage})` : (aniData.coverImage.large ? `[\u200B](${aniData.coverImage.large})` : '');
    trailer = (aniData.trailer) ? (`🎥 [${lang[userLang].trailer}](https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id})\n`) : '';
    episodes = aniData.episodes ? `\n- ${lang[userLang].episodes}: *${aniData.episodes}*` : '';
    chapters = aniData.chapters ? `\n- ${lang[userLang].chapters}: *${aniData.chapters}*` : '';
    description = (aniData.description) ? `\n\n${utils.md2tgmd(aniData.description)}` : '';
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodes}${chapters}${description}`;
};

module.exports = _;