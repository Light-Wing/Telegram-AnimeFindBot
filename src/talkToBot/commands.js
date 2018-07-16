'use strict';

let _ = {};
let lang = require('../LANG');
require('dotenv').config()
const dbs = require("../dbs/dbs");

// require('util')  util.format
_.commandList = [
    '/start',
    '/feedback',
    '/setting',
    'hello',
    '/test',
    '/search'
]
_.reactToCommand = (bot, msg, userLang) => {
    let msgText = msg.text;

    if (msgText == "/start") {
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].check_it_out, { inlineCurrent: '' })]
        ]);
        let hiText = (lang[userLang].startMsg).replace('%s', msg.from.first_name)
            // console.log(hiText)
        return bot.sendMessage(msg.from.id, hiText, { replyMarkup });
    }
    if (msgText == "/example") {
        let text = lang[userLang].example
        return bot.sendMessage(msg.from.id, text, { replyMarkup: 'hide' });
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
    if (msgText == "/settings") {
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].setLang.en, { callback: '/english' }), bot.inlineButton(lang[userLang].setLang.he, { callback: '/hebrew' })],
            [bot.inlineButton(lang[userLang].cancel, { callback: '/cancel' })]
        ]);
        // console.log('settings');
        //if using keyboard, the bot must reply that it updated and at the same time hide the keyboard
        // let replyMarkup = bot.keyboard([
        //     [lang[userLang].setLang.en, lang[userLang].setLang.he],
        //     [lang[userLang].cancel]
        // ], { resize: true, once: true });
        return bot.sendMessage(msg.from.id, lang[userLang].setLang.language, { replyMarkup }); //, ask: 'lang'
    }
    //dev area 
    if (msg.from.id == process.env.DEV_TELEGRAM_ID) {
        if (msgText == '/restart') {
            setTimeout(() => {
                bot.stop('stop')
            }, 1000)
            setTimeout(() => {
                bot.start()
            }, 2000)
        };
        if (msgText == '/restart') {
            dbs.trystart()
        };
        if (msgText == "/test") {
            console.log(msg);
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
    }
}


module.exports = _;