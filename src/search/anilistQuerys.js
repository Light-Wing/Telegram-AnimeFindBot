'use strict';

let _ = {};
//https://anilist.co/graphiql?query=query%20(%0A%24id%3A%20Int%2C%0A%24search%3A%20String%20%3D%20%22one%20piece%22%2C%20%0A%24page%3A%20Int%2C%20%0A%24perPage%3A%20Int)%20%7B%0A%20%20%20%20Page(page%3A%20%24page%2C%20perPage%3A%20%24perPage)%20%7B%0A%20%20%20%20pageInfo%20%7B%0A%20%20%20%20total%0A%20%20%20%20currentPage%0A%20%20%20%20lastPage%0A%20%20%20%20hasNextPage%0A%20%20%20%20perPage%0A%20%20%20%20%7D%0A%20%20%20%20characters(id%3A%20%24id%2C%20search%3A%20%24search)%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%20%7B%0A%20%20%20%20%20%20%20%20first%0A%20%20%20%20%20%20%20%20last%0A%20%20%20%20%20%20%20%20native%0A%20%20%20%20%20%20%20%20alternative%0A%20%20%20%20%7D%0A%20%20%20%20image%20%7B%0A%20%20%20%20%20%20%20%20large%0A%20%20%20%20%20%20%20%20medium%0A%20%20%20%20%7D%0A%20%20%20%20description(asHtml%3A%20false)%0A%20%20%20%20siteUrl%0A%20%20%20%20media%20%7B%0A%20%20%20%20%20%20nodes%20%7B%0A%20%20%20%20%20%20%20%20title%20%7B%0A%20%20%20%20%20%20%20%20%20%20romaji%0A%20%20%20%20%20%20%20%20%20%20english%0A%20%20%20%20%20%20%20%20%20%20native%0A%20%20%20%20%20%20%20%20%20%20userPreferred%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%20%0A%20%20%20%20%7D%0A%0A%7D%0A%7D
_.queryDescription = `query (
$id: Int
) {
Media(id: $id) {
    id
    type
    title {
        romaji
        english
        native
        userPreferred
    }
    description(asHtml: false)
    trailer {
        id
        site
    }
    episodes
    chapters
    coverImage {
        large
        medium
    }
    source
    bannerImage
    siteUrl
    }
}`;

_.queryCharacter = `query (
$id: Int,
$search: String, 
$page: Int, 
$perPage: Int) {
Page(page: $page, perPage: $perPage) {
    pageInfo {
    total
    currentPage
    lastPage
    hasNextPage
    perPage
    }
characters(id: $id, search: $search) {
    id
    name {
        first
        last
        native
        alternative
    }
    image {
        large
        medium
    }
    description(asHtml: false)
    siteUrl
    }
}
}`;

_.queryNextAirDate = `query ($id: Int) {
Media(id: $id) {
    id
    nextAiringEpisode {
        id
        airingAt
        episode
    }
}`;

// _.queryRELEASING = `$status: MediaStatus = RELEASING,`;

_.queryByStatus = `query (
$id: Int, 
$isAdult: Boolean = false, 
$status: MediaStatus = NOT_YET_RELEASED,
$page: Int, 
$perPage: Int) {
    Page(page: $page, perPage: $perPage) {
    pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
    }
    media(id: $id, status: $status, isAdult: $isAdult) {
        id
        title {
            romaji
            english
            native
            userPreferred # best to show this probs
        }
        type # MANGA/ANIME
        format # tv/tv_short/movie/special/ova/ona/music/manga/novel/one_shot
        status # FINISHED/RELEASING/NOT_YET_RELEASED/CANCELLED
        description(asHtml: false)
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
        episodes
        duration
        chapters
        volumes
        trailer {
            id
            site
        }
        coverImage {
            large
            medium
        }
        bannerImage
        genres
        averageScore
        popularity
        siteUrl
        nextAiringEpisode {
            id
            airingAt
            timeUntilAiring
            episode
            mediaId
        }
    }
    }
}`;

_.queryNormal = `query (
$id: Int, 
$search: String, 
$isAdult: Boolean = false, 
$page: Int, 
$perPage: Int) {
    Page(page: $page, perPage: $perPage) {
    pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
    }
    media(id: $id, search: $search, isAdult: $isAdult) {
        id
        title {
        romaji
        english
        native
        userPreferred # best to show this probs
        }
        type # MANGA/ANIME
        format # tv/tv_short/movie/special/ova/ona/music/manga/novel/one_shot
        status # FINISHED/RELEASING/NOT_YET_RELEASED/CANCELLED
        description(asHtml: false)
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
        episodes
        duration
        chapters
        volumes
        trailer {
        id
        site
        }
        coverImage {
        large
        medium
        }
        bannerImage
        genres
        averageScore
        popularity
        siteUrl
        source
        nextAiringEpisode {
            id
            airingAt
            timeUntilAiring
            episode
            mediaId
        }
    }
    }
}`;




module.exports = _;