'use strict';

module.exports = (data, what, pref) => {
    //what = thumb, full
    //pref = posterImage, coverImage
    let tinyPoster, tinyCover, mediumPoster, mediumCover, largePoster, largeCover, originalPoster, originalCover;
    if (data.posterImage != (null || undefined)) {
        tinyPoster = data.posterImage.tiny != null ? data.posterImage.tiny : null;
        mediumPoster = data.posterImage.medium != null ? data.posterImage.medium : null;
        largePoster = data.posterImage.large != null ? data.posterImage.large : null;
        originalPoster = data.posterImage.tiny != null ? data.posterImage.tiny : null;
    }
    if (data.coverImage != (null || undefined)) {
        tinyCover = data.coverImage.tiny != null ? data.coverImage.tiny : null;
        mediumCover = data.coverImage.medium != null ? data.coverImage.medium : null;
        largeCover = data.coverImage.large != null ? data.coverImage.large : null;
        originalCover = data.coverImage.original != null ? data.coverImage.original : null;
    }
    switch (what) {
        case 'thumb':
            // getPref(pref, 'tiny')
            let thumb = (tinyPoster != null) ? tinyPoster : (tinyCover != null ? tinyCover : (mediumPoster != null ? mediumPoster : (mediumCover != null ? mediumCover : (largePoster != null ? largePoster : (largeCover != null ? largeCover : (originalPoster != null ? originalPoster : (originalCover != null ? originalCover : "*")))))));
            return thumb;
        case 'full':
            let posterImage = largePoster != null ? largePoster : (originalPoster != null ? originalPoster : (mediumPoster != null ? mediumPoster : tinyPoster != null ? tinyPoster : null))
            let coverImage = largeCover != null ? largeCover : (originalCover != null ? originalCover : (mediumCover != null ? mediumCover : (tinyCover != null ? tinyCover : null)))
            let full = posterImage != null ? posterImage : coverImage;
            return full
        default:
            return null
    }
}