'use strict';

let lang = require('../langFiles/LANG');
let utils = require("../utils/utils");
let anilistQuerys = require("./anilistQuerys");

let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;
const genreList = require("../langFiles/genres");

let _ = {};


_.getResults = (Data, nextOffset, msg, count) => {
    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    let originalQuery = msg.query;

    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 300, personal: true, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });

    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i]
        let dateToMilisec, nextEpNum, nextEpAir;
        if (data.nextAiringEpisode) {
            nextEpNum = (data.nextAiringEpisode.episode) ? data.nextAiringEpisode.episode : "";

            // nextEpAir = utils.msToTime(data.nextAiringEpisode.airingAt * 1000 - new Date().getTime(), userLang);
        }
        let plainQuery = /^@m ?|^@c ?|^@a ?|^@p ?|^@k ?/.test(originalQuery) ? originalQuery.split(/^@m ?|^@c ?|^@a ?|^@p ?|^@k ?/)[1] : originalQuery;
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].description, { callback: data.id + '-anilist' + '-d' }), bot.inlineButton(lang[userLang].findMoreCharacters, { inlineCurrent: "@c " + plainQuery })],
            (data.nextAiringEpisode) ? [bot.inlineButton(lang[userLang].nextRelease, { callback: data.id + '-anilist' + '-nxt-' + data.nextAiringEpisode.airingAt + '-' + nextEpNum })] : [],
            (data.format == ("MANGA" || "ONE_SHOT") && dataOnUser[userID]['tachi'] == 1 
            ? [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery.toString() }), 
            bot.inlineButton(lang[userLang].tachiLink, { url: `${utils.tachiyomiLink}${data.title.userPreferred}` })] 
            : [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery.toString() })])
        ]);

        let desc = data.description ? utils.md2tgmd(data.description).replace(/_/g, "") : lang[userLang].desc_not_available;
        if (desc == (null || undefined || '')) {
            desc = lang[userLang].desc_not_available;
        } else if (desc.length >= 100) {
            desc = desc.substring(0, 100);
            let last = desc.lastIndexOf(" ");
            desc = desc.substring(0, last);
            desc = desc + "...";
        }
        //console.log(data.format)
        var searchResault = {
            id: data.id,
            title: `[${lang[userLang].anilistStuff[data.format]}] ${data.title.userPreferred}`, //
            description: desc,
            url: data.siteUrl,
            hide_url: true,
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

_.getCharResults = (Data, nextOffset, msg, count) => {
    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    let originalQuery = msg.query;

    let results = bot.answerList(msg.id, { nextOffset: nextOffset, cacheTime: 300, personal: true, pmText: lang[userLang].found + ' ' + count + ' ' + lang[userLang].results, pmParameter: 'setting' });
    // console.log(Data.length)
    for (let i = 0, len = Data.length; i < len; i++) {
        let data = Data[i]
        let replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton(lang[userLang].searchAgain, { inlineCurrent: originalQuery })]
        ]);
        // console.log(data.id)
        let desc = data.description ? utils.md2tgmd(data.description).replace(/_(.+?)_/g, `$1`) : lang[userLang].desc_not_available;
        if (desc == (null || undefined || '')) {
            desc = lang[userLang].desc_not_available;
        } else if (desc.length >= 100) {
            desc = desc.substring(0, 100);
            let last = desc.lastIndexOf(" ");
            desc = desc.substring(0, last);
            desc = desc + "...";
        }
        let firstname = data.name.first ? data.name.first : '';
        let lastname = data.name.last ? ' ' + data.name.last : '';
        let thumb = data.image.medium || data.image.large;
        var searchResault = {
            id: data.id,
            title: `[Character] ${firstname}${lastname}`, //
            description: desc,
            url: data.siteUrl,
            hide_url: true,
            thumb_url: thumb,
            input_message_content: {
                message_text: _.charMessageSent(data, userLang).replace(/(`)/g, ''),
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            },
            reply_markup: replyMarkup
        }
        results.addArticle(searchResault);
    }
    return results;
}

_.queryAniList = (mainQuery, nextOffset, queryWhat) => {
    let query, variables;
    switch (queryWhat) {
        // case 'description':
        //     query = anilistQuerys.queryDescription;
        //     break;
        case 'characters':
            query = anilistQuerys.queryCharacter;
            break;
            // case 'airdate':
            //     query = anilistQuerys.queryNextAirDate;
            //     break;
        default:
            query = anilistQuerys.queryNormal;
    }
    variables = {
        search: mainQuery,
        page: nextOffset,
        perPage: 10,
    };
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

_.queryAnilistByID = (ID, queryWhat) => {
    let query, variables;
    switch (queryWhat) {
        case 'description':
            query = anilistQuerys.queryDescription;
            break
        case 'airdate':
            query = anilistQuerys.queryNextAirDate;
            break
        default:
            console.log("problem with queryAnilistByID")
    }
    variables = {
        id: ID
    };
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
    let type = aniData.type ? (aniData.type == "ANIME" ? "📺" : "📘") : '';
    let format;
    if (aniData.format) {
        if (userLang == 'he') {
            format = genreList[aniData.format][1]
        } else if (userLang == 'en') {
            format = genreList[aniData.format][0]
        }
    } else {
        format = "";
    }
    let adaptedFrom;
    if (aniData.source) { // != ('ORIGINAL' || 'OTHER'()
        if (userLang == 'he') {
            adaptedFrom = "מקור אדפטציה: " + genreList[aniData.source][1]
        } else if (userLang == 'en') {
            adaptedFrom = "Adapted from: " + genreList[aniData.source][0]
        }
    } else {
        adaptedFrom = "";
    }
    //let src = aniData.source ? `${aniData.source}` : ''; //check if ORIGINAL, if true, then dont write adapted from...

    let typeAndSrc = (format || adaptedFrom) ? '\n' + type + ' ' + format + ' ' + adaptedFrom : '';
    //  Adapted from
    let genres_sting = '';
    if (aniData.genres) {
        genres_sting += lang[userLang].genres + ': '
        for (let i = 0, len = aniData.genres.length; i < len; i++) {
            let genre
            if (userLang == 'he') {
                genre = genreList[aniData.genres[i]][1]
            } else if (userLang == 'en') {
                genre = genreList[aniData.genres[i]][0]
            }
            genres_sting += genre + (i != len - 1 ? ', ' : '');
        }
        genres = genres_sting
    } else {
        genres = ''
    }

    // genres = `${JSON.stringify(aniData.genres).replace(/","/g,', ').replace(/"/g,'')}`: '';
    //cover - banner
    //imageCover = aniData.coverImage.large  ? `[\u200B](${aniData.coverImage.large})` : '';
    imageCover = aniData.coverImage.large ? `[\u200B](${aniData.coverImage.large})` : (aniData.bannerImage ? `[\u200B](${aniData.bannerImage})` : '');
    //trailer
    trailer = (aniData.trailer) ? (`🎥 [${lang[userLang].trailer}](https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id})\n`) : '';
    //eps
    episodes = aniData.episodes ? `\n- ${lang[userLang].episodes}: *${aniData.episodes}*` : '';
    let episodeLength = (aniData.episodes && aniData.duration) ? ` (${aniData.duration} ${lang[userLang].minutes_per_episode})` : '';
    //let nextAiringEpisode = aniData.nextAiringEpisode ? `\n- ${lang[userLang].nextRelease}: *${utils.msToTime(((aniData.nextAiringEpisode.timeUntilAiring)*1000), userLang)}*` : '';
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

    // console.log(aniData.status)
    //status
    status = (aniData.status) ? `\n- ${lang[userLang].status}: *${lang[userLang].anilistStuff[aniData.status]}*` : '';
    averageScore = (aniData.averageScore) ? `\n- ${lang[userLang].score}: *${aniData.averageScore}*` : '';
    popularity = (aniData.popularity) ? `\n- ${lang[userLang].popularity}: *${aniData.popularity}*` : '';
    //description
    // description = (aniData.description) ? `\n\n ${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')}` : '';
    //message text - removed: ${description}
    // console.log(`${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${genres}${episodes}${episodeLength}${nextAiringEpisode}${volumes}${chapters}${status}${averageScore}${popularity}${sdate}${edate}`)

    return `${imageCover}${titleRJ}${titleJP}${titleEN}${typeAndSrc}${trailer}\n${genres}${episodes}${episodeLength}${volumes}${chapters}${status}${averageScore}${popularity}${sdate}${edate}`;
};

_.charMessageSent = (aniData, userLang) => {
    let imageCover = aniData.image ? `[\u200B](${aniData.image.large})` : ''; // || aniData.image.medium
    let firstname, lastname, nativename, alternative;
    firstname = aniData.name.first ? aniData.name.first : '';
    lastname = aniData.name.last ? ' ' + aniData.name.last : '';
    let bothnames = `[${firstname}${lastname}](${aniData.siteUrl})`
    nativename = aniData.name.native ? `\n${aniData.name.native}\n` : '';
    alternative = aniData.name.alternative.toString() ? "A.K.A: " + aniData.name.alternative.toString().replace(/,/g, ', ') : '';
    let description = (aniData.description) ? `\n\n${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').substring(0,3900)}` : '';
    return `${imageCover}${bothnames}${nativename}${alternative}${description}` //
}

_.getDescription = (aniData, userLang) => {
    let titleRJ, titleJP, titleEN, imageCover, trailer, description;
    //cover - banner
    imageCover = aniData.bannerImage ? `[\u200B](${aniData.bannerImage})` : (aniData.coverImage.large ? `[\u200B](${aniData.image.large})` : '');
    //titles - romaji english native
    titleRJ = aniData.title.romaji ? `🇺🇸 <a href="${aniData.siteUrl}">${aniData.title.romaji}</a>\n` : '';
    titleJP = aniData.title.native ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english ? `🇬🇧 ${aniData.title.english}\n` : '';
    //trailer
    trailer = (aniData.trailer) ? (`🎥 <a href="https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id}">Trailer</a>`) : '';
    // description = (aniData.description ) ? `\n\n${aniData.description}` : '';
    description = (aniData.description) ? `\n\n${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n').substring(0,3900)}` : '';
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${description}`
}

module.exports = _;