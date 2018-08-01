'use strict';

var sanitizeHtml = require('sanitize-html');
let lang = require('../LANG');

let _ = {}

_ = (Data, nextOffset, bot, msg, userLang, count, originalQuery) => {
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 300, personal: true, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;

        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery })]
        ]);
        console.log(Data[i].type)

        var searchResault = {
            id: Data[i].id,
            title: `[${lang[userLang].kitsuStuff[Data[i].type]}] ${data.canonicalName}`,
            description: ((data.description)) ? sanitizeHtml(data.description).replace(/<br\s*[\/]?>/gi, " ").replace(/\n{2,}/g, ' ') : lang[userLang].desc_not_available, //.replace(/<(?:.|\n)*?>/gm, '')
            thumb_url: (data.image) ? data.image.original : undefined,
            input_message_content: {
                message_text: messageSent(data, Data[i].type, Data[i].id),
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            },
            reply_markup: replyMarkup
        };
        // var searchResaultPhoto = {
        //     id: Data[i].id,
        //     caption: 'Telegram logo.', //messageSent(data, Data[i].type, Data[i].id),
        //     photo_url: (data.image  ) ? data.image.original.split('?')[0] : 'undefined',
        //     thumb_url: (data.image  ) ? data.image.original.split('?')[0] : 'undefined',
        // }
        // console.log(searchResaultPhoto)
        // results.addPhoto(searchResaultPhoto);
        results.addArticle(searchResault);
    }
    // console.log('resaults', results)
    return results;
};


// "data": {
//     "id": "1",
//     "type": "characters",
//     "links": {
//         "self": "https://kitsu.io/api/edge/characters/1"
//     },
//     "attributes": {
//         "slug": "jet-black",
//         "names": {
//             "en": "Jet Black",
//             "ja_jp": "ジェット・ブラック"
//         },
//         "canonicalName": "Jet Black",
//         "otherNames": [
//             "Running Rock",
//             "Black Dog"
//         ],
//         "name": "Jet Black",
//         "malId": 3,
//         "description": "Jet, known on his home satellite as the \"Black Dog\" for his tenacity, is a 36-year-old former cop from Ganymede (a Jovian sa
//         "image": {
//             "original": "https://media.kitsu.io/characters/images/1/original.jpg?1483096805",}}}

function messageSent(data, type, id) {
    let titleEN, titleJP, titleRJ, image, malId, description, aka;
    //titles - romaji english native
    titleRJ = data.names.en ? `[${data.names.en}](https://kitsu.io/${type}/${id})\n` : (data.canonicalName != (null || undefined) ? `[${data.canonicalName}](https://kitsu.io/${type}/${id})\n` : '');
    titleJP = data.names.ja_jp ? `${data.names.ja_jp}\n` : '';
    titleEN = data.names.en_jp ? `${data.names.en_jp}\n` : '';
    //add to aka a space after each ,
    aka = data.otherNames.toString() ? `A.K.A: ${data.otherNames.toString().replace(/,/g, ', ')}` : '';
    console.log(data.otherNames)

    // let pic = getPic(data, 'full')
    image = (data.image) ? `[\u200B](${data.image.original})` : '';
    // console.log(data.image)

    //status
    malId = (data.malId) ? `\n- MAL ID: *${data.malId}*` : '';
    //description
    description = (data.description) ? `\n\n${sanitizeHtml(data.description).replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, ' ').replace(/&quot;/g, '\"')}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
    if (description.length >= 400) {
        description = description.substring(0, 400);
        let last = description.lastIndexOf(" ");
        description = description.substring(0, last);
        description = description + "...";
    }
    // console.log(description)

    //message text - removed: ${description}
    return `${image}${titleRJ}${titleJP}${titleEN}${aka}${description}`;
}


module.exports = _;