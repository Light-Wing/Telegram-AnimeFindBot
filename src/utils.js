'use strict';

let dataOnUser = require("./userCache");;
const dbs = require("./dbs/dbs");

let _ = {}

_.time = () => {
    // res = 2018-07-08T09:30:00+0900
    var time = new Date().valueOf();
    return time
}

_.msToTime = (duration) => {
    if (duration < 0) {
        return 0
    }
    let
    // sec = parseInt((duration / (1000)) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt((duration / (1000 * 60 * 60 * 24))),
        d_h_space, h_m_space; //, m_s_space;

    d_h_space = ((days > 0) && ((hours > 0) || (minutes > 0))) ? " " : "";
    // m_s_space = ((hours > 0) && ((minutes > 0) || (sec > 0))) ? " " : "";
    h_m_space = ((hours > 0) && (minutes > 0)) ? " " : "";
    // sec = (sec > 0) ? sec + "s" : "";
    minutes = (minutes > 0) ? minutes + "m" : "";
    hours = (hours > 0) ? hours + "h" : "";
    days = (days > 0) ? days + "d" : "";
    let mstime = days + d_h_space + hours + h_m_space + minutes; //+ m_s_space + sec;
    return mstime
}
_.userCache = (msg, check) => {
    let cache = [];
    let userID = msg.from.id;
    //check cache, if not there, then check db, if not there, then check getUserLanguage
    if (dataOnUser[userID] === undefined) {
        dataOnUser[userID] = {};
    }
    dataOnUser[userID]['time'] = new Date().valueOf();
    if (dataOnUser[userID]['lang'] === undefined || dataOnUser[userID]['desc'] === undefined) {
        //then get it ready for next time, but dont wait now...
        dbs.checkUserPrefs(msg)
            .then(res => {
                //res[0] -> lang
                //res[1] -> desc
                if (res[0] == null) {
                    dataOnUser[userID]['lang'] = getUserLanguage(msg)
                } else {
                    dataOnUser[userID]['lang'] = res[0]
                }
                if (res[1] == null) {
                    dataOnUser[userID]['desc'] = 'sendDesc_silent2'
                } else {
                    dataOnUser[userID]['desc'] = res[1]
                }
            }).catch(function(err) {
                if (err = 'error') {
                    dataOnUser[userID]['lang'] = getUserLanguage(msg)
                }
            });
        if (dataOnUser[userID]['lang'] === undefined) {
            cache[0] = getUserLanguage(msg)
        } else {
            cache[0] = dataOnUser[userID]['lang']
        }
        if (dataOnUser[userID]['desc'] === undefined) {
            cache[1] = 'sendDesc_silent'
        } else {
            cache[1] = dataOnUser[userID]['desc']
        }
    } else {
        cache[0] = dataOnUser[userID]['lang']
        cache[1] = dataOnUser[userID]['desc']
    }
    if (check == 'both') {
        return cache
    } else {
        return cache[0]
    }
}
_.md2html = (text) => {
    return text
        .replace(/_(.+?)_/g, `<i>$1</i>`)
        .replace(/\*(.+?)\*/g, `<b>$1</b>`)
        .replace(/`{3}\w*\n(.+?)\n`{3}/gs, `<pre>$1</pre>`)
        .replace(/`(.+?)`/g, `<code>$1</code>`)
        .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2">$1</a>`);
};

_.html2md = (text) => {
    return text
        .replace(/<i>(.+?)<\/i>/g, `_$1_`)
        .replace(/<b>(.+?)<\/b>/g, `*$1*`)
        .replace(/<pre>(.+?)<\/pre>/gs, `\`\`\`$1\`\`\``)
        .replace(/<code>(.+?)<\/code>/g, `\`$1\``)
        .replace(/<a href="(.+?)">(.+?)<\/a>/g, `[$2]($1)`);
};

function getUserLanguage(msg) {
    let lang = (msg.from != undefined && msg.from.language_code != (undefined || null)) ? msg.from.language_code.split("-")[0] : "en";
    switch (lang) {
        case "en":
            return 'en'
        case "iw" || 'he':
            return 'he'
        default:
            return 'en'
    }
};
// setInterval(() => {
//     console.log(dataOnUser)
// }, 1000);

module.exports = _;