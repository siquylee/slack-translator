import { SlackController, SlackBot, SlackMessage } from 'botkit';
import App from '../app';
import { l, langs } from '../utils';

const callbackTranslateForm = 'google-translate-form';
const slashCmd = '/tl';
const actionTranslate = 'action-translate';

export = function (controller: SlackController) {
    controller.on('slash_command', function (bot, message) {
        if ((message as any).command == slashCmd) {
            bot.replyAcknowledge();
            let args = parseCmd(`/tl ${message.text}`);
            if (args.to && args.text) {
                // Do the translation
                doTranslate(bot, message, args);
            }
            else {
                // Show translate dialog
                showDialog(bot, message, { id: callbackTranslateForm, to: App.instance.lang, text: '' });
            }
        }
    });

    controller.hears([`^/${slashCmd}`], 'direct_mention', function (bot, message) {
        // TODO - Do the translation in thread message
    });

    controller.on('message_action', function (bot, message) {
        let id: string = (message as any).callback_id;
        if (id == actionTranslate) {
            this.bot.replyAcknowledge();
            let text: string = (message as any).message.text!;
            showDialog(bot, message, { id: actionTranslate, to: App.instance.lang, text: text });
        }
    });

    controller.on('dialog_submission', function (bot, message) {
        let id: string = (message as any).callback_id;
        if (id == callbackTranslateForm || id == actionTranslate) {
            (bot as any).dialogOk();
            let args = (message as any).submission;
            args.role = 'translator';
            args.cmd = 'translate';
            if (!args.from)
                args.from = 'auto';
            App.instance.seneca.act(args, function (err: any, res: any) {
                if (err) {
                    App.instance.getLogger().error(err);
                    (bot as any).whisper(message, err);
                }
                else {
                    if (id == callbackTranslateForm)
                        bot.reply(message, res.text);
                    else
                        (bot as any).whisper(message, res.text);
                }
            });
            track('dialog', args.to, args.text);
        }
    });
}

function parseCmd(cmd: string): any {
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

function doTranslate(bot: SlackBot, message: SlackMessage, args: any): void {
    App.instance.seneca.act(args, function (err: any, res: any) {
        if (err) {
            App.instance.getLogger().error(err);
            showError(bot, message, err);
        }
        else {
            show(bot, message, res.text);
        }
    });
    track('slash', args.to, args.text);
}

function showDialog(bot: SlackBot, message: SlackMessage, opt: any): void {
    let dialog = (bot as any).createDialog(
        l('msg.formTranslate.Title'),
        opt.id,
        l('msg.formTranslate.Translate')
    );
    let toLangs = new Array();
    Object.keys(langs).forEach(k => toLangs.push({ label: langs[k], value: k }));
    let fromLangs = toLangs.slice();
    fromLangs.unshift({ label: l('msg.formTranslate.Auto'), value: 'auto' });
    dialog.addSelect(l('msg.formTranslate.From'), 'from', 'auto', fromLangs, { optional: true });
    dialog.addSelect(l('msg.formTranslate.To'), 'to', opt.to, toLangs, { placeholder: l('msg.formTranslate.ToHint') });
    dialog.addTextarea(l('msg.formTranslate.Text'), 'text', opt.text, { hint: l('msg.formTranslate.TextHint') });
    (bot as any).replyWithDialog(message, dialog.asObject(), function (err: any, res: any) {
        if (err)
            App.instance.getLogger().error(res);
    });
}

function show(bot: SlackBot, message: SlackMessage, text: string): void {
    bot.reply(message, text);
}

function showError(bot: SlackBot, message: SlackMessage, err: any): void {
    (bot as any).whisper(message, l('err.UnableToTranslate') + ` \`${err}\``)
}

function track(event: string, lang: string, text: string): void {
    App.instance.track('translate', {
        event: event,
        lang: lang,
        text: text
    });
}