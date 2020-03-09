'use strict';

let _ = {};

const Kitsu = require('kitsu');
const kitsuGet = new Kitsu();
const fetch = require('node-fetch');

const kitsu = require('../utils/main-kitsu-search');

let bot = require('../botSetup').bot;
let dataOnUser = require('../botSetup').dataOnUser;

const report = require("../utils/report");
const reply = require("../search/_reply");

// const utils = require("./utils");
// let getUser = require("./search/getUserName").verifyUser;
// const getPic = require("./search/getPic");

const characterSearch = require('../search/characterSearch')
const mangaSearch = require('../search/mangaSearch')
const animeSearch = require('../search/animeSearch')

const anilist = require('../search/anilist')
let lang = require('../langFiles/LANG');

let defaultSrc = 'anilist';

//need user lang
_.inline = (msg, type) => {
    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    // console.log(userLang, msg.from.first_name)
    let userSource = dataOnUser[userID]['src'];
    let startTime = new Date().valueOf()
    let query;
    // if (type == "inline") {
    query = msg.query;
    // } else if (type == "inchat") {query = msg.text.substr(msg.text.indexOf(' ') + 1);}
    let originalQuery = query;

    if (!query) {
        let a = bot.answerList(msg.id, { cacheTime: 0, personal: true, pmText: lang[userLang].howToSearch, pmParameter: 'help' });
        a.addArticle(
            JSON.parse((JSON.stringify(reply.defaultMessage[userLang])).replace(/%d/g, lang[userLang].anime).replace('%s', userSource == defaultSrc ? lang[userLang].anilist : lang[userLang].kitsu))
        )
        return bot.answerQuery(a);
    }
    if (query.includes("@") && !(/^@m ?|^@k ?|^@a ?|^@c ?|^@p ?/i.test(query))) {
        let a = bot.answerList(msg.id, { cacheTime: 0, personal: true, pmText: lang[userLang].howToSearch, pmParameter: 'help' });
        a.addArticle(
            reply.defaultAt[userLang]
        )
        return bot.answerQuery(a);
    }
    let sFor = (/^@m ?/i.test(query)) ? 'kitsuManga' : (/^@p ?/i.test(query)) ? 'kitsuCharacter' : (/^@a ?/i.test(query)) ? 'anilistAnimanga' : (/^@c ?/i.test(query)) ? 'anilistCharacter' : (/^@k ?/i.test(query)) ? 'kitsuAnime' : 'anime';

    let source
    switch (sFor) {
        case 'kitsuManga':
            source = "kitsu";
            break;
        case 'kitsuCharacter':
            source = "kitsu";
            break;
        case 'anilistAnimanga':
            source = "anilist";
            break;
        case 'anilistCharacter':
            source = "anilist";
            break;
        case 'kitsuAnime':
            source = "kitsu";
            break;
        default:
            source = defaultSrc;
    }
    if (query.length >= 2 && sFor != 'anime') {
        query = query.split(/^@m ?|^@k ?|^@a ?|^@c ?|^@p ?/i)[1]
    }
    //console.log('anilistAnimanga', (source == "anilist"))
    if ((/^@c ?|^@p ?/i.test(originalQuery)) && !query) {
        let a = bot.answerList(msg.id, { cacheTime: 0, personal: true, pmText: lang[userLang].howToSearch, pmParameter: 'help' });
        a.addArticle(
            JSON.parse((JSON.stringify(reply.defaultMessage[userLang])).replace(/%d/g, lang[userLang].character).replace('%s', source == "anilist" ? lang[userLang].anilist : lang[userLang].kitsu))
        )
        return bot.answerQuery(a);
    }
    if ((/^@m ?/i.test(originalQuery)) && !query) {
        let a = bot.answerList(msg.id, { cacheTime: 0, personal: true, pmText: lang[userLang].howToSearch, pmParameter: 'help' });
        a.addArticle(
            JSON.parse((JSON.stringify(reply.defaultMessage[userLang])).replace(/%d/g, lang[userLang].manga).replace('%s', source == "anilist" ? lang[userLang].anilist : lang[userLang].kitsu))
        )
        return bot.answerQuery(a);
    }
    if (type == "inline") {
        if (query.length >= 1) {
            let nextOffset
            switch (sFor) {
                case 'kitsuManga':
                    nextOffset = ((msg.offset !== '') ? parseInt(msg.offset) + 10 : 0)
                    return kitsu.searchManga(query, nextOffset).then(res => {
                        let count
                        if (res[1].errors) {
                            // console.log('hebrew search most likely')
                            count = -1;
                        } else {
                            count = res[1].meta.count
                        }
                        let Data = res[0];
                        dataTo_inline(Data, nextOffset, msg, sFor, startTime, count)
                    }).then(() => {
                        // let timeDiff = new Date().valueOf() - startTime;
                        // let msgText = `Inline query of ${sFor} took ${timeDiff}ms`;
                        // console.log(msgText)
                        // bot.sendMessage(process.env.USERS_CNL, msgText);
                    }).catch(handleError => console.log(`---\nmanga Fetch error: ${handleError}\n---`));
                case 'kitsuCharacter':
                    nextOffset = ((msg.offset !== '') ? parseInt(msg.offset) + 10 : 0)
                    return kitsu.findCharacter(query, nextOffset).then(res => {
                        let count
                        if (res[1].errors) {
                            count = -1;
                        } else {
                            count = res[1].meta.count
                        }
                        let Data = res[0];
                        dataTo_inline(Data, nextOffset, msg, sFor, startTime, count)
                    }).then(() => {
                        // let timeDiff = new Date().valueOf() - startTime;
                        // let msgText = `Inline query of ${sFor} took ${timeDiff}ms`;
                        // console.log(msgText)
                        // bot.sendMessage(process.env.USERS_CNL, msgText);
                    }).catch((handleError, p) => {
                        console.log(`---\ncharacter Fetch error: ${handleError} , ${p}\n---`);
                        console.log(handleError)
                    });
                case 'kitsuAnime':
                    kitsuAnime(msg, query, startTime, nextOffset, sFor)
                    break;
                case 'anilistAnimanga':
                    anilistAnimanga(msg, query, startTime, nextOffset, sFor)
                    break;
                case 'anilistCharacter':
                    nextOffset = ((msg.offset !== '') ? parseInt(msg.offset) + 1 : 1)
                    let anilistQuery = anilist.queryAniList(query, nextOffset, 'characters');
                    //console.log('query2', query)
                    fetch(anilistQuery.url, anilistQuery.options)
                        .then(handleResponse => {
                            // console.log(`---\nAniList fetch status: ${handleResponse.statusText}\n---`)
                            return handleResponse.json().then(function(json) {
                                return handleResponse.ok ? json : Promise.reject(json);
                            });
                        })
                        .then(handleData => {
                            const AniData = handleData.data.Page.characters;
                            console.log("total res", handleData.data.Page.pageInfo.total)
                            let count = handleData.data.Page.pageInfo.total;
                            if (!handleData.data.Page.pageInfo.hasNextPage) {
                                nextOffset = ""
                            }
                            dataTo_inline(AniData, nextOffset, msg, sFor, startTime, count)
                        }).catch(handleError => {
                            report.error(`anilistCharacter fetch error: ${(JSON.stringify(handleError) === undefined || null || false || {})?handleError:JSON.stringify(handleError)}`, handleError)
                                //report.error(`AniList fetch error: ${handleError}`,"")
                            console.log(`---\nanilistCharacter fetch error: ${JSON.stringify(handleError)}\n---`)
                            console.log(`---\nanilistCharacter fetch error: ${handleError}\n---`)
                        });
                    break;
                default:
                    if (userSource == 'anilist') {
                        return anilistAnimanga(msg, query, startTime, nextOffset, sFor)
                    } else if (userSource == 'kitsu') {
                        return kitsuAnime(msg, query, startTime, nextOffset, sFor)
                    } else {
                        return null
                    }
            }
        } else {
            let a = bot.answerList(msg.id, { cacheTime: 0, personal: true });
            a.addArticle(
                JSON.parse(JSON.stringify(reply.defaultMessage[userLang]).replace(/%d/g, lang[userLang].anime).replace('%s', (source == "anilist" || userSource == 'anilist') ? lang[userLang].anilist : lang[userLang].kitsu))
            )
            console.log("figure why this gets here");//maybe bcz only @ was input without k or a etc.
            return bot.answerQuery(a);
        }
    }
    if (type == "inchat") {
        if (msg.query.length >= 3) {
            dataTo_inchat(Data, msg, userLang)
        } else {}
    }
}

function kitsuAnime(msg, query, startTime, nextOffset, sFor) {
    nextOffset = ((msg.offset !== '') ? parseInt(msg.offset) + 10 : 0)
    return kitsu.searchAnime(query, nextOffset).then(res => { //nextOffset
        let count
        if (res[1].errors) {
            console.log('hebrew search most likely')
            count = -1;
        } else {
            count = res[1].meta.count
        }
        let Data = res[0];
        dataTo_inline(Data, nextOffset, msg, sFor, startTime, count) //msg=originalQuery and userlang
    }).then(() => {
        // let timeDiff = new Date().valueOf() - startTime;
        // let msgText = `Inline query of ${sFor} took ${timeDiff}ms`;

        //maybe need to add here a report not sure

        // bot.sendMessage(process.env.USERS_CNL, msgText);
    }).catch(handleError => console.log(`---\nanime Fetch error: ${handleError}\n---`));
}

function anilistAnimanga(msg, query, startTime, nextOffset, sFor) {
    nextOffset = ((msg.offset !== '') ? parseInt(msg.offset) + 1 : 1)
    let anilistQuery = anilist.queryAniList(query, nextOffset);
    fetch(anilistQuery.url, anilistQuery.options)
        .then(handleResponse => {
            return handleResponse.json().then(function(json) {
                return handleResponse.ok ? json : Promise.reject(json);
            });
        })
        .then(handleData => {
            const AniData = handleData.data.Page.media;
            // console.log(AniData)
            let count = handleData.data.Page.pageInfo.total;
            if (!handleData.data.Page.pageInfo.hasNextPage) {
                nextOffset = ""
            }
            dataTo_inline(AniData, nextOffset, msg, sFor, startTime, count)
        }).catch(handleError => {
            report.error(`AniList fetch error5: ${(JSON.stringify(handleError) === undefined || null || false || {})?handleError:JSON.stringify(handleError)}`, handleError)
            report.error(`AniList fetch error6: ${handleError}`)
            console.log(`---\nAniList fetch error: ${JSON.stringify(handleError)}\n---`)
            console.log(`---\nAniList fetch error: ${handleError}\n---`)
        });
}


//https://kitsu.io/api/edge/anime/6791
function dataTo_inline(Data, nextOffset, msg, sFor, startTime, count) {

    let userID = msg.from.id;
    let userLang = dataOnUser[userID]['lang'];
    let userSource = dataOnUser[userID]['src'];

    let results = {};
    if (count == -1) {
        results = bot.answerList(msg.id, { nextOffset: '', cacheTime: 100, personal: true, pmText: lang[userLang].howToError, pmParameter: 'help' });
        results.addArticle(
            reply.englishSearchOnly[userLang]
        )
    } else {
        switch (sFor) {
            case 'kitsuManga':
                results = mangaSearch(Data, nextOffset, msg, count);
                break;
            case 'kitsuCharacter':
                results = characterSearch(Data, nextOffset, msg, count);
                break;
            case 'kitsuAnime':
                results = animeSearch(Data, nextOffset, msg, count);
                // console.log(results.list)
                break;
            case 'anilistAnimanga':
                // console.log('anilist nextOffset', nextOffset)
                results = anilist.getResults(Data, nextOffset, msg, count);
                break;
            case 'anilistCharacter':
                results = anilist.getCharResults(Data, nextOffset, msg, count);
                break;
            default:
                if (userSource == 'anilist') {
                    results = anilist.getResults(Data, nextOffset, msg, count);
                } else if (userSource == 'kitsu') {
                    results = animeSearch(Data, nextOffset, msg, count);
                } else {
                    console.log('nothing');
                }
                break;
        }
    }
    //make it check pre message to see if same id, if so, add this to that message
    // let timeDiff = new Date().valueOf() - startTime;
    let resultsNumber = JSON.stringify(results.list.length);
    report.user(msg, "search", resultsNumber, startTime)

    if (JSON.stringify(results.list.length) == "0") {
        results = bot.answerList(msg.id, { nextOffset: '', cacheTime: 100, personal: true, pmText: lang[userLang].howToError, pmParameter: 'help' });
        if (nextOffset == 0) {
            results.addArticle(
                reply.errorMessage[userLang]
            )
        } else {
            // results.addArticle(
            //     reply.errorMessageNoMore
            // )
        }
    }
    // console.log(results)

    bot.answerQuery(results)
        .then(response => {
            //return console.log(`bot answered successfully: ${response}`)
        })
        .catch(err => {
            console.log('Error answering query: ', err);
            let errMsg = "Searcher error: ";
            //might be QUERY_ID_INVALID
            let knownErrors = [
                'Bad Request: QUERY_ID_INVALID',
                ''
            ]
            if (knownErrors.includes(err.description)) {
                errMsg = "Description";
                report.error(errMsg, err.description, false);
            } else {
                report.error(errMsg, JSON.stringify(err));
            }
        })
}


// https://kitsu.io/api/edge/anime/11351/relationships/genres
_.getGenres = (id, type) => {
    return kitsuGet.get(`${type}/${id}/genres`)
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

_.nextEp = (id, type) => {
    return kitsuGet.get(`${type}/${id}/`)
}
_.description = (id, type) => {
    return kitsuGet.get(`${type}/${id}/`)
}


// _.inchat = () => {

// }

module.exports = _;