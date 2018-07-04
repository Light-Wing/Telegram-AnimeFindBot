'use strict';

let _ = {};
let getUser = require("./search/getUserName").verifyUser;
const reply = require("./search/_reply");
const Kitsu = require('kitsu');
const kitsu = new Kitsu();
let report = require("./report");
let utils = require("./utils");
let getPic = require("./search/getPic");
var kitsu2 = require('node-kitsu');

_.inline = (type, msg, bot, userLang) => {
    let startTime = new Date().valueOf()
    let query, searchFor;
    if (type == "inline") {
        query = msg.query;

    } else if (type == "inchat") {
        query = msg.text.substr(msg.text.indexOf(' ') + 1);
    }
    if (query == null) {
        let a = bot.answerList(msg.id)
        a.addArticle(
            reply.defaultMessage
        )
        return bot.answerQuery(a);
    }

    if (query.length >= 2 && query.split(/^-m ?|^-c ?/)[1] != undefined) {
        let a = query.split(/^-m ?|^-c ?/)[0];
        switch (a) {
            case (a == ('-m')):
                searchFor = 'manga';
                break;
            case (a == ('-c')):
                searchFor = 'character';
                break;
        }
        query = query.split(/^-m ?|^-c ?/)[1]
        console.log(query)
    } else { searchFor = 'anime'; }
    // console.log(searchFor)
    if (type == "inline") {
        if (msg.query.length >= 2) {
            let nextOffset = ((msg.offset != '') ? parseInt(msg.offset) + 10 : 0)
            switch (searchFor) {
                case 'manga':
                    return kitsu2.searchManga(query, nextOffset).then(results => {
                        let Data = results;
                        console.log(results)
                        dataTo_inline(Data, nextOffset, bot, msg, userLang, startTime)
                    }).then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let msgText = `Inline query of ${searchFor} took ${timeDiff}ms`;
                        console.log(msgText)
                            // bot.sendMessage(process.env.USERS_CNL, msgText);
                    }).catch(handleError => console.log(`---\nFetch error: ${handleError}\n---`));
                case 'character':
                    return kitsu2.findCharacter(query, nextOffset).then(results => {
                        let Data = results;
                        console.log(results)
                        dataTo_inline(Data, nextOffset, bot, msg, userLang, startTime)
                    }).then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let msgText = `Inline query of ${searchFor} took ${timeDiff}ms`;
                        console.log(msgText)
                            // bot.sendMessage(process.env.USERS_CNL, msgText);
                    }).catch(handleError => console.log(`---\nFetch error: ${handleError}\n---`));
                default:
                    return kitsu2.searchAnime(query, nextOffset).then(results => {
                        let Data = results;
                        // console.log(results)
                        dataTo_inline(Data, nextOffset, bot, msg, userLang, startTime)
                    }).then(() => {
                        let timeDiff = new Date().valueOf() - startTime;
                        let msgText = `Inline query of anime (default) took ${timeDiff}ms`;
                        console.log(msgText)
                            // bot.sendMessage(process.env.USERS_CNL, msgText);
                    }).catch(handleError => console.log(`---\nFetch error: ${handleError}\n---`));
            }
            // kitsu.get(searchFor, {
            //     filter: {
            //         text: query
            //     }
            // }).then(response => {
            //     //console.log(response)
            //     // let Data = response.data;
            //     // dataTo_inline(Data, offset, bot, msg, userLang, startTime)
            // }).then(() => {
            //     let timeDiff = new Date().valueOf() - startTime;
            //     let msgText = 'Inline query took ' + timeDiff + 'ms';
            //     console.log(msgText)
            //         // bot.sendMessage(process.env.USERS_CNL, msgText);
            // }).catch(handleError => console.log(`---\nFetch error: ${handleError}\n---`));
        } else {
            let a = bot.answerList(msg.id)
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
}

//https://kitsu.io/api/edge/anime/6791
function dataTo_inline(Data, nextOffset, bot, msg, userLang, startTime) {
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 100, personal: false, });
    // results.addArticle(
    //     reply.loadedMore
    // )
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i].attributes;
        if (!data.canonicalTitle.includes('delete')) {
            let dateToMilisec = (data.nextRelease != null) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
            let replyMarkup = bot.inlineKeyboard([
                [bot.inlineButton(userLang.description, { callback: data.id + (data.type == 'anime' ? '-a' : '-m') + '-d' }), bot.inlineButton(userLang.genres, { callback: data.id + (data.type == 'anime' ? '-a' : '-m') + '-g' })],
                (data.nextRelease != null) ? [bot.inlineButton(userLang.nextRelease, { callback: (data.id + (data.type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : []
            ]);
            let thumb = getPic(data, 'thumb');

            var searchResault = {
                id: Data[i].id,
                title: `[${userLang.KitsuStuff[Data[i].type]}] ${data.canonicalTitle}`,
                description: `${(data.synopsis != (null && undefined && '')) ? JSON.stringify(data.synopsis) : userLang.desc_not_available}`, //.replace(/<(?:.|\n)*?>/gm, '')
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
    //make it check pre message to see if same id, if so, add this to that message
    let timeDiff = new Date().valueOf() - startTime;
    let time = timeDiff + 'ms'
    report.user(bot, msg, "search", results, time)

    if (JSON.stringify(results.list.length) == "0") {
        results = bot.answerList(msg.id, { nextOffset: '', cacheTime: 100, personal: false, });
        if (nextOffset == 0) {
            results.addArticle(
                reply.errorMessage
            )
        } else {
            results.addArticle(
                reply.errorMessageNoMore
            )
        }
    }

    bot.answerQuery(results)
        .then(response => {
            // return console.log(`bot answered successfully: ${response}`)
        })
        .catch(err => {
            console.log('Error answering query: ', JSON.stringify(err));
            let errMsg = "Searcher error: ";
            //might be QUERY_ID_INVALID
            let knownErrors = [
                'Bad Request: QUERY_ID_INVALID',
                ''
            ]
            if (knownErrors.includes(err.description)) {
                errMsg = "Description";
                report.error(bot, errMsg, err.description);
            } else {
                report.error(bot, errMsg, JSON.stringify(err));
            }
        })
}

function dataTo_inchat(Data, bot, msg) {

}
// https://kitsu.io/api/edge/anime/11351/relationships/genres
_.getGenres = (id, type) => {
    return kitsu.get(`${type}/${id}/genres`)
};

// kitsu2.searchManga('Monster Musume', 0).then(results => {
//     console.log(results[0])
// });
// kitsu2.listAnime(11467).then(results => {
//     console.log(results)
// });
// kitsu2.searchAnime('New Game!', 0).then(results => {
//     console.log(results[0])
// });
// kitsu2.findCharacter('armin').then(results => {
//     console.log(results)
// });

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

function messageSent(data, userLang, type, id) {
    let titleEN, titleJP, titleRJ, imageCover, ageRating, ageRatingGuide, episodeCount, StartDate, EndDate, episodeLength, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity, description, msgtext;
    //titles - romaji english native
    titleRJ = data.titles.en_jp != (null && undefined && '') ? `🇺🇸 [${data.titles.en_jp}](https://kitsu.io/${type}/${id})\n` : (data.canonicalTitle != (null || undefined) ? `🇺🇸 [${data.canonicalTitle}](https://kitsu.io/${data.type}/${data.id})\n` : '');
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


// _.inchat = () => {

// }

module.exports = _;