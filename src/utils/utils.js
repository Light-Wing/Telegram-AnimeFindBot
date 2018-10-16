'use strict';

let dataOnUser = require('../botSetup').dataOnUser;
const dbs = require("./dbs");

let defaultDesc = 'sendDesc_silent'
let defaultSrc = 'anilist';

let _ = {}

_.time = () => {
    // res = 2018-07-08T09:30:00+0900
    var time = new Date().valueOf();
    return time
}

_.msToTime = (duration, userLang) => {
    if (duration < 0) {
        return 0
    }
    let h, m, d;
    if (userLang == 'he') {
        h = ' שעות';
        m = ' דקות';
        d = ' ימים';
    } else {
        h = 'h';
        m = 'm';
        d = 'd';
    }
    // let
    // // sec = parseInt((duration / (1000)) % 60),
    //     minutes = parseInt((duration / (1000 * 60)) % 60),
    //     hours = parseInt((duration / (1000 * 60 * 60)) % 24),
    //     days = parseInt((duration / (1000 * 60 * 60 * 24))),
    //     d_h_space, h_m_space; //, m_s_space;

    duration = Number(duration);
    var days = Math.floor((duration / 1000) / (3600 * 24));
    var hours = Math.floor((duration / 1000) % (3600 * 24) / 3600);
    var minutes = Math.floor((duration / 1000) % 3600 / 60);
    var sec = Math.floor((duration / 1000) % 3600 % 60);

    let d_h_space = ((days > 0) && ((hours > 0) || (minutes > 0))) ? " " : "";
    // m_s_space = ((hours > 0) && ((minutes > 0) || (sec > 0))) ? " " : "";
    let h_m_space = ((hours > 0) && (minutes > 0)) ? " " : "";
    // sec = (sec > 0) ? sec + "s" : "";
    minutes = (minutes > 0) ? minutes + m : "";
    hours = (hours > 0) ? hours + h : "";
    days = (days > 0) ? days + d : "";
    let mstime = days + d_h_space + hours + h_m_space + minutes; //+ m_s_space + sec;
    return mstime
}

_.secondsToDhms = (duration) => {
    duration = Number(duration);
    var d = Math.floor(duration / (3600 * 24));
    var h = Math.floor(duration % (3600 * 24) / 3600);
    var m = Math.floor(duration % 3600 / 60);
    var s = Math.floor(duration % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

_.miliSecondsToDhms = (duration) => {
    duration = Number(duration);
    var d = Math.floor((duration / 1000) / (3600 * 24));
    var h = Math.floor((duration / 1000) % (3600 * 24) / 3600);
    var m = Math.floor((duration / 1000) % 3600 / 60);
    var s = Math.floor((duration / 1000) % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

_.userCache = async(msg) => {
    let userID = msg.from.id;
    //check cache, if not there, then check db, if not there, then check getUserLanguage and set defaults
    if (dataOnUser[userID] === undefined) {
        dataOnUser[userID] = {};
        //just in case to get things going fast
    }
    dataOnUser[userID]['time'] = new Date().valueOf();

    if (dataOnUser[userID]['lang'] === undefined || dataOnUser[userID]['desc'] === undefined || dataOnUser[userID]['src'] === undefined) {
        //then get it ready for next time, but dont wait now...
        dbs.checkUserPrefs(msg)
            .then(res => {
                console.log(res);
                //res[0] -> lang
                //res[1] -> desc
                //res[2] -> src
                if (res[0] !== null && res[0] !== '') {
                    dataOnUser[userID]['lang'] = res[0];
                } else {
                    dataOnUser[userID]['lang'] = getUserLanguage(msg);
                }
                if (res[1] !== null && res[1] !== '') {
                    dataOnUser[userID]['desc'] = res[1];
                } else {
                    dataOnUser[userID]['desc'] = defaultDesc;
                }
                if (res[2] !== null && res[2] !== '') {
                    dataOnUser[userID]['src'] = res[2];
                } else {
                    dataOnUser[userID]['src'] = defaultSrc;
                }
            }).catch(function(err) {
                if (err = 'error') {
                    dataOnUser[userID]['lang'] = getUserLanguage(msg)
                }
            });
        if (dataOnUser[userID]['lang'] === undefined) {
            dataOnUser[userID]['lang'] = getUserLanguage(msg);
        }
        if (dataOnUser[userID]['desc'] === undefined) {
            dataOnUser[userID]['desc'] = defaultDesc;
        }
        if (dataOnUser[userID]['src'] === undefined) {
            dataOnUser[userID]['src'] = defaultSrc;
        }
    } else {
        // cache[0] = dataOnUser[userID]['lang']
        // cache[1] = dataOnUser[userID]['desc']
        // cache[2] = dataOnUser[userID]['src']
        // return dataOnUser[userID];
        //dont really need to do anything, since everything is up-to-date
    }
    return dataOnUser[userID]
}
_.md2html = (text) => {
    return text
        .replace(/_(.+?)_/g, `<i>$1</i>`)
        .replace(/\*(.+?)\*/g, `<b>$1</b>`)
        .replace(/`{3}\w*\n(.+?)\n`{3}/gs, `<pre>$1</pre>`)
        .replace(/`(.+?)`/g, `<code>$1</code>`)
        .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2">$1</a>`);
};

_.md2tgmd = (text) => {
    return text
        .replace(/__(.+?)__/g, `_$1_`)
        .replace(/\*/g, "＊")
        .replace(/(`)/g, '')
        .replace(/`/g, '')
        .replace(/<i>(.+?)<\/i>/g, `_$1_`)
        .replace(/<b>(.+?)<\/b>/g, `*$1*`)
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/&quot;/g, '\"')
        .replace(/\n{2,}/g, `\n\n`);
    //.replace(/\\"/g, '"')
};

//.replace(/<(?:.|\n)*?>/gm, '');

_.html2md = (text) => {
    return text
        .replace(/<i>(.+?)<\/i>/g, `_$1_`)
        .replace(/<b>(.+?)<\/b>/g, `*$1*`)
        .replace(/<pre>(.+?)<\/pre>/gs, `\`\`\`$1\`\`\``)
        .replace(/<code>(.+?)<\/code>/g, `\`$1\``)
        .replace(/<strong>(.+?)<\/strong>/g, `*$1*`)
        .replace(/__(.+?)__/g, `_$1_`)
        .replace(/<br>/g, `\n`)
        .replace(/<br>(.+?)<br \/>/gs, `_$1_`)
        .replace(/<p>(.+?)<\/p>/gs, `_$1_`)
        .replace(/<a href="(.+?)">(.+?)<\/a>/g, `[$2]($1)`)
        .replace(/<span(.+?)>(.+?)<\/span>/g, `$2`);
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