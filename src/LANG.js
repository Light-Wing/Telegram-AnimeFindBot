'use strict';

// new: "",

let _ = {};

_.he = {
    startMsg: `שלום %s\nבוט זה מחפש אנימות במצב אינליין (לדוגמאות -> /example או בלחיצה על הכפתור "נסו עכשיו")\n` +
        `להגדרת שפה -> /settings\nלפידבאק (שיתוף דעתכם על הבוט, מה אפשר לשפר מה אפשר להוסיף או לתקן משהו שלא עובד כמו שצריך) -> /feedback`,
    cancel: 'בַטֵל ❌',
    cancelled: 'הפעולה האחרונה בוטלה', //maybe add diif answers to diff cancels like cancelled_idea (within this one)
    check_it_out: "נסו עכשיו",
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
    no_genres: "לא נמצאו ז׳אנרים",
    trailer: "Trailer",
    episodes: "מס׳ פרקים",
    minutes_per_episode: "דקות/לפרק",
    chapters: "צ'אפטרים",
    volumes: "כרכים",
    start_date: "תאריך התחלה",
    end_date: "תאריך סיום",
    nextRelease: "פרק הבא יצא בעוד",
    status: "סטטוס",
    kitsuStuff: {
        'anime': 'Anime', //אנימה
        'TV': 'TV',
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
        'oel': 'OEL',
        'oneshot': 'One-Shot', //וואן-שוט
        'finished': 'סוים',
        'current': 'בשידור',
        'unreleased': 'לא שודר',
        'upcoming': 'צפוי לצאת',
        'tba': 'אושרה יציאה'
    },
    score: "ציון",
    popularity: "פופולריות",
    rated: "דירוג גילאים",
    hideKeyboard: 'הסתר מקלדת',
    months: {
        '01': 'לינואר',
        '02': 'לפבואר',
        '03': 'למרץ',
        '04': 'לאפריל',
        '05': 'למאי',
        '06': 'ליוני',
        '07': 'ליולי',
        '08': 'לאוגוסט',
        '09': 'לספטמבר',
        '10': 'לאוקטובר',
        '11': 'לנובמבר',
        '12': 'לדצמבר',
    },
    days: {
        '01': 'ראשון',
        '02': 'שני',
        '03': 'שלישי',
        '04': 'רביעי',
        '05': 'חמישי',
        '06': 'שישי',
        '07': 'שביעי',
        '08': 'שמיני',
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
    example: 'עדיין לא הכנתי דוגמאות, אבל ברעיון אם כותבים -m או -c לפני החיפוש, זה מחפש מנגה או דמות'
}
_.en = {
    startMsg: `Hello %s!\n` +
        `This bot searches for anime in inline mode (for examples press /example or press the "Check me out Now" button below)\n` +
        `for setting press /settings\n` +
        `and if you want to share your thoughts about the bot, please press /feedback`,
    cancel: '❌ Cancel',
    cancelled: 'Cancelled',
    check_it_out: "Check it out Now",
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
    found: 'found',
    results: 'results',
    choose_one_or_cancel: 'Please choose an option, or press /cancel',
    not_start: "not start",
    genres: "Genres",
    description: 'Description',
    desc_not_available: "Description not Available",
    no_genres: "no Genres found",
    trailer: "Trailer",
    episodes: "Episodes",
    minutes_per_episode: 'min/ep',
    chapters: "Chapters",
    volumes: "Volumes",
    start_date: "Start date",
    end_date: "End date",
    nextRelease: "Next Ep Air Date",
    status: "Status",
    kitsuStuff: {
        'anime': 'Anime',
        'characters': 'Character',
        'TV': 'TV',
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
        'oel': 'OEL',
        'oneshot': 'One-shot',
        'finished': 'Finished',
        'current': 'Currently Airing',
        'unreleased': 'Unreleased',
        'upcoming': 'Upcoming',
        'tba': 'TBA'
    },
    score: "Score",
    popularity: "Popularity",
    rated: "Rated",
    hideKeyboard: 'Hide Keyboard',
    months: {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
    },
    days: {
        '01': '1',
        '02': '2',
        '03': '3',
        '04': '4',
        '05': '5',
        '06': '6',
        '07': '7',
        '08': '8',
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
    example: 'i havent made a proper example message yet, though the idea is that if you put -m or -c before the inline search, the bot will search for manga or characters....'
}
module.exports = _;