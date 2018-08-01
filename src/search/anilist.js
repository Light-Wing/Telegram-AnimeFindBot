'use strict';

let lang = require('../LANG');
let utils = require("../utils");

let _ = {};


_.getResults = (Data, nextOffset, bot, msg, userLang, count, originalQuery) => {
    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 0, personal: true, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });

    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i]
        if (data.nextAiringEpisode) {
            console.log(data.nextAiringEpisode)
            let timeDiff = data.nextAiringEpisode.airingAt - new Date().valueOf()
            let nextEpAir = utils.msToTime(data.nextAiringEpisode.airingAt, userLang);
            let nextEpAir2 = utils.msToTime(data.nextAiringEpisode.timeUntilAiring, userLang);
            console.log(nextEpAir, i)
            console.log(nextEpAir2, i)
        } else {
            console.log('no nextAiringEpisode', i)
        }

        let dateToMilisec = (data.nextRelease) ? new Date(data.nextRelease.replace(' ', 'T').replace(' ', '')).valueOf() : "";
        let replyMarkup = bot.inlineKeyboard([
            //[bot.inlineButton(lang[userLang].description, { callback: Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-d' })],
            //(data.nextRelease ) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: (Data[i].id + (Data[i].type == 'anime' ? '-a' : '-m') + '-nxt-' + dateToMilisec) })] : [],
            [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery })]
        ]);

        let desc = data.description ? data.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').replace(/\n{2,}/g, '\n\n') : lang[userLang].desc_not_available; //.replace(/<(?:.|\n)*?>/gm, '');
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
            id: data.id,
            title: `[${lang[userLang].anilistStuff[data.format]}] ${data.title.userPreferred}`, //
            description: desc,
            thumb_url: data.coverImage.medium,
            input_message_content: {
                message_text: _.messageSent(data, userLang).replace(/(`)/g, ''),
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            },
            reply_markup: replyMarkup
        }
        results.addArticle(searchResault);
    }
    return results;
}

_.queryAniList = (mainQuery, nextOffset) => {
    let query, variables;
    // if (msg.data != undefined) {
    //     query = `query($id: Int) {
    //             Media(id: $id) {
    //                 id
    //                 description
    //                 title {
    //                     romaji
    //                     english
    //                     native
    //                     userPreferred
    //                 }
    //                 coverImage {
    //                     large
    //                     medium
    //                 }
    //                 bannerImage
    //                 trailer {
    //                     id
    //                     site
    //                 }
    //                 siteUrl
    //             }
    //     }`;
    //     variables = {
    //         id: mainQuery,
    //     };
    // characters(
    //     id: Int,
    //     search: String,
    //     id_not: Int,
    //     id_in: [Int],
    //     id_not_in: [Int],
    //     sort: [CharacterSort]
    //     )
    // } else {
    //if (!isNaN(msg.data)) 
    //            $isAdult: Boolean = false,
    //                        isAdult: $isAdult,


    query = `query(
            $id: Int,
            $asHtml: Boolean = false,
            $search: String,
            $page: Int,
            $perPage: Int,
            $isAdult: Boolean = false,
            ) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media(
                        id: $id,
                        search: $search,
                        isAdult: $isAdult,
                    ) {
                        id
                        title {
                            romaji
                            english
                            native
                            userPreferred
                        }
                        coverImage {
                                large
                                medium
                            }
                            startDate {
                                year
                                month
                                day
                            }
                            endDate {
                                year
                                month
                                day
                            }
                        description(asHtml: $asHtml)
                        format
                        type
                        bannerImage
                        duration
                        status
                        episodes
                        duration
                        chapters
                        volumes
                        nextAiringEpisode {
                            id
                            airingAt
                            timeUntilAiring
                            episode
                            mediaId
                        }
                        averageScore
                        genres
                        popularity
                        synonyms
                        siteUrl
                        trailer {
                            id
                            site
                        }
                    }
                }
        }`;

    variables = {
        search: mainQuery,
        page: nextOffset,
        perPage: 10,
    };
    // }
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };
    return { url: url, options: options };
};
_.messageSent = (aniData, userLang) => {
    let titleEN, titleJP, titleRJ, imageCover, genres, episodes, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity, description, msgtext;
    //titles - romaji english native
    titleRJ = aniData.title.romaji ? `🇺🇸 [${aniData.title.romaji}](${aniData.siteUrl})\n` : '';
    titleJP = aniData.title.native ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english ? `🇬🇧 ${aniData.title.english}\n` : '';
    //genres
    genres = aniData.genres ? `\n- Genres: ${JSON.stringify(aniData.genres).replace(/","/g,', ').replace(/"/g,'')}` : '';
    //cover - banner
    //imageCover = aniData.coverImage.large  ? `[\u200B](${aniData.coverImage.large})` : '';
    imageCover = aniData.bannerImage ? `[\u200B](${aniData.bannerImage})` : (aniData.coverImage.large ? `[\u200B](${aniData.coverImage.large})` : '');
    //trailer
    trailer = (aniData.trailer) ? (`🎥 [${lang[userLang].trailer}](https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id})\n`) : '';
    //eps
    episodes = aniData.episodes ? `\n- ${lang[userLang].episodes}: *${aniData.episodes}*` : '';
    let episodeLength = (aniData.episodes && aniData.duration) ? ` (${aniData.duration} ${lang[userLang].minutes_per_episode})` : '';
    let nextAiringEpisode = aniData.nextAiringEpisode ? `\n- ${lang[userLang].nextRelease}: *${aniData.nextAiringEpisode}*` : '';
    //volumes
    volumes = aniData.volumes ? `\n- ${lang[userLang].volumes}: *${aniData.volumes}*` : '';
    //chapters
    chapters = aniData.chapters ? `\n- ${lang[userLang].chapters}: *${aniData.chapters}*` : '';
    //startDate
    startDate = (aniData.startDate.day || aniData.startDate.month || aniData.startDate.year) ? `${lang[userLang].start_date}` : '';
    sday = (aniData.startDate && aniData.startDate.day) ? `${lang[userLang].days[aniData.startDate.day]}` : '';
    smonth = (aniData.startDate && aniData.startDate.month) ? `${lang[userLang].months[aniData.startDate.month]}` : '';
    syear = (aniData.startDate && aniData.startDate.year) ? `${aniData.startDate.year}` : '';
    let sdate = startDate !== '' ? `\n- ${startDate}: *${userLang == 'en' ? (smonth + ' ' + sday + ', ' + syear) :  (sday + ' ' + smonth + ', ' + syear)}*` : '';

    //endDate
    endDate = (aniData.endDate.day || aniData.endDate.month || aniData.endDate.year) ? `${lang[userLang].end_date}` : '';
    eday = (aniData.endDate && aniData.endDate.day) ? `${lang[userLang].days[aniData.endDate.day]}` : '';
    emonth = (aniData.endDate && aniData.endDate.month) ? `${lang[userLang].months[aniData.endDate.month]}` : '';
    eyear = (aniData.endDate && aniData.endDate.year) ? `${aniData.endDate.year}` : '';
    let edate = endDate !== '' ? `\n- ${endDate}: *${userLang == 'en' ? (emonth + ' ' + eday + ', ' + eyear) :  (eday + ' ' + emonth + ', ' + eyear)}*` : '';

    //status
    status = (aniData.status) ? `\n- Status: *${aniData.status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })}*` : '';
    averageScore = (aniData.averageScore) ? `\n- Score: *${aniData.averageScore}*` : '';
    popularity = (aniData.popularity) ? `\n- Popularity: *${aniData.popularity}*` : '';
    //description
    description = (aniData.description) ? `\n\n ${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')}` : '';
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${genres}${episodes}${episodeLength}${nextAiringEpisode}${volumes}${chapters}${status}${averageScore}${popularity}${sdate}${edate}`;
};
_.getDescription = aniData => {
    let titleRJ, titleJP, titleEN, imageCover, trailer, description;
    //cover - banner
    imageCover = aniData.bannerImage ? `<a href="${aniData.bannerImage}">\u200B</a>` : (aniData.coverImage.large ? `<a href="${aniData.coverImage.large}">\u200B</a>` : '');
    //titles - romaji english native
    titleRJ = aniData.title.romaji ? `🇺🇸 <a href="${aniData.siteUrl}">${aniData.title.romaji}</a>\n` : '';
    titleJP = aniData.title.native ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english ? `🇬🇧 ${aniData.title.english}\n` : '';
    //trailer
    trailer = (aniData.trailer) ? (`🎥 <a href="https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id}">Trailer</a>`) : '';
    // description = (aniData.description ) ? `\n\n${aniData.description}` : '';
    description = (aniData.description) ? `\n\n${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')}` : '';
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${description}`
}

module.exports = _;