'use strict';

const searchPic = "https://api.telegram.org/file/bot503582942:AAGTmWcCEsFSG_1ncSYYDG4VSKmTS0muCJo/photos/file_32.jpg"
const errorPic = "https://api.telegram.org/file/bot503582942:AAGTmWcCEsFSG_1ncSYYDG4VSKmTS0muCJo/documents/file_16.png"

const searchText = 'Search for anime, manga, characteres, staff and studios.';
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
        message_text: "anilist.co",
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    }
}

module.exports = _;