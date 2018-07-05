'use strict';

let getPic = require('./getPic')

let _ = {}

_ = (Data, nextOffset, bot, msg, userLang) => {
    console.log('anime serach called')
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 100, personal: false, });
    // results.addArticle(
    //     reply.loadedMore
    // )
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;
        if (!data.canonicalTitle.includes('delete')) {
            // console.log('dataid', Data[i].id)
            let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(userLang.description, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-d' }), bot.inlineButton(userLang.genres, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-g' })],
                (data.nextRelease != null) ? [bot.inlineButton(userLang.nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
            ]);
            let thumb = getPic(data, 'thumb');
            var searchResault = {
                id: Data[i].id,
                title: `[${userLang.KitsuStuff[Data[i].type]}] ${data.canonicalTitle}`,
                description: data.synopsis != (null && undefined && '') ? JSON.stringify(data.synopsis) : userLang.desc_not_available, //.replace(/<(?:.|\n)*?>/gm, '')
                thumb_url: thumb,
                input_message_content: {
                    message_text: messageSent(data, userLang, Data[i].type, Data[i].id),
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false
                },
                reply_markup: replyMarkup
            }
            results.addArticle(searchResault);
        }
    }
    return results;
}

//     "data": {
//       "id": "1",
//       "type": "anime",
//       "links": {
//         "self": "https://kitsu.io/api/edge/anime/1"
//       },
//       "attributes": {
//         "slug": "cowboy-bebop",
//         "synopsis": "In the year 2071, ",
//         "coverImageTopOffset": 400,
//         "titles": {
//           "en": "Cowboy Bebop",
//           "en_jp": "Cowboy Bebop",
//           "ja_jp": "カウボーイビバップ"
//         },
//         "canonicalTitle": "Cowboy Bebop",
//         "abbreviatedTitles": [
//           "COWBOY BEBOP"
//         ],
//         "averageRating": "84.39",
//         "ratingFrequencies": {
//           "2": "1469"
//         },
//         "userCount": 68066,
//         "favoritesCount": 3866,
//         "startDate": "1998-04-03",
//         "endDate": "1999-04-24",
//         "nextRelease": null,
//         "popularityRank": 15,
//         "ratingRank": 33,
//         "ageRating": "R",
//         "ageRatingGuide": "17+ (violence & profanity)",
//         "subtype": "TV",
//         "status": "finished",
//         "tba": "",
//         "posterImage": {
//           "tiny": "https://media.kitsu.io/anime/poster_images/1/tiny.jpg?1431697256",
//           "small": "https://media.kitsu.io/anime/poster_images/1/small.jpg?1431697256",
//           "medium": "https://media.kitsu.io/anime/poster_images/1/medium.jpg?1431697256",
//           "large": "https://media.kitsu.io/anime/poster_images/1/large.jpg?1431697256",
//           "original": "https://media.kitsu.io/anime/poster_images/1/original.jpg?1431697256"
//         },
//         "coverImage": {
//           "tiny": "https://media.kitsu.io/anime/cover_images/1/tiny.jpg?1519178801",
//           "small": "https://media.kitsu.io/anime/cover_images/1/small.jpg?1519178801",
//           "large": "https://media.kitsu.io/anime/cover_images/1/large.jpg?1519178801",
//           "original": "https://media.kitsu.io/anime/cover_images/1/original.jpg?1519178801"
//         },
//         "episodeCount": 26,
//         "episodeLength": 25,
//         "youtubeVideoId": "qig4KOK2R2g",
//         "showType": "TV",
//         "nsfw": false}}}

function messageSent(data, userLang, type, id) {
    let titleEN, titleJP, titleRJ, imageCover, ageRating, ageRatingGuide, episodeCount, StartDate, EndDate, episodeLength, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity;
    //titles - romaji english native
    titleRJ = data.titles.en_jp != (null && undefined && '') ? `🇺🇸 [${data.titles.en_jp}](https://kitsu.io/${type}/${id})\n` : (data.canonicalTitle != (null || undefined) ? `🇺🇸 [${data.canonicalTitle}](https://kitsu.io/${type}/${id})\n` : '');
    titleJP = data.titles.ja_jp != (null && undefined && '') ? `🇯🇵 ${data.titles.ja_jp}\n` : '';
    titleEN = data.titles.en != (null && undefined && '') ? `🇬🇧 ${data.titles.en}\n` : '';
    //cover - banner
    //imageCover = data.coverImage.large != null ? `[\u200B](${data.coverImage.large})` : '';
    let pic = getPic(data, 'full')
    imageCover = pic != null ? `[\u200B](${pic})` : null;
    //trailer
    trailer = (data.youtubeVideoId != (null && undefined && '')) ? (`🎥 [${userLang.trailer}](https://youtu.be/${data.youtubeVideoId})\n`) : '';
    //eps 
    episodeCount = data.episodeCount != (null && undefined && '') ? `\n- ${userLang.episodes}: *${data.episodeCount}*` : '';
    episodeLength = (data.episodeLength != (null && undefined && '') && data.episodeCount != (null && undefined && '')) ? ` (${data.episodeLength} ${userLang.minutes_per_episode})` : '';
    //volumes 
    // these two dont work yet, need to get kitsu to search manga as well
    volumes = data.volumes != (null && undefined && '') ? `\n- ${userLang.volumes}: *${data.volumes}*` : '';
    //chapters
    // these two dont work yet, need to get kitsu to search manga as well
    chapters = data.chapters != (null && undefined && '') ? `\n- ${userLang.chapters}: *${data.chapters}*` : '';
    //startDate startDate nextRelease year-month-day
    StartDate = (data.startDate != (null && undefined && '')) ? data.startDate.split('-') : ''
    startDate = (data.startDate != (null && undefined && '')) ? `\n- ${userLang.start_date}: ` : '';
    sday = (StartDate[2] != (null && undefined && '')) ? `${StartDate[2]}/` : '';
    smonth = (StartDate[1] != (null && undefined && '')) ? `${StartDate[1]}/` : '';
    syear = (StartDate[0] != (null && undefined && '')) ? `${StartDate[0]}` : '';
    //endDate endDate
    EndDate = (data.endDate != (null || undefined)) ? data.endDate.split('-') : ''
    endDate = (data.endDate != (null && undefined && '')) ? `\n- ${userLang.end_date}: ` : '';
    eday = (EndDate[2] != (null && undefined && '')) ? `${EndDate[2]}/` : '';
    emonth = (EndDate[1] != (null && undefined && '')) ? `${EndDate[1]}/` : '';
    eyear = (EndDate[0] != (null && undefined && '')) ? `${EndDate[0]}` : '';
    //status
    status = (data.status != (null && undefined && '')) ? `\n- ${userLang.status}: *${userLang.KitsuStuff[data.status]}*` : ''; //.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })
    averageScore = (data.averageScore != (null && undefined && '')) ? `\n- ${userLang.score}: *${data.averageScore}*` : '';
    popularity = (data.popularity != (null && undefined && '')) ? `\n- ${userLang.popularity}: *${data.popularity}*` : '';
    //rating ageRating ageRatingGuide
    ageRating = (data.ageRating != (null && undefined && '')) ? `\n- ${userLang.rated}: *${data.ageRating}*` : '';
    ageRatingGuide = ((data.ageRating != (null && undefined && '')) && (data.ageRatingGuide != null)) ? ` - ${data.ageRatingGuide}` : '';
    //description
    // description = (data.synopsis != null) ? `\n\n ${data.synopsis}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodeCount}${episodeLength}${volumes}${chapters}${status}${averageScore}${popularity}${startDate}*${sday}${smonth}${syear}*${endDate}*${eday}${emonth}${eyear}*${ageRating}${ageRatingGuide}`;
}
module.exports = _;