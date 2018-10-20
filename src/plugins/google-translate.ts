import { ActCallback, Instance } from 'seneca';
import translate from 'google-translate-api';
import App from '../app';

export = function (options: any) {
    const pluginName = 'google-translate';

    (this as Instance).add({ role: 'translator', cmd: 'translate' }, function (args: any, done: ActCallback) {
        translate(args.text, { from: args.from, to: args.to })
            .then(res => {
                done(null, { text: res.text })
            })
            .catch(err => {
                App.instance.getLogger().error(err);
                done(err, null);
            });
    });

    return pluginName;
}