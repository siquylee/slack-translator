import { SlackController } from 'botkit';
import App from '../app';

export = function (controller: SlackController) {
    const slashCmd = '/tl';
    const callbackId = 'google-translate';

    controller.on('slash_command', function (bot, message) {
        if ((message as any).command == slashCmd) {
            let res = parseCmd(`/tl ${message.text}`);
            if (res.length == 1) {
                // Show translate dialog
            }
            else {
                // Do translate text
            }
        }
    });

    controller.hears([`^/${slashCmd}`], 'direct_mention', function (bot, message) {
        // Do the translation in thread message
    });

    controller.on('message_action', function (bot, message) {
    });

    controller.on('dialog_submission', function (bot, message) {
        if ((message as any).callback_id == callbackId) {
            (bot as any).dialogOk();
            // TODO
        }
    });
}

function parseCmd(cmd: string): string[] {
    const pattern = /(\/tl)(\s+(af|sq|am|ar|hy|az|eu|be|bn|bs|bg|ca|ceb|ny|zh-cn|zh-tw|co|hr|cs|da|nl|en|eo|et|tl|fi|fr|fy|gl|ka|de|el|gu|ht|ha|haw|iw|hi|hmn|hu|is|ig|id|ga|it|ja|jw|kn|kk|km|ko|ku|ky|lo|la|lv|lt|lb|mk|mg|ms|ml|mt|mi|mr|mn|my|ne|no|ps|fa|pl|pt|ma|ro|ru|sm|gd|sr|st|sn|sd|si|sk|sl|so|es|su|sw|sv|tg|ta|te|th|tr|uk|ur|uz|vi|cy|xh|yi|yo|zu)\s+([^\n]+))?/gi;
    let res: string[] = [];
    let matches = pattern.exec(cmd.trim());

    if (matches) {
        if (matches[1]) {
            // /tl command
            res.push(matches[1])
            if (matches[3] && matches[4]) {
                // lang
                res.push(matches[3])
                // text
                res.push(matches[4])
            }
        }
    }
    
    return res;
}