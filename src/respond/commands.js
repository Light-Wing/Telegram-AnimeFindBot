'use strict';

let _ = {};

require('dotenv').config()

let lang = require('../langFiles/LANG');
const dbs = require("../utils/dbs");

let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;

// require('util')  util.format
_.commandList = [
    '/start',
    '/feedback',
    '/setting',
    '/test',
    '/search'
]
_.reactToCommand = (msg) => {
    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    let userDesc = dataOnUser[userID]['desc'];
    // console.log(msg)
    let msgText = msg.text ? msg.text.toLowerCase() : "";
    if (msg.text == '/cancel' || msg.text == lang['he'].cancel || msg.text == lang['en'].cancel) {
        return bot.sendMessage(msg.chat.id, lang[userLang].cancelled, { replyMarkup: 'hide' });
    }
    if (msgText == "/start") {
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].check_it_out.none, { inlineCurrent: '' })]
        ]);
        let hiText = (lang[userLang].startMsg).replace('%s', msg.from.first_name)
            // console.log(hiText)
        return bot.sendMessage(msg.from.id, hiText, { replyMarkup });
    }
    if (msgText == "/help" || msgText.split(' ')[1] == 'help') {
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].check_it_out.none, { inlineCurrent: '' })],
            [bot.inlineButton(lang[userLang].check_it_out.manga, { inlineCurrent: '@k' })],
            [bot.inlineButton(lang[userLang].check_it_out.kitsu, { inlineCurrent: '@m' })],
            [bot.inlineButton(lang[userLang].check_it_out.anilist, { inlineCurrent: '@a' })],
            [bot.inlineButton(lang[userLang].check_it_out.character, { inlineCurrent: '@c' })],
            [bot.inlineButton(lang[userLang].check_it_out.person, { inlineCurrent: '@p' })]
        ]);
        return bot.sendMessage(msg.from.id, lang[userLang].example, { replyMarkup, parseMode: 'markdown' });
    }
    if (msg.text == '/cancel' || msg.text == lang['he'].cancel || msg.text == lang['en'].cancel) {
        return bot.sendMessage(msg.chat.id, lang[userLang].cancelled, { replyMarkup: 'hide' });
    }
    if (msgText == "/feedback") {
        // let replyMarkup = bot.inlineKeyboard([
        //     [bot.inlineButton(lang[userLang].cancel, { callback: '/cancel' })]
        // ]);
        let replyMarkup = bot.keyboard([
            [lang[userLang].feedbackOps.issue, lang[userLang].feedbackOps.idea],
            [lang[userLang].feedbackOps.g_feedback],
            [lang[userLang].cancel]
        ], { resize: true, once: true });
        return bot.sendMessage(msg.chat.id, lang[userLang].feedback, { replyMarkup, ask: 'feedback' });
    }
    if (msgText == "/settings" || msgText.split(' ')[1] == 'setting') {
        // console.log('setting', msgText)
        //should show a language button a description button and a cancel button
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].settings.setLang, { callback: 'setLang' })],
            [bot.inlineButton(lang[userLang].settings.setSource, { callback: 'setSource' })],
            [bot.inlineButton(lang[userLang].settings.setDesc, { callback: 'descSetting' })],
            [bot.inlineButton(lang[userLang].settings.setTachiLinkVisibility, { callback: 'tachiSetting' })],
            [bot.inlineButton(lang[userLang].cancel, { callback: 'cancel' })]
        ]);
        // console.log('settings');
        //if using keyboard, the bot must reply that it updated and at the same time hide the keyboard
        // let replyMarkup = bot.keyboard([
        //     [lang[userLang].setLang.en, lang[userLang].setLang.he],
        //     [lang[userLang].cancel]
        // ], { resize: true, once: true });
        return bot.sendMessage(msg.from.id, lang[userLang].settings.settings, { replyMarkup }); //, ask: 'lang'
    }
    //dev area 
    if (msg.from.id == process.env.DEV_TELEGRAM_ID) {
        // console.log(msg)
        if (msgText == '/restart') {
            setTimeout(() => {
                bot.stop('stop')
            }, 1000)
            setTimeout(() => {
                bot.start()
            }, 2000)
        };
        if (msgText.includes('/pm')) { // /send chatname/id text
            // console.log(msg)
            if (msgText == '/pm') {
                bot.sendMessage(msg.from.id, "Format as \`/pm <chat_id or @chatname> | <text to send>\`", { parseMode: 'markdown' })
            } else {
                let msgText = msg.text.substr(4)
                let sendTo = msgText.split(/ (.+)/)[0]
                let sendText = msgText.split(/ (.+)/)[1]
                    // bot.sendMessage()
                bot.sendMessage(sendTo, sendText)
                    .then(() => {
                        // console.log(res)
                        bot.sendMessage(msg.chat.id, 'sent', { replyToMessage: msg.message_id })
                    }).catch(err => {
                        // console.log(err)
                        bot.sendMessage(msg.chat.id, 'Error - Code: ' + err.error_code + '\n' + err.description)
                    });
            }
        };
        if (msg.forward_from) {
            bot.sendMessage(msg.chat.id, `User ID: \`${msg.forward_from.id}\``, { replyToMessage: msg.message_id, parseMode: 'markdown' });
        }
        if (msgText == "/test") {
            // console.log(msg);
            let parseMode = 'Markdown';
            return bot.sendMessage(msg.chat.id, `[inline mention of a user](tg://user?id=${msg.from.id})`, { parseMode });
        };
        if (msgText == "/hello") {
            bot.sendAction(msg.chat.id, 'typing')
            return bot.sendMessage(msg.chat.id, 'Hello!');
        };
        if (msgText.includes("/search") && msg.text.substr(msg.text.indexOf(' ') + 1) != (undefined || null)) {
            let type = "inchat";
            console.log(`inchat search for ${msg.text.substr(msg.text.indexOf(' ') + 1)}`)
            searcher.inline(type, msg, bot, fetch, kitsu);
        };
        if (msgText.includes('/users')) { // /send chatname/id text
            dbs.getUserNum()
        };
        if (msgText.includes('/broadcast')) { // /send chatname/id text
            // console.log(msg)
            if (msgText == '/broadcast') {
                bot.sendMessage(msg.from.id, "Format as \`/broadcast <text to send>\` using markdown", { parseMode: 'markdown' })
            } else {
                let msgText = msg.text.substr(10)
                var numberOfSentMessages = 0 
                
                dbs.getUserList(0)
                    .then(res => {
                        res.forEach(id => {
                            setTimeout(function () {
                                bot.sendMessage(id, msgText, { parseMode: 'markdown' }).then(_ => {
                                    numberOfSentMessages++
                                }).catch(err => {
                                    //catch reason why message was not sent, or id not valid or user blocked bot
                                    if (err.ok == 400) {
                                        //user not found, user probably was deleted, may as well remove this user permenatly from db
                                        //TODO 
                                    } else if (err.ok == 403){
                                        // "Forbidden: bot can't initiate conversation with a user" probably blocked by user

                                    } else if (err.ok == 420){
                                        //bot was flodded, need to wait FLOOD_WAIT_X time...

                                    }
                                    // bot.sendMessage(msg.chat.id, 'Error - Code: ' + err.error_code + '\n' + err.description)
                                    // console.log(err);
                                })
                                }, 100);
                        });
                }).catch(function(err) {
                    if (err = 'error') {
                        console.log('getUserList error ' + err);
                    } else {
                        console.log(err);
                    }
                });
                bot.sendMessage(msg.chat.id, `sent ${numberOfSentMessages} messages`, { replyToMessage: msg.message_id })
            }
        };
    }
}


module.exports = _;