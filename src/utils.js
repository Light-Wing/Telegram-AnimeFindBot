'use strict';

let _ = {}

_.time = () => {
    // res = 2018-07-08T09:30:00+0900
    var time = new Date().valueOf();
    return time
}

_.msToTime = (duration) => {
    if (duration < 0) {
        return 0
    }
    let
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24),
        days = parseInt((duration / (1000 * 60 * 60 * 24))),
        d_h_space, h_m_space;

    d_h_space = ((days > 0) && ((hours > 0) || (minutes > 0))) ? " " : "";
    h_m_space = ((hours > 0) && (minutes > 0)) ? " " : "";
    minutes = (minutes > 0) ? minutes + "m" : "";
    hours = (hours > 0) ? hours + "h" : "";
    days = (days > 0) ? days + "d" : "";
    let mstime = days + d_h_space + hours + h_m_space + minutes;
    return mstime
}

module.exports = _;