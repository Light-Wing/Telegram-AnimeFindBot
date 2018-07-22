'use strict';

let getPic = require('./getPic')
let lang = require('../LANG');
const animeSearch = require('./animeSearch')

let _ = {}

_ = (Data, nextOffset, bot, msg, userLang, count) => { //nextOffset: nextOffset, 
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 10000, personal: false, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });
    // results.addArticle(
    //     reply.loadedMore
    // )
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;
        // console.log(data.subtype)

        if (!data.canonicalTitle.includes('delete')) { // && data.ageRatingGuide != "Mild Nudity"
            // console.log(data.id)
            let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].description, { callback: Data[i].id + (Data[i].type == 'manga' ? '-m' : '-a') + '-d' }), bot.inlineButton(lang[userLang].genres, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-g' })],
                (data.nextRelease != null) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
            ]);
            let thumb = getPic(data, 'thumb');
            let desc = data.synopsis != (null && undefined) ? data.synopsis.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').replace(/\n{2,}/g, '\n\n') : lang[userLang].desc_not_available; //.replace(/<(?:.|\n)*?>/gm, '');
            if (desc == (null || undefined || '')) {
                desc = lang[userLang].desc_not_available;
            } else if (desc.length >= 100) {
                desc = desc.substring(0, 100);
                let last = desc.lastIndexOf(" ");
                desc = desc.substring(0, last);
                desc = desc + "...";
            }
            var searchResault = {
                id: Data[i].id,
                title: `[${lang[userLang].kitsuStuff[data.subtype]}] ${data.canonicalTitle}`,
                description: desc,
                thumb_url: thumb,
                input_message_content: {
                    message_text: animeSearch.messageSent(data, userLang, Data[i].type, Data[i].id),
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false
                },
                reply_markup: replyMarkup
            }
            results.addArticle(searchResault);
        }
    }
    return results;
};

module.exports = _;