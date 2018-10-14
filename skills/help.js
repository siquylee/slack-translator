"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const app_1 = __importDefault(require("../app"));
const utils_1 = require("../utils");
function getHelp(message) {
    let smb = require('slack-message-builder');
    let msg = smb()
        .attachment()
        .text(utils_1.l('msg.Help', { user: message.user }));
    msg.button()
        .name("feedback")
        .text(utils_1.l('msg.Feedback'))
        .type("button")
        .url(utils_1.l('msg.Feedback.Url'))
        .style('primary')
        .end();
    msg.button()
        .name("support")
        .text(utils_1.l('msg.Support'))
        .type("button")
        .url(utils_1.l('https://ko-fi.com/siquylee'))
        .style('danger')
        .end();
    msg.end();
    return msg.json();
}
module.exports = function (controller) {
    controller.hears(['(.)*'], 'direct_message,direct_mention', function (bot, message) {
        bot.whisper(message, {
            attachments: [getHelp(message)]
        }, function (err, res) {
            if (err) {
                app_1.default.instance.getLogger().error(err);
            }
        });
    });
    controller.on('bot_channel_join', function (bot, message) {
    });
    controller.on('user_channel_join,user_group_join', function (bot, message) {
    });
};
