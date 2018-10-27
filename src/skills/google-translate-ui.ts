import { SlackController, SlackBot, SlackMessage } from 'botkit';
import App from '../app';
import { l, langs } from '../utils';

const slashTranslate = 'slash-translate';
const slashCmd = '/tl';
const actionTranslate = 'action-translate';

export = function (controller: SlackController) {
    controller.on('slash_command', function (bot, message) {
        if ((message as any).command == slashCmd) {
            let args = parseCmd(`/tl ${message.text}`);
            if (args.to && args.text) {
                // Do the translation
                doTranslate4Slash(bot, message, args);
            }
            else {
                // Show translate dialog                
                bot.replyAcknowledge();
                showDialog(bot, message, { id: slashTranslate, to: App.instance.lang, text: '' });
            }
        }
    });

    controller.on('message_action', function (bot, message) {
        let id: string = (message as any).callback_id;
        if (id == actionTranslate) {
            bot.replyAcknowledge();
            let text: string = (message as any).message.text!;
            showDialog(bot, message, { id: actionTranslate, to: App.instance.lang, text: text });
        }
    });

    controller.on('dialog_submission', function (bot, message) {
        let id: string = (message as any).callback_id;
        if (id == slashTranslate || id == actionTranslate) {
            let args = (message as any).submission;
            args.role = 'translator';
            args.cmd = 'translate';
            if (!args.from)
                args.from = 'auto';
            App.instance.seneca.act(args, function (err: any, res: any) {
                let result = err ? l('err.General') : res.text;
                bot.replyInteractive(message, result);
                (bot as any).dialogOk();
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

function doTranslate4Slash(bot: SlackBot, message: SlackMessage, args: any): void {
    App.instance.seneca.act(args, function (err: any, res: any) {
        if (err) {
            App.instance.getLogger().error(err);
            showError4Slash(bot, message, l('err.General'));
        }
        else {
            show4Slash(bot, message, res.text);
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

function show4Slash(bot: SlackBot, message: SlackMessage, text: string): void {
    bot.replyPublic(message, text);
}

function showError4Slash(bot: SlackBot, message: SlackMessage, err: string): void {
    (bot as any).replyPrivate(message, err)
}

function track(event: string, lang: string, text: string): void {
    App.instance.track('translate', {
        event: event,
        lang: lang,
        text: text
    });
}