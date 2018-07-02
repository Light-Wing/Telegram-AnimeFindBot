'use strict';
let _ = {}
const wordsToInclude = [
    'אפשר את האנימה',
    'אפשר בבקשה את',
    'אפשר קישור ל'
]
_ = (msg, type) => {
    if (wordsToInclude.includes(msg.text)) {
        msg.reply.text("לאחר שקראת את כלל 7 אשר כתוב בחוקי הקבוצה, חפש את הסדרה בגוגל או בקבוצה.", { asReply: true });
    }
}
module.exports = _;