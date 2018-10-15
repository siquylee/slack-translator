import { SlackController, SlackBot, SlackMessage } from 'botkit';
import App from '../app';
import { l } from '../utils';

export = function (controller: SlackController) {
    controller.hears(['(.)*'], 'direct_message,direct_mention', function (bot: any, message: any) {
        bot.whisper(message, {
            attachments: [getHelp(message, { user: `<@${message.user}>` })]
        }, function (err: any, res: any) {
            if (err) {
                App.instance.getLogger().error(err);
            }
        });
    });

    controller.on('bot_channel_join,bot_group_join', function (bot: any, message: any) {
        bot.reply(message, {
            attachments: [getHelp(message, { user: '<!everyone>' })]
        }, function (err: any, res: any) {
            if (err) {
                App.instance.getLogger().error(err);
            }
        });
    });

    controller.on('user_channel_join,user_group_join', function (bot: any, message: any) {
        bot.whisper(message, {
            attachments: [getHelp(message, { user: `<@${message.user}>` })]
        }, function (err: any, res: any) {
            if (err) {
                App.instance.getLogger().error(err);
            }
        });
    });
}

function getHelp(message: SlackMessage, params: any): string {
    let smb = require('slack-message-builder');
    let msg = smb()
        .attachment()
        .text(l('msg.Help', params));
    msg.button()
        .name("feedback")
        .text(l('msg.Feedback'))
        .type("button")
        .url(l('msg.Feedback.Url'))
        .style('default')
        .end();
    msg.button()
        .name("support")
        .text(l('msg.Support'))
        .type("button")
        .url(l('https://ko-fi.com/siquylee'))
        .style('primary')
        .end();
    msg.end();
    return msg.json();
}