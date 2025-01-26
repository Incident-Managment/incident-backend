// services/slack.service.js
const sendMessageAction = require("../actions/external/slack.external");

module.exports = {
    name: "slack",
    actions: {
        sendMessage: sendMessageAction.sendMessage
    },
};
