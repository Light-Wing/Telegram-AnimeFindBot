'use strict';

let _ = {};
let lang = require('../LANG');
let report = require("../report");
let commandList = require('./commands').commandList;

let sendTo_userID
_.ask = (bot, msg, askWhat, userLang, pref) => {
    if (msg.text == '/cancel' || commandList.includes(msg.text) || msg.text == lang['he'].cancel || msg.text == lang['en'].cancel) {
        //console.log("canceld")
        return bot.sendMessage(msg.chat.id, lang[userLang].cancelled, { replyMarkup: 'hide' });
    }

    switch (askWhat) {
        case 'feedback':
            if (msg.text == (lang[userLang].feedbackOps.issue)) {
                return bot.sendMessage(msg.chat.id, lang[userLang].feedbackAskInfo.issue, { ask: 'fb_issue' });
            } else if (msg.text == (lang[userLang].feedbackOps.idea)) {
                return bot.sendMessage(msg.chat.id, lang[userLang].feedbackAskInfo.idea, { ask: 'fb_idea' });
            } else if (msg.text == (lang[userLang].feedbackOps.g_feedback)) {
                return bot.sendMessage(msg.chat.id, lang[userLang].feedbackAskInfo.g_feedback, { ask: 'fb_g_feedback' });
            } else {
                let replyMarkup = bot.keyboard([
                    [lang[userLang].feedbackOps.issue, lang[userLang].feedbackOps.idea],
                    [lang[userLang].feedbackOps.g_feedback],
                    [lang[userLang].cancel]
                ], { resize: true, once: true });
                return bot.sendMessage(msg.chat.id, lang[userLang].choose_one_or_cancel, { replyMarkup, ask: 'feedback' });
            }
        case 'fb_issue':
            report.feedback(msg, 'Issues to report');
            return bot.sendMessage(msg.chat.id, lang[userLang].feedbackThanks.issue);
        case 'fb_idea':
            report.feedback(msg, 'Ideas to look at');
            return bot.sendMessage(msg.chat.id, lang[userLang].feedbackThanks.idea);
        case 'fb_g_feedback':
            report.feedback(msg, 'Feedback for you');
            return bot.sendMessage(msg.chat.id, lang[userLang].feedbackThanks.g_feedback);
        case 'lang':
            break;
        case 'sendTo':
            sendTo_userID = parseInt(msg.text)
            return bot.sendMessage(msg.chat.id, 'what should i send', { ask: 'sendWhat', replyToMessage: msg.message_id });
        case 'sendWhat':
            return bot.sendMessage(sendTo_userID, msg.text).then(() => {
                bot.sendMessage(msg.chat.id, 'sent', { replyToMessage: msg.message_id })
                sendTo_userID = undefined;
            }).catch(err => {
                bot.sendMessage(msg.chat.id, 'Error - Code: ' + err.error_code + '\n' + err.description, { replyToMessage: msg.message_id })
                sendTo_userID = undefined;
            });
        default:
            return
    }
};
// report.feedback(msg);
// break;

module.exports = _;