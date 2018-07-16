'use strict';

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;
const port = process.env.PORT || 443;
const host = process.env.HOST;

const TeleBot = require('telebot');
const usePlugins = ['askUser', 'commandButton']; //, 'namedButtons', 'commandButton' , 'floodProtection'
// const pluginConfig = {
//     floodProtection: {
//         interval: 5,
//         message: 'Too many messages, relax!'
//     }
//     //     namedButtons: {
//     //         buttons: BUTTONS
//     //     }
// };
//const BUTTONS = require('./buttons').buttons; //not realy needed

let bot;
if (process.env.NPM_CONFIG_PRODUCTION) {
    console.log('----Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginFolder: '../plugins/',
        // pluginConfig,
        webHook: { port: port, host: host }
    });
} else {
    console.log('----non-Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginFolder: '../plugins/',
        // pluginConfig,
        polling: true
    });
};

module.exports = bot;