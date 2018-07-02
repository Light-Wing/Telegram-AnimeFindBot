'use strict';

let _ = {};

_.queryAniList = msg => {
    let query, variables;
    if (msg.data != undefined) {
        query = `query($id: Int) {
                Media(id: $id) {
                    id
                    description
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
                    bannerImage
                    trailer {
                        id
                        site
                    }
                    siteUrl
                }
        }`;
        variables = {
            id: msg.data || msg.query,
        };
    } else {
        //if (!isNaN(msg.data)) 
        query = `query(
            $id: Int,
            $isAdult: Boolean = false,
            $search: String,
            $page: Int,
            $perPage: Int,
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
                        coverImage {
                            large
                            medium
                        }
                        bannerImage
                        format
                        type
                        status
                        episodes
                        duration
                        chapters
                        volumes
                        description
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
            search: msg.query,
            page: 1,
            perPage: 20,
        };
    }
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
_.getUsefulData = aniData => {
    let titleEN, titleJP, titleRJ, imageCover, genres, episodes, trailer, volumes, chapters, startDate, sday, smonth, syear, endDate, eday, emonth, eyear, status, averageScore, popularity, description, msgtext;
    //titles - romaji english native
    titleRJ = aniData.title.romaji != null ? `🇺🇸 [${aniData.title.romaji}](${aniData.siteUrl})\n` : '';
    titleJP = aniData.title.native != null ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english != null ? `🇬🇧 ${aniData.title.english}\n` : '';
    //genres
    genres = aniData.genres != '' ? `\n- Genres: ${JSON.stringify(aniData.genres).replace(/","/g,', ').replace(/"/g,'')}` : '';
    //cover - banner
    //imageCover = aniData.coverImage.large != null ? `[\u200B](${aniData.coverImage.large})` : '';
    imageCover = aniData.bannerImage != null ? `[\u200B](${aniData.bannerImage})` : (aniData.coverImage.large != null ? `[\u200B](${aniData.coverImage.large})` : '');
    //trailer
    trailer = (aniData.trailer != null) ? (`🎥 [Trailer](https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id})\n`) : '';
    //eps
    episodes = aniData.episodes != null ? `\n- Episodes: *${aniData.episodes}*` : '';
    //volumes
    volumes = aniData.volumes != null ? `\n- Volumes: *${aniData.volumes}*` : '';
    //chapters
    chapters = aniData.chapters != null ? `\n- Chapters: *${aniData.chapters}*` : '';
    //startDate
    startDate = (aniData.startDate.day != null || aniData.startDate.month != null || aniData.startDate.year != null) ? "\n- Start date: " : '';
    sday = (aniData.startDate != null && aniData.startDate.day != null) ? `${aniData.startDate.day}/` : '';
    smonth = (aniData.startDate != null && aniData.startDate.month != null) ? `${aniData.startDate.month}/` : '';
    syear = (aniData.startDate != null && aniData.startDate.year != null) ? `${aniData.startDate.year}` : '';
    //endDate
    endDate = (aniData.endDate.day != null || aniData.endDate.month != null || aniData.endDate.year != null) ? "\n- End date: " : '';
    eday = (aniData.endDate != null && aniData.endDate.day != null) ? `${aniData.endDate.day}/` : '';
    emonth = (aniData.endDate != null && aniData.endDate.month != null) ? `${aniData.endDate.month}/` : '';
    eyear = (aniData.endDate != null && aniData.endDate.year != null) ? `${aniData.endDate.year}` : '';
    //status
    status = (aniData.status != null) ? `\n- Status: *${aniData.status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })}*` : '';
    averageScore = (aniData.averageScore != null) ? `\n- Score: *${aniData.averageScore}*` : '';
    popularity = (aniData.popularity != null) ? `\n- Popularity: *${aniData.popularity}*` : '';
    //description
    description = (aniData.description != null) ? `\n\n ${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')}` : '';
    //message text - removed: ${description}
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${genres}${episodes}${volumes}${chapters}${status}${averageScore}${popularity}${startDate}*${sday}${smonth}${syear}*${endDate}*${eday}${emonth}${eyear}*`;
};
_.getDescription = aniData => {
    let titleRJ, titleJP, titleEN, imageCover, trailer, description;
    //cover - banner
    imageCover = aniData.bannerImage != null ? `<a href="${aniData.bannerImage}">\u200B</a>` : (aniData.coverImage.large != null ? `<a href="${aniData.coverImage.large}">\u200B</a>` : '');
    //titles - romaji english native
    titleRJ = aniData.title.romaji != null ? `🇺🇸 <a href="${aniData.siteUrl}">${aniData.title.romaji}</a>\n` : '';
    titleJP = aniData.title.native != null ? `🇯🇵 ${aniData.title.native}\n` : '';
    titleEN = aniData.title.english != null ? `🇬🇧 ${aniData.title.english}\n` : '';
    //trailer
    trailer = (aniData.trailer != null) ? (`🎥 <a href="https://${(aniData.trailer.site == "youtube") ? 'youtu.be' : 'dai.ly'}/${aniData.trailer.id}">Trailer</a>`) : '';
    // description = (aniData.description != null) ? `\n\n${aniData.description}` : '';
    description = (aniData.description != null) ? `\n\n${aniData.description.replace(/<br\s*[\/]?>/gi, "\n").replace(/\n{2,}/g, '\n\n')}` : '';
    return `${imageCover}${titleRJ}${titleJP}${titleEN}${trailer}${description}`
}

module.exports = _;