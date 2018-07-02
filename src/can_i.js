'use strict';
let _ = {}

_ = (msg, type) => {
    if (msg.text.includes("אפשר")) {
        msg.reply.text("לאחר שקראת את כלל 7 אשר כתוב בחוקי הקבוצה, חפש את הסדרה בגוגל או בקבוצה.", { asReply: true });
    }
}
module.exports = _;