'use strict';

let _ = {};

require('dotenv').config()

let lang = require('../langFiles/LANG');
const dbs = require("../utils/animeChannelsDB");

let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;
const IDEA_CHANNEL = process.env.FEEDBACK_CHNL;
let animeChannelSrcs = [-1001295220327, -1001131895691];
//console.log(IDEA_CHANNEL == -1001222970261) //true
let allowedForwardrs = [parseInt(process.env.DEV_TELEGRAM_ID), 131519720, 348409703, 460617702]

let report = require("../utils/report");

_.reactToForward = (msg) => {
    //console.log(msg.from.username, allowedForwardrs.includes(parseInt(msg.from.id)))

    if (!allowedForwardrs.includes(parseInt(msg.from.id))) return;
    if (msg.forward_from_chat) {
        if (!animeChannelSrcs.includes(msg.forward_from_chat.id)) return;
        let messageID = msg.forward_from_chat.id
            //console.log(messageID);
            // let caption = msg.caption;
            // let channelName = caption.split(/http:\/\/t.me | http:\/\/telegram.me/)[0]
            // let channelUrl = caption.split(/\n{1,}/g)[1]
            // console.log('channelName', channelName, '\nchannelUrl', channelUrl)
            // bot.forwardMessage()

        dbs.addSearchEntry(msg)
            // bot.forwardMessage(IDEA_CHANNEL, messageID, msg.forward_from_message_id) //idea channel, 
            //     .then(res => {
            //         console.log("forwarded", res.caption)
            //     })
            //     .catch(e => {
            //         console.log("not forwarded", e)
            //     });
    }
};

_.searchText = (msg) => {
    //console.log(msg)
    if (!msg.text.includes("/get")) return;
    let searchText
    if (msg.text.split("/get")[1]) { //its a reply
        searchText = msg.text.replace("/get", '')
    } else if (msg.reply_to_message) {
        searchText = msg.reply_to_message.text
    }
    //console.log('searchText', searchText)
    if (searchText == undefined) return;
    report.user(msg, 'tgAnimeSearch', searchText)

    let counter = 10;
    dbs.searchForAnimeChannel(searchText)
        .then((res) => {
            console.log(res[0])
            if (res[0] == null) {
                //nothing found
                report.user(msg, 'tgAnimeFound', "Nothing Found");
                bot.sendPhoto(msg.chat.id, "AgADBAADMq4xGyY2MVLxCImLkFvJ2uVpmhoABE9tBdieh4tCosEFAAEC", { caption: `Nothing Found (self destruct in ${ counter.toString() } secounds)`, replyToMessage: msg.message_id })
                    .then(re => {
                        let chatId = re.chat.id,
                            messageId = re.message_id;
                        let updateMessage = setInterval(function() {
                            counter--;
                            if (counter <= 0) {
                                bot.deleteMessage(re.chat.id, re.message_id)
                                    .catch(error => console.log('Error:', error));
                                clearInterval(updateMessage);
                            } else {
                                bot.editMessageCaption({ chatId, messageId }, `Nothing Found (self destruct in ${ counter.toString() } secounds)`)
                            }
                        }, 1000);
                    })
            } else {
                //somthing found, mayne make a keyboard to choose res from, or just send it
                //console.log(res)
                let reportSearchText = res[0].searchText;
                bot.forwardMessage(msg.chat.id, res[0].srcChannel, res[0].msgForwardID) //idea channel, 
                    .then(res => {
                        report.user(msg, 'tgAnimeFound', reportSearchText)
                            //console.log("forwarded", res.caption)
                    })
                    .catch(e => {
                        let idToRemove = res[0].msgForwardID;
                        let txtToShow = res[0].searchText;
                        bot.sendMessage(msg.chat.id, `Message not found (removing from Database in ${ counter.toString() })`)
                            .then(re => {
                                let chatId = re.chat.id,
                                    messageId = re.message_id;
                                let updateMessage = setInterval(function() {
                                    counter--;
                                    if (counter <= 0) {
                                        bot.deleteMessage(re.chat.id, re.message_id)
                                            .catch(error => console.log('Error:', error));
                                        clearInterval(updateMessage);
                                    } else {
                                        bot.editMessageText({ chatId, messageId }, `Message not found (removing from Database in ${ counter.toString() })`)
                                    }
                                }, 1000);
                                dbs.removeSearchEntry(idToRemove, txtToShow)
                            })
                    });
            };
        });
}

function time() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

function updateMessage(chatId, messageId) {
    //deleteMessage(<chat_id>, <from_message_id>)
    //bot.editMessageText({chatId, messageId}, `<b>Current time:</b> ${ time() }`,{parseMode: 'html'}

    // Update every second

}

// let msgText = msg.text ? msg.text.toLowerCase() : "";
// if (msg.text == '/cancel' || msg.text == lang['he'].cancel || msg.text == lang['en'].cancel) {
//     return bot.sendMessage(msg.chat.id, lang[userLang].cancelled, { replyMarkup: 'hide' });
// }
// if (msgText == "/start") {
//     let replyMarkup = bot.inlineKeyboard([
//         [bot.inlineButton(lang[userLang].check_it_out.none, { inlineCurrent: '' })]
//     ]);
//     let hiText = (lang[userLang].startMsg).replace('%s', msg.from.first_name)
//         // console.log(hiText)
//     return bot.sendMessage(msg.from.id, hiText, { replyMarkup });
// }
// if (msgText == "/help" || msgText.split(' ')[1] == 'help') {
//     let replyMarkup = bot.inlineKeyboard([
//         [bot.inlineButton(lang[userLang].check_it_out.none, { inlineCurrent: '' })],
//         [bot.inlineButton(lang[userLang].check_it_out.manga, { inlineCurrent: '@k' })],
//         [bot.inlineButton(lang[userLang].check_it_out.kitsu, { inlineCurrent: '@m' })],
//         [bot.inlineButton(lang[userLang].check_it_out.anilist, { inlineCurrent: '@a' })],
//         [bot.inlineButton(lang[userLang].check_it_out.character, { inlineCurrent: '@c' })],
//         [bot.inlineButton(lang[userLang].check_it_out.person, { inlineCurrent: '@p' })]
//     ]);
//     return bot.sendMessage(msg.from.id, lang[userLang].example, { replyMarkup, parseMode: 'markdown' });
// }
// if (msg.text == '/cancel' || msg.text == lang['he'].cancel || msg.text == lang['en'].cancel) {
//     return bot.sendMessage(msg.chat.id, lang[userLang].cancelled, { replyMarkup: 'hide' });
// }
// if (msgText == "/feedback") {
//     // let replyMarkup = bot.inlineKeyboard([
//     //     [bot.inlineButton(lang[userLang].cancel, { callback: '/cancel' })]
//     // ]);
//     let replyMarkup = bot.keyboard([
//         [lang[userLang].feedbackOps.issue, lang[userLang].feedbackOps.idea],
//         [lang[userLang].feedbackOps.g_feedback],
//         [lang[userLang].cancel]
//     ], { resize: true, once: true });
//     return bot.sendMessage(msg.chat.id, lang[userLang].feedback, { replyMarkup, ask: 'feedback' });
// }
// if (msgText == "/settings" || msgText.split(' ')[1] == 'setting') {
//     // console.log('setting', msgText)
//     //should show a language button a description button and a cancel button
//     let replyMarkup = bot.inlineKeyboard([
//         [bot.inlineButton(lang[userLang].settings.setLang, { callback: 'setLang' })],
//         [bot.inlineButton(lang[userLang].settings.setSource, { callback: 'setSource' })],
//         [bot.inlineButton(lang[userLang].settings.setDesc, { callback: 'descSetting' })],
//         [bot.inlineButton(lang[userLang].cancel, { callback: 'cancel' })]
//     ]);
//     // console.log('settings');
//     //if using keyboard, the bot must reply that it updated and at the same time hide the keyboard
//     // let replyMarkup = bot.keyboard([
//     //     [lang[userLang].setLang.en, lang[userLang].setLang.he],
//     //     [lang[userLang].cancel]
//     // ], { resize: true, once: true });
//     return bot.sendMessage(msg.from.id, lang[userLang].settings.settings, { replyMarkup }); //, ask: 'lang'
// }
// //dev area 
// if (msg.from.id == process.env.DEV_TELEGRAM_ID) {
//     // console.log(msg)
//     if (msgText == '/restart') {
//         setTimeout(() => {
//             bot.stop('stop')
//         }, 1000)
//         setTimeout(() => {
//             bot.start()
//         }, 2000)
//     };
//     if (msgText == '/sendpm') {
//         return bot.sendMessage(msg.chat.id, "send pm to who? (chad id or forwarded message)", { ask: 'sendTo' });
//     };
//     if (msg.forward_from) {
//         bot.sendMessage(msg.chat.id, `User ID: \`${msg.forward_from.id}\``, { replyToMessage: msg.message_id, parseMode: 'markdown' });
//     }
//     if (msgText == "/test") {
//         // console.log(msg);
//         let parseMode = 'Markdown';
//         return bot.sendMessage(msg.chat.id, `[inline mention of a user](tg://user?id=${msg.from.id})`, { parseMode });
//     };
//     if (msgText == "/hello") {
//         bot.sendAction(msg.chat.id, 'typing')
//         return bot.sendMessage(msg.chat.id, 'Hello!');
//     };
//     if (msgText.includes("/search") && msg.text.substr(msg.text.indexOf(' ') + 1) != (undefined || null)) {
//         let type = "inchat";
//         console.log(`inchat search for ${msg.text.substr(msg.text.indexOf(' ') + 1)}`)
//         searcher.inline(type, msg, bot, fetch, kitsu);
//     };
// }
//}


module.exports = _;