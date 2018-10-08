'use strict';

// tg://user?id=${msg.from.id}


let _ = {};

_.verifyUser = (userToVerify, returnWhat) => {
    let username = (userToVerify.username != undefined) ? `@${userToVerify.username}` : undefined;
    let firstname = (userToVerify.first_name != undefined) ? userToVerify.first_name : undefined;
    let lastname = (userToVerify.last_name != undefined) ? userToVerify.last_name : undefined;
    let firstAndLastnames = (firstname != undefined && lastname != undefined) ? `${firstname} ${lastname}` : undefined;
    let sendBackBackup = (firstAndLastnames != undefined ? firstAndLastnames : (firstname != undefined ? firstname : (lastname != undefined ? lastname : (username != undefined ? username : 'User1'))));
    let sendBack = '';
    switch (returnWhat) {
        case "username":
            sendBack = (username != undefined) ? username : sendBackBackup;
            break;
        case "firstname":
            sendBack = (firstname != undefined) ? firstname : sendBackBackup;
            break;
        case "lastname":
            sendBack = (lastname != undefined) ? lastname : sendBackBackup;
            break;
        case "first&last":
            sendBack = (firstAndLastnames != undefined) ? firstAndLastnames : sendBackBackup;
            break;
        default:
            sendBack = "User";
    }
    return sendBack
}

module.exports = _;