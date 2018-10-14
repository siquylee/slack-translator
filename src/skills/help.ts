import { SlackController, SlackBot, SlackMessage } from 'botkit';
import App from '../app';
import { l, langs } from '../utils';

export = function (controller: SlackController) {
    controller.hears(['(.)*'], 'direct_message,direct_mention', function (bot: any, message: any) {
        bot.whisper(message, {
            attachments: [getHelp(message)]
        }, function (err: any, res: any) {
            if (err) {
                App.instance.getLogger().error(err);
            }
        });
    });

    controller.on('bot_channel_join', function (bot, message) {
    });

    controller.on('user_channel_join,user_group_join', function (bot, message) {
    });
}

function getHelp(message: SlackMessage): string {
    let smb = require('slack-message-builder');
    let msg = smb()
        .attachment()
        .text(l('msg.Help', { user: message.user }));
    msg.button()
        .name("feedback")
        .text(l('msg.Feedback'))
        .type("button")
        .url(l('msg.Feedback.Url'))
        .style('primary')
        .end();
    msg.button()
        .name("support")
        .text(l('msg.Support'))
        .type("button")
        .url(l('https://ko-fi.com/siquylee'))
        .style('danger')
        .end();
    msg.end();
    return msg.json();
}