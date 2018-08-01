'use strict';

const searchPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/smiling-face-with-open-mouth_1f603.png"
const errorPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/face-with-head-bandage_1f915.png"
const emoji1 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji2 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji3 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔

let _ = {};
_.defaultMessage = {
    he: {
        cacheTime: 0,
        id: 1,
        title: "חפשו אנימה ב %s",
        description: 'לחיפוש הקלידו את שם האנימה באנגלית או יפנית',
        thumb_url: searchPic,
        input_message_content: {
            message_text: "(ಥ_ಥ)",
            // parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    },
    en: {
        cacheTime: 0,
        id: 1,
        title: "Search Anime (%s)",
        description: 'start typing in english or japanese',
        thumb_url: searchPic,
        input_message_content: {
            message_text: "(ಥ_ಥ)",
            // parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    }
};
_.errorMessage = {
    he: {
        cacheTime: 10,
        id: 4,
        title: "לא נמצאו תוצאות",
        description: "בדקו שגיאות ונסו שוב",
        thumb_url: errorPic,
        input_message_content: {
            message_text: "(ಥ﹏ಥ)",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    },
    en: {
        cacheTime: 10,
        id: 4,
        title: "Nothing was Found",
        description: "look for typos and try again",
        thumb_url: errorPic,
        input_message_content: {
            message_text: "(ಥ﹏ಥ)",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    }
};
// _.loadedMore = {
//     cacheTime: 100,
//     id: 1,
//     title: "Added Some more answers",
//     description: "keep going down",
//     thumb_url: errorPic,
//     input_message_content: {
//         message_text: "ಥ‿ಥ",
//         parse_mode: 'Markdown',
//         disable_web_page_preview: false
//     }
// }
// _.errorMessageNoMore = {
//     cacheTime: 100,
//     id: 2,
//     title: "thats the end of the line",
//     description: "no more results found",
//     thumb_url: "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/sleepy-face_1f62a.png", //😴",
//     input_message_content: {
//         message_text: "ಥ‿ಥ",
//         parse_mode: 'Markdown',
//         disable_web_page_preview: false
//     }
// }
_.englishSearchOnly = {
    he: {
        cacheTime: 100,
        id: 3,
        title: "החיפוש לא עובד בעברית",
        description: "נסו לחפש באנגלית או יפנית",
        thumb_url: "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/sleepy-face_1f62a.png", //😴",
        input_message_content: {
            message_text: "ಥ‿ಥ",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    },
    en: {
        cacheTime: 100,
        id: 3,
        title: "searching only works in english",
        description: "sorry, please search in english",
        thumb_url: "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/sleepy-face_1f62a.png", //😴",
        input_message_content: {
            message_text: "ಥ‿ಥ",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    }
}


module.exports = _;