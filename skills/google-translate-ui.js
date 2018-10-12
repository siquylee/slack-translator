"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const app_1 = __importDefault(require("../app"));
const utils_1 = require("../utils");
const callbackTranslateForm = 'google-translate-form';
const slashCmd = '/tl';
function parseCmd(cmd) {
    const pattern = /(\/tl)(\s+(af|sq|am|ar|hy|az|eu|be|bn|bs|bg|ca|ceb|ny|zh-cn|zh-tw|co|hr|cs|da|nl|en|eo|et|tl|fi|fr|fy|gl|ka|de|el|gu|ht|ha|haw|iw|hi|hmn|hu|is|ig|id|ga|it|ja|jw|kn|kk|km|ko|ku|ky|lo|la|lv|lt|lb|mk|mg|ms|ml|mt|mi|mr|mn|my|ne|no|ps|fa|pl|pt|ma|ro|ru|sm|gd|sr|st|sn|sd|si|sk|sl|so|es|su|sw|sv|tg|ta|te|th|tr|uk|ur|uz|vi|cy|xh|yi|yo|zu)\s+([^\n]+))?/gi;
    let res = {
        role: 'translator',
        cmd: 'translate',
    };
    let matches = pattern.exec(cmd.trim());
    if (matches) {
        res['from'] = 'auto';
        if (matches[3])
            res['to'] = matches[3];
        if (matches[4])
            res['text'] = matches[4];
    }
    return res;
}
function doTranslate(bot, message, args) {
    app_1.default.instance.seneca.act(args, function (err, res) {
        if (err) {
            app_1.default.instance.getLogger().error(err);
            showError(bot, message, err);
        }
        else {
            show(bot, message, res.text);
        }
    });
}
function showDialog(bot, message, opt) {
    let dialog = bot.createDialog(utils_1.l('Translate Text'), callbackTranslateForm, utils_1.l('Translate'));
    let targets = new Array();
    Object.keys(utils_1.langs).forEach(k => targets.push({ label: utils_1.langs[k], value: k }));
    dialog.addSelect(utils_1.l('To Language'), 'to', opt.to, targets, { placeholder: utils_1.l('Select language') });
    dialog.addTextarea(utils_1.l('Text'), 'text', opt.text, { hint: utils_1.l('Enter text in any language to be translated') });
    bot.replyWithDialog(message, dialog.asObject(), function (err, res) {
        if (err)
            app_1.default.instance.getLogger().error(res);
    });
}
function show(bot, message, text) {
    bot.replyPublic(message, text);
}
function showError(bot, message, err) {
    bot.replyPrivate(message, utils_1.l('Could not translate text. The reason is ') + ` \`${err}\``);
}
module.exports = function (controller) {
    controller.on('slash_command', function (bot, message) {
        if (message.command == slashCmd) {
            let args = parseCmd(`/tl ${message.text}`);
            if (args.to && args.text) {
                // Do the translation
                doTranslate(bot, message, args);
            }
            else {
                // Show translate dialog
                showDialog(bot, message, { to: app_1.default.instance.lang, text: '' });
            }
        }
    });
    controller.hears([`^/${slashCmd}`], 'direct_mention', function (bot, message) {
        // Do the translation in thread message
    });
    controller.on('message_action', function (bot, message) {
    });
    controller.on('dialog_submission', function (bot, message) {
        this.bot.dialogOk();
        if (message.callback_id == callbackTranslateForm) {
            let args = message.submission;
            args.role = 'translator';
            args.cmd = 'translate';
            args.from = 'auto';
            app_1.default.instance.seneca.act(args, function (err, res) {
                if (err) {
                    app_1.default.instance.getLogger().error(err);
                    bot.whisper(message, err);
                }
                else {
                    bot.reply(message, res.text);
                }
            });
        }
    });
};
