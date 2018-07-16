'use strict';

var sanitizeHtml = require('sanitize-html');
let lang = require('../LANG');

let _ = {}

_ = (Data, nextOffset, bot, msg, userLang) => {
    // console.log('character serach called', nextOffset)
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 10, personal: false, });
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;

        var searchResault = {
            id: Data[i].id,
            title: `[${lang[userLang].KitsuStuff[Data[i].type]}] ${data.canonicalName}`,
            description: ((data.description) != (null && undefined && '')) ? sanitizeHtml(data.description).replace(/<br\s*[\/]?>/gi, " ").replace(/\n{2,}/g, ' ') : lang[userLang].desc_not_available, //.replace(/<(?:.|\n)*?>/gm, '')
            thumb_url: (data.image != (null && undefined && '')) ? data.image.original : undefined,
            input_message_content: {
                message_text: messageSent(data, Data[i].type, Data[i].id),
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            }
        };
        // var searchResaultPhoto = {
        //     id: Data[i].id,
        //     caption: 'Telegram logo.', //messageSent(data, Data[i].type, Data[i].id),
        //     photo_url: (data.image != (null && undefined && '')) ? data.image.original.split('?')[0] : 'undefined',
        //     thumb_url: (data.image != (null && undefined && '')) ? data.image.original.split('?')[0] : 'undefined',
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
    titleRJ = data.names.en != (null && undefined && '') ? `[${data.names.en}](https://kitsu.io/${type}/${id})\n` : (data.canonicalName != (null || undefined) ? `[${data.canonicalName}](https://kitsu.io/${type}/${id})\n` : '');
    titleJP = data.names.ja_jp != (null && undefined && '') ? `${data.names.ja_jp}\n` : '';
    titleEN = data.names.en_jp != (null && undefined && '') ? `${data.names.en_jp}\n` : '';
    //add to aka a space after each ,
    aka = data.otherNames != (null && undefined && '') ? `A.K.A: ${data.otherNames.toString()}` : '';
    // console.log(aka, data.otherNames, data.otherNames.toString())

    // let pic = getPic(data, 'full')
    image = (data.image != (null && undefined && '')) ? `[\u200B](${data.image.original})` : '';

    //status
    malId = (data.malId != (null && undefined && '')) ? `\n- MAL ID: *${data.malId}*` : '';
    //description
    description = (data.description != (null && undefined && '')) ? `\n\n ${sanitizeHtml(data.description).replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, ' ')}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
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