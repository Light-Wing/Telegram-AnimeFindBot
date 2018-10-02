'use strict';

let getPic = require('./getPic')
let lang = require('../LANG');
const ageRateGuideList = require("../langFiles/ageRatingGuide");


let _ = {}

_ = (Data, nextOffset, bot, msg, userLang, count, originalQuery) => {
        let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 300, personal: true, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });
        // results.addArticle(
        //     reply.loadedMore
        // )

        for (let i = 0, len = Data.length; i < len; i++) {
            let data = Data[i].attributes
            data = JSON.parse(JSON.stringify(data).replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').replace(/\*/g, "＊").replace(/(`)/g, ''))

            // console.log(data)
            if (!data.canonicalTitle.includes('delete')) { // && data.ageRatingGuide != "Mild Nudity"
                // console.log('dataid', Data[i].id)

                let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
                let replyMarkup = bot.inlineKeyboard([
                    [bot.inlineButton(lang[userLang].description, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-d' }), bot.inlineButton(lang[userLang].genres, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-g' })],
                    (data.nextRelease != null) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : [],
                    [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery })]
                ]);
                let thumb = getPic(data, 'thumb');
                let desc = data.synopsis != (null && undefined) ? data.synopsis : lang[userLang].desc_not_available; //.replace(/<(?:.|\n)*?>/gm, '');
                // let desc = 'hello' //data.synopsis.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n');
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
                    title: `[${lang[userLang].kitsuStuff[data.subtype]}] ${data.canonicalTitle}`, //
                    description: desc,
                    url: Data[i].links.self.replace("api/edge/", ""),
                    hide_url: true,
                    thumb_url: thumb,
                    input_message_content: {
                        message_text: _.messageSent(data, userLang, Data[i].type, Data[i].id).replace(/(`)/g, ''),
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
    //anime:

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

//manga:

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

_.messageSent = (data, userLang, type, id) => {
    let titleEN, titleJP, titleRJ, imageCover, ageRating, ageRatingGuide, episodeCount, StartDate, EndDate, episodeLength, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity;
    //titles - romaji english native
    titleRJ = data.titles.en_jp ? `🇺🇸 [${data.titles.en_jp}](https://kitsu.io/${type}/${id})\n` : (data.canonicalTitle ? `🇺🇸 [${data.canonicalTitle}](https://kitsu.io/${type}/${id})\n` : '');
    titleJP = data.titles.ja_jp ? `🇯🇵 ${data.titles.ja_jp}\n` : '';
    titleEN = data.titles.en ? `🇬🇧 ${data.titles.en}\n` : '';
    //cover - banner
    //imageCover = data.coverImage.large != null ? `[\u200B](${data.coverImage.large})` : '';
    let pic = getPic(data, 'full')
    imageCover = pic != null ? `[\u200B](${pic})` : null;
    //trailer
    trailer = data.youtubeVideoId ? (`🎥 [${lang[userLang].trailer}](https://youtu.be/${data.youtubeVideoId})\n`) : '';
    //eps 
    episodeCount = data.episodeCount ? `\n- ${lang[userLang].episodes}: *${data.episodeCount}*` : '';
    episodeLength = (data.episodeLength && data.episodeCount) ? ` (${data.episodeLength} ${lang[userLang].minutes_per_episode})` : '';
    //volumes 
    volumes = data.volumeCount ? `\n- ${lang[userLang].volumes}: *${data.volumeCount}*` : '';
    // console.log('vols ', data.volumeCount)
    //chapters
    chapters = data.chapterCount ? `\n- ${lang[userLang].chapters}: *${data.chapterCount}*` : '';
    //startDate startDate nextRelease year-month-day
    StartDate = data.startDate ? data.startDate.split('-') : ''
    startDate = data.startDate ? `${lang[userLang].start_date}` : '';
    sday = StartDate[2] ? `${lang[userLang].days[StartDate[2]]}` : '';
    smonth = StartDate[1] ? `${lang[userLang].months[StartDate[1]]}` : '';
    syear = StartDate[0] ? `${StartDate[0]}` : '';
    let sdate = StartDate !== '' ? `\n- ${startDate}: *${userLang == 'en' ? (smonth + ' ' + sday + ', ' + syear) :  (sday + ' ' + smonth + ', ' + syear)}*` : '';
    //endDate endDate
    EndDate = data.endDate ? data.endDate.split('-') : '';
    // console.log(EndDate, StartDate)
    endDate = data.endDate ? `${lang[userLang].end_date}` : '';
    eday = EndDate[2] ? `${lang[userLang].days[EndDate[2]]}` : '';
    emonth = EndDate[1] ? `${lang[userLang].months[EndDate[1]]}` : '';
    eyear = EndDate[0] ? `${EndDate[0]}` : '';
    let edate = EndDate !== '' ? `\n- ${endDate}: *${userLang == 'en' ? (emonth + ' ' + eday + ', ' + eyear) :  (eday + ' ' + emonth + ', ' + eyear)}*` : '';
    //en month day year
    //status
    status = data.status ? `\n- ${lang[userLang].status}: *${lang[userLang].kitsuStuff[data.status]}*` : ''; //.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })
    averageScore = data.averageScore ? `\n- ${lang[userLang].score}: *${data.averageScore}*` : '';
    popularity = data.popularity ? `\n- ${lang[userLang].popularity}: *${data.popularity}*` : '';
    //rating ageRating ageRatingGuide
    ageRating = data.ageRating ? `\n- ${lang[userLang].rated}: *${data.ageRating}*` : '';
    if (data.ageRating) { //ageRating
        if (userLang === 'he') {
            if (data.ageRatingGuide) {
                ageRatingGuide = ageRateGuideList[data.ageRatingGuide.toLowerCase()] ? ` - ${ageRateGuideList[data.ageRatingGuide.toLowerCase()][1]}` : ` - ${data.ageRatingGuide}`;
            } else {
                ageRatingGuide = '';
            }
        } else if (userLang === 'en') {
            if (data.ageRatingGuide) {
                ageRatingGuide = ageRateGuideList[data.ageRatingGuide.toLowerCase()] ? ` - ${ageRateGuideList[data.ageRatingGuide.toLowerCase()][0]}` : ` - ${data.ageRatingGuide}`;
            } else {
                ageRatingGuide = '';
            }
        }
    } else {
        ageRatingGuide = '';
    }
    // console.log('logging2 ', ageRatingGuide + '\n'); //
    //description
    // description = (data.synopsis != null) ? `\n\n ${data.synopsis}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodeCount}${episodeLength}${status}${volumes}${chapters}${averageScore}${popularity}${sdate}${edate}${ageRating}${ageRatingGuide}`;
}
module.exports = _;