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
        if (!data.canonicalTitle.includes('delete') && data.ageRatingGuide != "Mild Nudity") {
            // console.log(data.id)
            let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].description, { callback: Data[i].id + (Data[i].type == 'manga' ? '-m' : '-a') + '-d' }), bot.inlineButton(lang[userLang].genres, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-g' })],
                (data.nextRelease != null) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
            ]);
            let thumb = getPic(data, 'thumb');

            var searchResault = {
                id: Data[i].id,
                title: `[${lang[userLang].KitsuStuff[Data[i].type]}] ${data.canonicalTitle}`,
                description: `${(data.synopsis != (null && undefined && '')) ? JSON.stringify(data.synopsis) : lang[userLang].desc_not_available}`, //.replace(/<(?:.|\n)*?>/gm, '')
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