//require('dotenv').config()

const userList = {};
//const userExclude = [parseInt(process.env.DEV_TELEGRAM_ID)]
module.exports = {

    id: 'floodProtector',
    defaultConfig: {
        interval: 2,
        message: 'Too many messages, relax!'
    },

    plugin(bot, pluginConfig) {

        const interval = Number(pluginConfig.interval) || 2;
        const text = pluginConfig.message;

        bot.mod('message', (data) => {
            const msg = data.message;
            if (msg.chat.type == 'private') return data;
            const id = msg.from.id;
            const user = userList[id];
            const now = new Date(msg.date);
            if (user) {
                const diff = now - user.lastTime;
                user.lastTime = now;
                if (diff <= interval) {
                    if (!user.flood) {
                        if (text) bot.sendMessage(id, text);
                        user.flood = true;
                    }
                    data.message = {};
                } else {
                    user.flood = false;
                }
            } else {
                userList[id] = { lastTime: now };
            }
            return data;
        });
    }
};