'use strict';

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;
const port = (process.env.PORT || 8443);
const host = process.env.HOST;
console.log("port: "+ port)
const TeleBot = require('telebot');
const usePlugins = ['commandButton']; //, 'namedButtons', 'commandButton' , 'floodProtection'
// const pluginFolder = '../plugins/';
// const pluginConfig = {
//     floodProtector: {
//         interval: 2,
//         message: 'Too many messages, relax!'
//     }
// };
//const BUTTONS = require('./buttons').buttons; //not realy needed

let bot;
if (process.env.NPM_CONFIG_PRODUCTION) {
    console.log('----Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        // pluginConfig,
        webHook: { port: port, host: host }
    });
} else {
    console.log('----non-Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        // pluginConfig,
        polling: true
    });
};
bot.plug(require('./utils/askUsers'))
bot.plug(require('./utils/floodProtector'))

let dataOnUser = {};

module.exports = { bot, dataOnUser };