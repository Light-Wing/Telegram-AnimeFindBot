'use strict';

let getPic = require('./getPic')
let lang = require('../LANG');

let _ = {}

_ = (Data, nextOffset, bot, msg, userLang) => {
    // console.log('manga serach called')

    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 100, personal: false, });
    // results.addArticle(
    //     reply.loadedMore
    // )
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;

        if (!data.canonicalTitle.includes('delete')) {
            // console.log(data.id)
            let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(lang[userLang].description, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-d' }), bot.inlineButton(lang[userLang].genres, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-g' })],
                (data.nextRelease != null) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
            ]);
            let thumb = getPic(data, 'thumb');

            var searchResault = {
                id: Data[i].id,
                title: `[${lang[userLang].KitsuStuff[Data[i].type]}] ${data.canonicalTitle}`,
                description: `${(data.synopsis != (null && undefined && '')) ? JSON.stringify(data.synopsis) : lang[userLang].desc_not_available}`, //.replace(/<(?:.|\n)*?>/gm, '')
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
};
// {
//     "data": {
//       "id": "13569",
//       "type": "manga",
//       "links": {
//         "self": "https://kitsu.io/api/edge/manga/13569"
//       },
//       "attributes": {
//         "createdAt": "2013-12-18T13:58:09.101Z",
//         "updatedAt": "2018-07-04T18:00:27.841Z",
//         "slug": "kiss-ariki",
//         "synopsis": "Tohru, the son ",
//         "coverImageTopOffset": 0,
//         "titles": {
//           "en": "Starting with a Kiss",
//           "en_jp": "Kiss Ariki."
//         },
//         "canonicalTitle": "Kiss Ariki.",
//         "abbreviatedTitles": null,
//         "averageRating": null,
//         "userCount": 21,
//         "favoritesCount": 0,
//         "startDate": "2010-05-30",
//         "endDate": null,
//         "nextRelease": null,
//         "popularityRank": 12416,
//         "ratingRank": null,
//         "ageRating": "PG",
//         "ageRatingGuide": null,
//         "subtype": "manga",
//         "status": "current",
//         "tba": null,
//         "posterImage": {
//           "tiny": "https://media.kitsu.io/manga/poster_images/13569/tiny.jpg?1434279134",
//           "small": "https://media.kitsu.io/manga/poster_images/13569/small.jpg?1434279134",
//           "medium": "https://media.kitsu.io/manga/poster_images/13569/medium.jpg?1434279134",
//           "large": "https://media.kitsu.io/manga/poster_images/13569/large.jpg?1434279134",
//           "original": "https://media.kitsu.io/manga/poster_images/13569/original.jpg?1434279134"
//         },
//         "coverImage": null,
//         "chapterCount": null,
//         "volumeCount": 0,
//         "serialization": "B-Boy Honey",
//         "mangaType": "manga"
//       }
//     }
//   }
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
    trailer = (data.youtubeVideoId != (null && undefined && '')) ? (`🎥 [${lang[userLang].trailer}](https://youtu.be/${data.youtubeVideoId})\n`) : '';
    //eps 
    episodeCount = data.episodeCount != (null && undefined && '') ? `\n- ${lang[userLang].episodes}: *${data.episodeCount}*` : '';
    episodeLength = (data.episodeLength != (null && undefined && '') && data.episodeCount != (null && undefined && '')) ? ` (${data.episodeLength} ${lang[userLang].minutes_per_episode})` : '';
    //volumes 
    // these two dont work yet, need to get kitsu to search manga as well
    volumes = data.volumes != (null && undefined && '') ? `\n- ${lang[userLang].volumes}: *${data.volumes}*` : '';
    //chapters
    // these two dont work yet, need to get kitsu to search manga as well
    chapters = data.chapters != (null && undefined && '') ? `\n- ${lang[userLang].chapters}: *${data.chapters}*` : '';
    //startDate startDate nextRelease year-month-day
    StartDate = (data.startDate != (null && undefined && '')) ? data.startDate.split('-') : ''
    startDate = (data.startDate != (null && undefined && '')) ? `\n- ${lang[userLang].start_date}: ` : '';
    sday = (StartDate[2] != (null && undefined && '')) ? `${StartDate[2]}/` : '';
    smonth = (StartDate[1] != (null && undefined && '')) ? `${StartDate[1]}/` : '';
    syear = (StartDate[0] != (null && undefined && '')) ? `${StartDate[0]}` : '';
    //endDate endDate
    EndDate = (data.endDate != (null || undefined)) ? data.endDate.split('-') : ''
    endDate = (data.endDate != (null && undefined && '')) ? `\n- ${lang[userLang].end_date}: ` : '';
    eday = (EndDate[2] != (null && undefined && '')) ? `${EndDate[2]}/` : '';
    emonth = (EndDate[1] != (null && undefined && '')) ? `${EndDate[1]}/` : '';
    eyear = (EndDate[0] != (null && undefined && '')) ? `${EndDate[0]}` : '';
    //status
    status = (data.status != (null && undefined && '')) ? `\n- ${lang[userLang].status}: *${lang[userLang].KitsuStuff[data.status]}*` : ''; //.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })
    averageScore = (data.averageScore != (null && undefined && '')) ? `\n- ${lang[userLang].score}: *${data.averageScore}*` : '';
    popularity = (data.popularity != (null && undefined && '')) ? `\n- ${lang[userLang].popularity}: *${data.popularity}*` : '';
    //rating ageRating ageRatingGuide
    ageRating = (data.ageRating != (null && undefined && '')) ? `\n- ${lang[userLang].rated}: *${data.ageRating}*` : '';
    ageRatingGuide = ((data.ageRating != (null && undefined && '')) && (data.ageRatingGuide != null)) ? ` - ${data.ageRatingGuide}` : '';
    //description
    // description = (data.synopsis != null) ? `\n\n ${data.synopsis}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodeCount}${episodeLength}${volumes}${chapters}${status}${averageScore}${popularity}${startDate}*${sday}${smonth}${syear}*${endDate}*${eday}${emonth}${eyear}*${ageRating}${ageRatingGuide}`;
}
module.exports = _;