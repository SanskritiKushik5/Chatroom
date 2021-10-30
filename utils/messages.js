const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().utcOffset('+0530').format('LT')
    }
}

module.exports = formatMessage;