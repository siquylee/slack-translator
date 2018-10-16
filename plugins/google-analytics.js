"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const electron_google_analytics_1 = __importDefault(require("electron-google-analytics"));
const app_1 = __importDefault(require("../app"));
module.exports = function (options) {
    const wordcount = require('wordcount');
    const pluginName = 'google-analytics';
    let analytics;
    this.add({ init: pluginName }, function (args, done) {
        if (process.env.GA_TRACK_ID)
            analytics = new electron_google_analytics_1.default(process.env.GA_TRACK_ID);
        done(null);
    });
    this.add({ role: 'analytics', cmd: 'track-translate' }, function (args, done) {
        if (analytics) {
            let count = wordcount(args.text);
            analytics.event('gooogle-translate', args.event, { evLabel: args.lang, evValue: count })
                .then((res) => {
                app_1.default.instance.getLogger().info(`Translate ${count} words to '${args.lang}'`);
            }).catch((err) => {
                app_1.default.instance.getLogger().error(err);
            });
            done(null);
        }
    });
    return pluginName;
};
