import { ActCallback, Instance } from 'seneca';
import Analytics from 'electron-google-analytics';
import App from '../app';

export = function (options: any) {
    const wordcount = require('wordcount');
    const pluginName = 'google-analytics';
    let analytics: any;

    (this as Instance).add({ init: pluginName }, function (args: any, done: ActCallback) {
        if (process.env.GA_TRACK_ID)
            analytics = new Analytics(process.env.GA_TRACK_ID);

        done(null);
    });

    (this as Instance).add({ role: 'analytics', cmd: 'track-translate' }, function (args: any, done: ActCallback) {
        if (analytics) {
            let count = wordcount(args.text);
            analytics.event('gooogle-translate', args.event, { evLabel: args.lang, evValue: count })
                .then((res: any) => {
                    App.instance.getLogger().info(`Translate ${count} words to '${args.lang}'`)
                }).catch((err: any) => {
                    App.instance.getLogger().error(err);
                });
            done(null);
        }
    });

    return pluginName;
}