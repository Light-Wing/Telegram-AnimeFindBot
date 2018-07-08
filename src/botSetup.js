'use strict';

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN;
const port = process.env.PORT || 443;
const host = process.env.HOST;

const TeleBot = require('telebot');
const usePlugins = ['askUser', 'namedButtons', 'commandButton'];
const BUTTONS = require('./buttons').buttons; //not realy needed

let bot;
if (process.env.NPM_CONFIG_PRODUCTION) {
    console.log('----Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginConfig: {
            namedButtons: {
                buttons: BUTTONS
            }
        },
        webHook: { port: port, host: host }
    });
} else {
    console.log('----non-Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        pluginConfig: {
            namedButtons: {
                buttons: BUTTONS
            }
        },
        polling: true
    });
};
bot.getMe().then(function(me) { //self check
    const botName = me.username;
    console.log('---\nHello! My name is %s!', me.first_name);
    console.log(`And my username is @${ botName }\n---`);
    return botName;
});

module.exports = bot;