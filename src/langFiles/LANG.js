'use strict';

// new: "",

let _ = {};

_.he = {
    startMsg: `שלום %s\nבוט זה מחפש אנימות במצב אינליין (לדוגמאות -> /help או בלחיצה על הכפתור "נסו עכשיו")\n` +
        `להגדרת שפה -> /settings\nלפידבאק (שיתוף דעתכם על הבוט, מה אפשר לשפר מה אפשר להוסיף או לתקן משהו שלא עובד כמו שצריך) -> /feedback`,
    cancel: 'בַטֵל ❌',
    cancelled: 'הפעולה האחרונה בוטלה', //maybe add diif answers to diff cancels like cancelled_idea (within this one)
    check_it_out: {
        none: "חיפוש במקור ברירת המחדל",
        anilist: "חיפוש אנימה ומנגה באניליסט",
        kitsu: "חיפוש אנימה בקיטסו",
        manga: "חיפוש מנגה בקיטסו",
        character: "חיפוש דמות בקיטסו",
        person: "חיפוש דמות באניליסט"
    },
    feedback: `יש לכם הצעה לשיפור, נתקלתם בתקלה או  אולי יש לכם חוות דעת כללית?\nבחרו באחת האפשרויות...`,
    see_keyboard_below: "הנה מקלדת",
    setLang: {
        language: 'בחרו את השפה המועדפת עליכם...',
        he: 'עברית 🇮🇱',
        en: 'אנגלית 🇺🇸'
    },
    settings: {
        settings: `רוצים לשנות הגדרות?\nאלו ההגדרות שניתנים לשינוי (להצעות ושיפור -> /feedback)` +
            `\n\n*הגדרות שפה* - אפשר לשנות את השפה שבה הבוט יתכתב והודעות שנשלחות דרך הבוט (בחיפוש במצב אינליין) ישלחו בהתאם.` +
            `\n\n*הגדרות תקציר* - רוצים לקבל תקציר מלא (שישלח לכאן) כשלוחצים על כפתור תקציר? תגדירו את זה עכשיו!` +
            `\n(כשלוחצים על כפתור ״תקציר״ הבוט שולח חלק מהתקציר בבועה... לפעמים אין מספיק מקום בבועה ויכול ליהיות מצב שחלק מהתקציר לא מופיע שם... לכן יש את האפשרות שהתקציר ישלח (בנוסף לבועה) לכאן...`,
        setDesc: 'הגדרות תקציר',
        setLang: 'הגדרות שפה',
        setSource: 'הגדרת מקור ברירת מחדל',
        setTachiLinkVisibility: 'הגדרות חיפוש בטאצ׳יומי'
    },
    setDesc: {
        desc: `כדי לקבל תקציר מלא שישלח כאן בפרטי, בחרו ב - ״כן״`,
        sendDesc: 'כן, בבקשה',
        dontSendDesc: 'לא תודה',
        descNotiYes: 'האם אתה רוצים לקבל התראה כל פעם שנשלחת תקציר, או לקבל אותה בשקט?',
        descNotiSilent: 'ללא התראה!',
        deskNotiNonSilent: 'אני רוצה התראה!',
        dontSendDesc_done: 'אוקיי, אני לא אשלח לכאן תקצירים.',
        SendDescSilent_done: 'אוקיי, אני אשלח לכאן תקצירים ללא התראה.',
        SendDescNonSilent_done: 'אוקיי, אני אשלח לכאן תקצירים (אם התראה).'
    },
    setTachiLinkVisibility: {
        desc: `אם יש לכם את האפליקציה של טאצ׳יומי (רק למשתמשי אנדרויד) והקישור (נסו אותי!) עובד לכם, אז תהנו מההגדרה הזאת... (אפשר למצוא את האפליקציה  [כאן](https://t.me/joinchat/DSbB3hfUwVZOcFeohQIgkA))\n\nההגדרה הזאת משפיעה רק על תוצאות מנגה...`,
        tryLink: 'נסו אותי!',
        showChannel: 'קישור לערוץ',
        showTachiLink: 'הקישור עובד לי',
        noShowTachiLink: 'לא עובד לי',
        showTachiLink_done: 'מצוין, הכפתור שישלח אותכם לחיפוש של טאצ׳יומי יופיע על כל תוצאות של מנגה.\nתבחרו לפתוח את הקישור זה תמיד דרך טאצ׳יומי כדי שהכפתור תמיד ישלח אותכם לטאצ׳יומי ולא בטעות לדפדפן הרגיל...',
        noShowTachiLink_done: 'אוקיי, מעכשיו הקישור לטאצ׳יומי לא יופיע בתוצאות שלך.\nלניסוי האפליקציה, תבדקו את הערוץ שמקושר למטה, יש שם את הקובץ הכי מעודכן לאפקליקציה של טאצ׳יומי שיעבוד אם הבוט הזה.'
    },
    feedbackOps: {
        issue: '⚠️ תקלה',
        idea: '💡 הצעה',
        g_feedback: 'חוות דעת 🗣'
    },
    feedbackAskInfo: {
        issue: `נא תארו את התקלה (אשמח לדעת גם את השלבים שנעשים לפני התקלה, כדי לדעת מאיפה היא הגיעה).
\nבמידה ואינכם חווים תקלות או שאתם חוזרים בכם מההחלטתה לדווח, נא שלחו /cancel`,
        idea: `אשמח אם תתארו את ההצעה שלכם לשיפור הבוט.
\nאם אינכם יכולים לחשוב על הצעה לשיפור הבוט כרגע, נא לחצו  /cancel`,
        g_feedback: `אשמח לקבל חוות דעת על הבוט, ההודעה הבאה שישלח, יועבר אלי ואוכל לקרוא אותה בהקדם.
\nבמידה ושיניתם את דעתכם, נא לחצו /cancel`
    },
    feedbackThanks: {
        issue: 'תודה על דיווח התקלה, אבדוק אותה בזמן הקרוב',
        idea: 'תודה על ההצעה, אבדוק איך ליישם אותה',
        g_feedback: 'תודה על חוות דעתך, אקרא את זה בזמן הקרוב'
    },
    found: 'נמצאו',
    results: 'תוצאות',
    choose_one_or_cancel: 'בבקשה בחרו באחת האפשרויות, או בטלו על ידי לחיצה על /cancel',
    not_start: "לא התחל",
    genres: "ז׳אנרים",
    description: "תקציר",
    desc_not_available: "לא נמצא תקציר",
    descLong: "התקציר ארוך מידי להופיע בבועה הזאת.\nהתקציר ישלח בצ׳אט הפרטי.",
    no_genres: "לא נמצאו ז׳אנרים",
    trailer: "טריילר",
    episodes: "מס׳ פרקים",
    minutes_per_episode: "דקות/לפרק",
    chapters: "צ'אפטרים",
    volumes: "כרכים",
    start_date: "תאריך התחלה",
    end_date: "תאריך סיום",
    nextRelease: "פרק הבא יצא בעוד",
    episode: 'פרק',
    airsOn: 'יצא בעוד',
    status: "סטטוס",
    anime: "אנימה",
    manga: 'מנגה',
    character: 'דמות',
    kitsuStuff: {
        'anime': 'Anime', //אנימה
        'TV': 'TV',
        'tv': 'TV',
        'movie': 'Movie', //סרט
        'special': 'Special', //ספיישל
        'OVA': 'OVA',
        'ONA': 'ONA',
        'music': 'Music', //רצועת מוזיקה
        'doujin': "Doujinshi", //דוג'ינשי
        'manga': 'Manga', //מנגה
        'novel': 'Novel', //לייט נובל
        'manhua': 'Manhua', //מאנואה
        'manhwa': 'Manhwa', //מאנאווה
        'characters': 'Character',
        'oel': 'OEL',
        'oneshot': 'One-Shot', //וואן-שוט
        'finished': 'סוים',
        'current': 'בשידור',
        'unreleased': 'לא שודר',
        'upcoming': 'צפוי לצאת',
        'tba': 'אושרה יציאה'
    },
    anilistStuff: {
        'TV': 'Anime',
        'TV_SHORT': 'TV Short',
        'MOVIE': 'Movie',
        'SPECIAL': 'Special',
        'OVA': 'OVA',
        'ONA': 'ONA',
        'MUSIC': 'Music',
        'MANGA': 'Manga',
        'NOVEL': 'Light Novel',
        'ONE_SHOT': 'One-shot',
        'doujin': 'Doujinshi',
        'manhwa': 'Manhwa',
        'manhua': 'Manhua',
        'FINISHED': 'סוים',
        'RELEASING': 'בשידור',
        'NOT_YET_RELEASED': 'עדיין לא יצא',
        'CANCELLED': 'בוטל',
        // 'finished_airing': 'סוים',
        // 'currently_airing': 'בשידור',
        // 'not_yet_aired': 'עדיין לא שודר',
        // 'finished_publishing': 'סוים',
        // 'publishing': 'יוצא',
        // 'not_yet_published': 'עדיין לא יצא',
        // 'cancelled': 'בוטל'
    },
    score: "ציון",
    popularity: "פופולריות",
    rated: "דירוג גילאים",
    hideKeyboard: 'הסתר מקלדת',
    months: {
        '1': 'לינואר',
        '01': 'לינואר',
        '2': 'לפבואר',
        '02': 'לפבואר',
        '3': 'למרץ',
        '03': 'למרץ',
        '4': 'לאפריל',
        '04': 'לאפריל',
        '5': 'למאי',
        '05': 'למאי',
        '6': 'ליוני',
        '06': 'ליוני',
        '7': 'ליולי',
        '07': 'ליולי',
        '8': 'לאוגוסט',
        '08': 'לאוגוסט',
        '9': 'לספטמבר',
        '09': 'לספטמבר',
        '10': 'לאוקטובר',
        '11': 'לנובמבר',
        '12': 'לדצמבר',
    },
    days: {
        '1': 'ראשון',
        '01': 'ראשון',
        '2': 'שני',
        '02': 'שני',
        '3': 'שלישי',
        '03': 'שלישי',
        '4': 'רביעי',
        '04': 'רביעי',
        '5': 'חמישי',
        '05': 'חמישי',
        '6': 'שישי',
        '06': 'שישי',
        '7': 'שביעי',
        '07': 'שביעי',
        '8': 'שמיני',
        '08': 'שמיני',
        '9': 'תשיעי',
        '09': 'תשיעי',
        '10': 'עשירי',
        '11': '11',
        '12': '12',
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
        '25': '25',
        '26': '26',
        '27': '27',
        '28': '28',
        '29': '29',
        '30': '30',
        '31': '31'
    },
    example: `דוגמאות:\n` +
        `חיפוש במקור ברירת המחדל\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. רשמו את שם האנימה שאותה אתם מחפשים.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot\`\n` +
        `ואחרי זה את שם האנימה לחיפוש...)\n` +
        `3. בחרו מתוך האופציות את האנימה הרצויה.\n` +
        `\n` +
        `חיפוש באנליסט (מנגה ואנימה) - 📝\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. הוסיפו @a לאחר מכן.\n` +
        `3. רשמו את מה שאתם מעוניינים לחפש באנליסט.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot @a\` - anilist\n` +
        `ואחרי זה את שם האנימה או מנגה לחיפוש באניליסט...)\n` +
        `4. בחרו מתוך האופציות \n` +
        `\n` +
        `חיפוש אנימה (בקיסטו) - 🦊\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. הוסיפו @k לאחר מכן.\n` +
        `3. רשמו את מה שאתם מעוניינים לחפש בקיטסו.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot @k\` - kitsu\n` +
        `ואחרי זה את שם האנימה או מנגה לחיפוש בקיטסו...)\n` +
        `4. בחרו מתוך האופציות \n` +
        `\n` +
        `חיפוש מנגה (בקיסטו) - 📚\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. הוסיפו @m לאחר מכן.\n` +
        `3. רשמו את שם המנגה שאותה אתם מחפשים.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot @m\` - manga\n` +
        `ואחרי זה את שם המנגה לחיפוש בקיטסו...)\n` +
        `4. בחרו מתוך האופציות את המנגה הרצויה.\n` +
        `\n` +
        `חיפוש דמויות 👱👱‍♀️ - בקיסטו - 🦊\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. הוסיפו @p לאחר מכן.\n` +
        `3. רשמו את שם הדמות שאותה אתם מחפשים.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot @p\` - person\n` +
        `ואחרי זה את שם הדמות לחיפוש בקיטסו...)\n` +
        `4. בחרו מתוך האופציות את הדמות הרצויה.\n` +
        `\n` +
        `חיפוש דמויות 👱👱‍♀️ - באניליסט - 📝\n` +
        `1. רשמו בתיבת ההודעה @AniFinderBot\n` +
        `2. הוסיפו @c לאחר מכן.\n` +
        `3. רשמו את שם הדמות שאותה אתם מחפשים.\n` +
        `(לדוגמא:\n` +
        `\`@AniFinderBot @c\` - character\n` +
        `ואחרי זה את שם הדמות לחיפוש באניליסט...)\n` +
        `4. בחרו מתוך האופציות את הדמות הרצויה.`,
    searchAgain: 'חיפוש נוסף',
    tachiLink: 'פתח בטאצ׳יומי',
    kitsu: 'קיטסו',
    anilist: 'אניליסט',
    setSource: 'בחרו מקור חדש לחיפוש אנימות. \n(תמיד אפשר להשתמש ב @a או @k כדי לחפש במקור אחר)',
    newSrcKitsu: 'קיטסו הוגדר כמקור ברירת מחדל',
    newSrcAnilist: 'אניליסט הוגדר כמקור ברירת מחדל',
    howToSearch: 'איך להשתמש בבוט?',
    howToError: 'איך לחפש?',
    findMoreCharacters: 'דמויות'
}
_.en = {
    startMsg: `Hello %s!\n` +
        `This bot searches for anime in inline mode (for examples -> /help or press the "Check me out Now" button below)\n` +
        `for setting -> /settings\n` +
        `and if you want to share your thoughts about the bot, please press /feedback`,
    cancel: '❌ Cancel',
    cancelled: 'Cancelled',
    check_it_out: {
        none: "Default Anime Search",
        anilist: "Anilist Anime & Manga Search",
        manga: "Kitsu Manga Search",
        kitsu: "Kitsu Anime Search",
        character: "Kitsu Character Search",
        person: "Anilist Character Search"
    },
    feedback: 'Do you have an idea, an issue or just general feedback to tell me about?',
    see_keyboard_below: "See keyboard below",
    setLang: {
        language: 'Choose a Language',
        he: '🇮🇱 Hebrew',
        en: '🇺🇸 English'
    },
    settings: {
        settings: 'Which settings do you want to change?',
        setDesc: 'Description settings',
        setLang: 'Language settings',
        setSource: 'Default Source Settings',
        setTachiLinkVisibility: 'Tachiyomi Link Settings'
    },
    setDesc: {
        desc: 'Do you want anime and manga descriptions sent here?',
        sendDesc: 'yes, please',
        dontSendDesc: 'no thanks, the popup is enough',
        descNotiYes: 'Do you want the descriptions sent with a notification?',
        descNotiSilent: 'silance is best',
        deskNotiNonSilent: 'yes, please',
        dontSendDesc_done: 'Ok, You wont get any descriptions sent here.',
        SendDescSilent_done: 'Ok, I\'ll send descriptions without a notification',
        SendDescNonSilent_done: 'Ok, I\'ll send descriptions with a notification'
    },
    setTachiLinkVisibility: {
        desc: `If you have Tachiyomi (Android Users Only) and the link below (Try me!) works with the Tachiyomi you have installed... then you can enjoy this setting... (the app can be found [here](https://t.me/joinchat/DSbB3hfUwVZOcFeohQIgkA))\n\nThis Setting only affects Manga results...`,
        tryLink: 'Try me!',
        showChannel: 'Open Channel',
        showTachiLink: 'Works for me',
        noShowTachiLink: 'Turn Setting Off',
        showTachiLink_done: 'Awesome, you\'ll get an extra button that would link to the Tachiyomi search.\nMake sure to select "Always Open with Tachiyomi", and then everytime you find a manga here, you can open it directly in the Tachiyomi search bar',
        noShowTachiLink_done: 'Ok, from now on, you won\'t get the button linking to Tachiyomi app.\nIf you want to try the app, check the channel linked below, it has the latest APK file for the app works with this setting.'
    },
    feedbackOps: {
        issue: '⚠️ Issues',
        idea: '💡 Ideas',
        g_feedback: '🗣 General Feedback'
    },
    feedbackAskInfo: {
        issue: `Please, describe the issues you're experiencing. \nIf you can't think of anything or change your mind, press /cancel`,
        idea: `Please, describe any ideas that come to your mind. \nIf you can't think of anything at the moment, press /cancel`,
        g_feedback: `You can write anything you want now and I'll be able to read it. \nIf you change your mind, press /cancel`
    },
    feedbackThanks: {
        issue: 'Thank you for reporting the issue, I\'ll make sure to look into it',
        idea: 'Thank you for your knowladge, I\'ll see what I can do with it',
        g_feedback: 'Thank you for your feedback, I\'ll make sure to read it when I can'
    },
    found: 'Found',
    results: 'Results',
    choose_one_or_cancel: 'Please choose an option, or press /cancel',
    not_start: "not start",
    genres: "Genres",
    description: 'Description',
    desc_not_available: "Description not Available",
    descLong: "Description is too long to show up in this box.\nit will be sent to the Private Chat.",
    no_genres: "no Genres found",
    trailer: "Trailer",
    episodes: "Episodes",
    minutes_per_episode: 'min/ep',
    chapters: "Chapters",
    volumes: "Volumes",
    start_date: "Start date",
    end_date: "End date",
    nextRelease: "Next Ep Airs in",
    episode: 'Episode',
    airsOn: 'Airs in',
    status: "Status",
    anime: 'an Anime',
    manga: 'manga',
    character: 'a Character',
    kitsuStuff: {
        'anime': 'Anime',
        'characters': 'Character',
        'TV': 'TV',
        'tv': 'TV',
        'movie': 'Movie',
        'special': 'Special',
        'OVA': 'OVA',
        'ONA': 'ONA',
        'music': 'Music',
        'doujin': 'Doujinshi',
        'manga': 'Manga',
        'novel': 'Light Novel',
        'manhua': 'Manhua',
        'manhwa': 'Manhwa',
        'characters': 'Character',
        'oel': 'OEL',
        'oneshot': 'One shot',
        'finished': 'Finished',
        'current': 'Currently Releasing',
        'unreleased': 'Unreleased',
        'upcoming': 'Upcoming',
        'tba': 'TBA'
    },
    anilistStuff: {
        'TV': 'Anime',
        'TV_SHORT': 'TV Short',
        'MOVIE': 'Movie',
        'SPECIAL': 'Special',
        'OVA': 'OVA',
        'ONA': 'ONA',
        'MUSIC': 'Music',
        'MANGA': 'Manga',
        'NOVEL': 'Light Novel',
        'ONE_SHOT': 'One-shot',
        'doujin': 'Doujinshi',
        'manhwa': 'Manhwa',
        'manhua': 'Manhua',
        'FINISHED': 'Finished',
        'RELEASING': 'Currently Releasing',
        'NOT_YET_RELEASED': 'Not yet Released',
        'CANCELLED': 'Cancelled',
        // 'finished airing': 'Finished Airing',
        // 'currently airing': 'Currently Airing',
        // 'not yet aired': 'Not yet aired',
        // 'finished publishing': 'Finished Publishing',
        // 'publishing': 'Publishing',
        // 'not yet published': 'Not yet published',
        // 'cancelled': 'Cancelled'
    },
    score: "Score",
    popularity: "Popularity",
    rated: "Rated",
    hideKeyboard: 'Hide Keyboard',
    months: {
        '1': 'January',
        '01': 'January',
        '2': 'February',
        '02': 'February',
        '3': 'March',
        '03': 'March',
        '4': 'April',
        '04': 'April',
        '5': 'May',
        '05': 'May',
        '6': 'June',
        '06': 'June',
        '7': 'July',
        '07': 'July',
        '8': 'August',
        '08': 'August',
        '9': 'September',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
    },
    days: {
        '1': '1',
        '01': '1',
        '2': '2',
        '02': '2',
        '3': '3',
        '03': '3',
        '4': '4',
        '04': '4',
        '5': '5',
        '05': '5',
        '6': '6',
        '06': '6',
        '7': '7',
        '07': '7',
        '8': '8',
        '08': '8',
        '9': '9',
        '09': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
        '21': '21',
        '22': '22',
        '23': '23',
        '24': '24',
        '25': '25',
        '26': '26',
        '27': '27',
        '28': '28',
        '29': '29',
        '30': '30',
        '31': '31'
    },
    example: `Examples:\n` +
        `Search Default Source\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Type a name of an anime you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot\`\n` +
        `Then the name of the anime you want to find...)\n` +
        `3. Choose one of the matching answers to send to your current chat.\n` +
        `\n` +
        `Search Anilist (anime & manga) - 📝\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Add @a after the bot's name\n` +
        `3. Type a name of an anime or manga you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot @a\` - anilist\n` +
        `Then the name of the anime or manga you want to find on Anilist ..)\n` +
        `4. Choose one of the matching answers to send to your current chat.\n` +
        `\n` +
        `Search Kitsu (anime) - 🦊\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Add @k after the bot's name\n` +
        `3. Type a name of an anime you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot @k\` - kitsu\n` +
        `Then the name of the anime you want to find...)\n` +
        `4. Choose one of the matching answers to send to your current chat.\n` +
        `\n` +
        `Search Kitsu (manga) - 📚\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Add @m after the bot's name\n` +
        `3. Type a name of the manga you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot @m\` - manga\n` +
        `Then the name of the manga you want to find...)\n` +
        `4. Choose one of the matching answers to send to your current chat.\n` +
        `\n` +
        `Search Characters - 👱👱‍ - Kitsu  - 🦊\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Add @p after the bot's name\n` +
        `3. Type a name of the character you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot @p\` - person\n` +
        `Then the name of the character you want to find...)\n` +
        `4. Choose one of the matching answers to send to your current chat.\n` +
        `\n` +
        `Search Characters - 👱👱‍ - Anilist - 📝\n` +
        `1. Type in any chat @AniFinderBot\n` +
        `2. Add @c after the bot's name\n` +
        `3. Type a name of the character you're looking for\n` +
        `(For example:\n` +
        `\`@AniFinderBot @c\` - character\n` +
        `Then the name of the character you want to find...)\n` +
        `4. Choose one of the matching answers to send to your current chat.`,
    searchAgain: 'Search Again',
    tachiLink: 'Open in Tachiyomi',
    kitsu: 'Kitsu',
    anilist: 'AniList',
    setSource: 'Choose the default source fot the bot to use.\n(you can always use @a or @k to temporarily use a different source)',
    newSrcKitsu: 'Kitsu set to default Source!',
    newSrcAnilist: 'Anilist set to default Source!',
    howToSearch: 'Click Here to Learn how to Search!',
    howToError: 'How To Search?',
    findMoreCharacters: 'Find Characters'
}
module.exports = _;