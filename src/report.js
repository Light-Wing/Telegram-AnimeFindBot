'use strict';

let _ = {};

const ERR_CHNL_CHAT_ID = process.env.ERR_CHNL_CHAT_ID;
const USERS_CNL = process.env.USERS_CNL;
let getUser = require("./search/getUserName").verifyUser;

_.error = (bot, errMsg, error, markdown) => {
    const ops = {
        parseMode: (markdown == false) ? "HTML" : "Markdown",
        notification: false,
        webPreview: true,
        replyToMessage: false,
        replyMarkup: null
    };
    bot.sendMessage(ERR_CHNL_CHAT_ID, errMsg + error, ops);
}
_.user = (bot, msg, didWhat, results, time) => {
    const ops = {
        parseMode: "Markdown",
        notification: false,
        webPreview: true,
        replyToMessage: false,
        replyMarkup: null
    };
    let text = '';
    switch (didWhat) {
        case "search":
            text = `searched "*${msg.query}*" and got: ${JSON.stringify(results.list.length)} results (${time})`
            break;
        case "epDate":
            text = results
            break;
        default:
            text = results;
    }
    let msgText = `ID: \`${msg.from.id}\` - [${getUser(msg.from, "first&last")}](tg://user?id=${msg.from.id})\n${text}`
    bot.sendMessage(USERS_CNL, msgText, ops);
    //make it check pre message to see if same id, if so, add this to that message
}

module.exports = _;