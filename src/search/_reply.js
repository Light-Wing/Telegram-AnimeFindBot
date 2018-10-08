'use strict';

const searchPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/smiling-face-with-open-mouth_1f603.png"
const errorPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/face-with-head-bandage_1f915.png"
const emoji1 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji2 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji3 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const charNormal = "https://github.com/LightWing-IsMe/Telegram-AnimeFindBot/blob/master/img/charachter.png?raw=true"
const charThink = "https://github.com/LightWing-IsMe/Telegram-AnimeFindBot/blob/master/img/charachter-thinking.png?raw=true"
const charHappy = "https://github.com/LightWing-IsMe/Telegram-AnimeFindBot/blob/master/img/charachter-happy.png?raw=true"

let _ = {};
_.defaultMessage = {
    he: {
        id: 1,
        title: "חיפוש %d ב%s",
        description: 'לחיפוש הקלידו את שם ה%d באנגלית או יפנית',
        thumb_url: charNormal,
        input_message_content: {
            message_text: "(ಥ_ಥ)",
            // parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    },
    en: {
        id: 1,
        title: "Search %d (in %s)",
        description: 'Now type in %d name in English or Japanese',
        thumb_url: charNormal,
        input_message_content: {
            message_text: "(ಥ_ಥ)",
            // parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    }
};
_.defaultAt = {
    he: {
        id: 2,
        title: "הוסיפו קידומת חיפוש",
        description: `@k, @m, @p - קיטסו\n@a, @c - אניליסט`,
        thumb_url: charNormal,
        input_message_content: {
            message_text: `@k חיפוש אנימה בקיטסו\n@m חיפוש מנגה בקיטסו\n@a חיפוש אנימה או מנגה באניליסט \n@c חיפוש דמות באניליסט\n@p חיפוש דמות בקיטסו`,
            parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    },
    en: {
        id: 2,
        title: "Add a Search Modifier:",
        description: `@k, @m, @p - Kitsu \n@a, @c - Anilist`,
        thumb_url: charNormal,
        input_message_content: {
            message_text: `@k Kitsu Anime Search\n@m Kitsu Manga Search\n@a Anilist Anime or Manga Search\n@c Anilist Character Search\n@p Kitsu Character Search`,
            parse_mode: 'Markdown',
            // disable_web_page_preview: true
        }
    }
};
_.errorMessage = {
    he: {
        id: 4,
        title: "לא נמצאו תוצאות",
        description: "בדקו שגיאות ונסו שוב",
        thumb_url: charThink,
        input_message_content: {
            message_text: "(ಥ﹏ಥ)",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    },
    en: {
        id: 4,
        title: "Nothing was Found",
        description: "look for typos and try again",
        thumb_url: charThink,
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
        id: 3,
        title: "החיפוש לא עובד בעברית",
        description: "נסו לחפש באנגלית או יפנית",
        thumb_url: charThink, //😴",
        input_message_content: {
            message_text: "ಥ‿ಥ",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    },
    en: {
        id: 3,
        title: "Searching only works in English",
        description: "Sorry, please search in english",
        thumb_url: charThink, //😴",
        input_message_content: {
            message_text: "ಥ‿ಥ",
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        }
    }
}


module.exports = _;