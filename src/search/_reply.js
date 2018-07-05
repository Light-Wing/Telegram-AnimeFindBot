'use strict';

const searchPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/smiling-face-with-open-mouth_1f603.png"
const errorPic = "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/face-with-head-bandage_1f915.png"
const emoji1 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji2 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔
const emoji3 = "https://emoji.beeimg.com/%F0%9F%A4%94/200/apple" //🤔

const searchText = 'type inline to search anime.';
let _ = {};
_.defaultMessage = {
    cacheTime: 300,
    id: 1,
    title: "Search Anime (on Kitsu)",
    description: searchText,
    thumb_url: searchPic,
    input_message_content: {
        message_text: searchText,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    }
}
_.errorMessage = {
    cacheTime: 10,
    id: 0,
    title: "Nothing was Found",
    description: "no results for the keyword(s) you provided",
    thumb_url: errorPic,
    input_message_content: {
        message_text: "(ಥ﹏ಥ)",
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    }
}
_.loadedMore = {
    cacheTime: 100,
    id: 1,
    title: "Added Some more answers",
    description: "keep going down",
    thumb_url: errorPic,
    input_message_content: {
        message_text: "ಥ‿ಥ",
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    }
}
_.errorMessageNoMore = {
    cacheTime: 100,
    id: 2,
    title: "thats the end of the line",
    description: "no more results found",
    thumb_url: "https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/sleepy-face_1f62a.png", //😴",
    input_message_content: {
        message_text: "ಥ‿ಥ",
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    }
}


module.exports = _;