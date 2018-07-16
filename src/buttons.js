'use strict';

let _ = {};
let lang = require('./LANG');

_.buttons = {
    hello: {
        label: '👋 Hello',
        command: '/hello'
    },
    world: {
        label: 'World',
        command: '/world'
    },
    e: {
        hide: {
            label: `hide` || 'הסתר',
            command: '/hide'
        },
    },
    he: {
        lang_HE: {
            label: lang.he.setLang.he,
            command: '/hebrew'
        },
        lang_EN: {
            label: lang.he.setLang.en,
            command: '/english'
        },
    },
    en: {
        lang_HE: {
            label: lang.en.setLang.he,
            command: '/hebrew'
        },
        lang_EN: {
            label: lang.en.setLang.en,
            command: '/english'
        },
    },
    fb_issue: {
        lebel: lang.he.feedback.issue,
        command: '/fb_issue'
    },
    fb_idea: {
        label: lang.he.feedback.idea,
        command: '/fb_idea'
    },
    fb_g: {
        label: lang.he.feedback.g_feedback,
        command: '/fb_g'
    },
    fb_issue: {
        lebel: lang.en.feedback.issue,
        command: '/fb_issue'
    },
    fb_idea: {
        label: lang.en.feedback.idea,
        command: '/fb_idea'
    },
    fb_g: {
        label: lang.en.feedback.g_feedback,
        command: '/fb_g'
    }
}

module.exports = _;