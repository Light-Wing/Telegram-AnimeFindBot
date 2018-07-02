'use strict';

let _ = {};
let getUser = require("./search/getUserName").verifyUser;
const reply = require("./search/_reply");
const Kitsu = require('kitsu');
const kitsu = new Kitsu();
let report = require("./report");

_.inline = (type, msg, bot, userLang) => {
    let query;
    if (type == "inline") {
        query = msg.query;
    }
    if (type == "inchat") {
        query = msg.text.substr(msg.text.indexOf(' ') + 1);
    }
    kitsu.get('anime', {
        filter: {
            text: query
        }
    }).then(response => {
        let Data = response.data;
        if (type == "inline") {
            if (msg.query.length >= 2) {
                dataTo_inline(Data, bot, msg, userLang)
            } else {
                var a = bot.answerList(msg.id)
                a.addArticle(
                    reply.defaultMessage
                )
                return bot.answerQuery(a);
            }
        }
        if (type == "inchat") {
            if (msg.query.length >= 3) {
                dataTo_inchat(Data, bot, msg, userLang)
            } else {}
        }
    }).catch(handleError => console.log(`---\nFetch error: ${handleError}\n---`));
}

//https://kitsu.io/api/edge/anime/6791
function dataTo_inline(Data, bot, msg, userLang) {
    let results = bot.answerList(msg.id, { nextOffset: Data.next, cacheTime: 10 });
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i];
        let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(userLang.description, { callback: data.id + (data.type == 'anime' ? '-a' : '-m') + '-d' }), bot.inlineButton(userLang.genres, { callback: data.id + (data.type == 'anime' ? '-a' : '-m') + '-g' })],
            (data.nextRelease != null) ? [bot.inlineButton(userLang.nextRelease, { callback: (data.id + (data.type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
        ]);
        var searchResault = {
            id: data.id,
            title: `[${userLang.KitsuStuff[data.type]}] ${data.canonicalTitle}`,
            description: `${data.synopsis != null ? JSON.stringify(data.synopsis) : userLang.desc_not_available}`, //.replace(/<(?:.|\n)*?>/gm, '')
            thumb_url: (data.posterImage.tiny != null ? data.posterImage.tiny : data.coverImage.tiny),
            input_message_content: {
                message_text: messageSent(data, userLang),
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            },
            reply_markup: replyMarkup
        }
        results.addArticle(searchResault);
    }
    //make it check pre message to see if same id, if so, add this to that message
    report.user(bot, msg, "search", results)

    if (JSON.stringify(results.list.length) == "0") {
        results.addArticle(
            reply.errorMessage
        )
    }

    bot.answerQuery(results)
        .then(response => {
            // return console.log(`bot answered successfully: ${response}`)
        })
        .catch(err => {
            console.log('Error answering query: ', JSON.stringify(err))
            let errMsg = "searcher error: "
            report.error(errMsg, JSON.stringify(err))
        })
}

function dataTo_inchat(Data, bot, msg) {

}
// https://kitsu.io/api/edge/anime/11351/relationships/genres
_.getGenres = (id, type) => {
    return kitsu.get(`${type}/${id}/genres`)
};
// const Genres = await getGenres(data.id, data.type).then(res => {
//     let genres_sting = '';
//     for (let i = 0, len = res.meta.count; i < len; i++) {
//         genres_sting += res.data[i].name + (i != len - 1 ? ', ' : '');
//     }
//     // console.log('genres_sting = ' + genres_sting)
//     return genres_sting
// });
// genres = (Genres != '') ? `\n- Genres: ${Genres.toString()}` : ''; // JSON.stringify(data.genres).replace(/","/g,', ').replace(/"/g,'')
_.nextEp = (id, type) => {
    return kitsu.get(`${type}/${id}/`)
}
_.description = (id, type) => {
    return kitsu.get(`${type}/${id}/`)
}

function messageSent(data, userLang) {
    let titleEN, titleJP, titleRJ, imageCover, ageRating, ageRatingGuide, episodeCount, StartDate, EndDate, episodeLength, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity, description, msgtext;
    //titles - romaji english native
    titleRJ = data.titles.en_jp != (null || undefined || '') ? `🇺🇸 [${data.titles.en_jp}](https://kitsu.io/${data.type}/${data.id})\n` : (data.canonicalTitle != (null || undefined) ? `🇺🇸 [${data.canonicalTitle}](https://kitsu.io/${data.type}/${data.id})\n` : '');
    titleJP = data.titles.ja_jp != (null || undefined || '') ? `🇯🇵 ${data.titles.ja_jp}\n` : '';
    titleEN = data.titles.en != (null || undefined || '') ? `🇬🇧 ${data.titles.en}\n` : '';
    //cover - banner
    //imageCover = data.coverImage.large != null ? `[\u200B](${data.coverImage.large})` : '';
    imageCover = data.coverImage != null ? `[\u200B](${data.coverImage.original})` : (data.posterImage.original != null ? `[\u200B](${data.posterImage.original})` : '');
    //trailer
    trailer = (data.youtubeVideoId != null) ? (`🎥 [${userLang.trailer}](https://youtu.be/${data.youtubeVideoId})\n`) : '';
    //eps 
    episodeCount = data.episodeCount != null ? `\n- ${userLang.episodes}: *${data.episodeCount}*` : '';
    episodeLength = (data.episodeLength != (null || undefined) && data.episodeCount != (null || undefined)) ? ` (${data.episodeLength} ${userLang.minutes_per_episode})` : '';
    //volumes 
    // these two dont work yet, need to get kitsu to search manga as well
    volumes = data.volumes != null ? `\n- ${userLang.volumes}: *${data.volumes}*` : '';
    //chapters
    // these two dont work yet, need to get kitsu to search manga as well
    chapters = data.chapters != null ? `\n- ${userLang.chapters}: *${data.chapters}*` : '';
    //startDate startDate nextRelease year-month-day
    StartDate = (data.startDate != null || undefined) ? data.startDate.split('-') : ''
    startDate = (data.startDate != null || undefined) ? `\n- ${userLang.start_date}: ` : '';
    sday = (StartDate[2] != (null || undefined)) ? `${StartDate[2]}/` : '';
    smonth = (StartDate[1] != (null || undefined)) ? `${StartDate[1]}/` : '';
    syear = (StartDate[0] != (null || undefined)) ? `${StartDate[0]}` : '';
    //endDate endDate
    EndDate = (data.endDate != null || undefined) ? data.endDate.split('-') : ''
    endDate = (data.endDate != null || undefined) ? `\n- ${userLang.end_date}: ` : '';
    eday = (EndDate[2] != (null || undefined)) ? `${EndDate[2]}/` : '';
    emonth = (EndDate[1] != (null || undefined)) ? `${EndDate[1]}/` : '';
    eyear = (EndDate[0] != (null || undefined)) ? `${EndDate[0]}` : '';
    //status
    status = (data.status != null) ? `\n- ${userLang.status}: *${userLang.KitsuStuff[data.status]}*` : ''; //.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })
    averageScore = (data.averageScore != null) ? `\n- ${userLang.score}: *${data.averageScore}*` : '';
    popularity = (data.popularity != null) ? `\n- ${userLang.popularity}: *${data.popularity}*` : '';
    //rating ageRating ageRatingGuide
    ageRating = (data.ageRating != null) ? `\n- ${userLang.rated}: *${data.ageRating}*` : '';
    ageRatingGuide = (data.ageRatingGuide != null) ? ` - ${data.ageRatingGuide}` : '';
    //description
    // description = (data.synopsis != null) ? `\n\n ${data.synopsis}` : ''; //.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${episodeCount}${episodeLength}${volumes}${chapters}${status}${averageScore}${popularity}${ageRating}${ageRatingGuide}${startDate}*${sday}${smonth}${syear}*${endDate}*${eday}${emonth}${eyear}*`;
}


// _.inchat = () => {

// }

module.exports = _;