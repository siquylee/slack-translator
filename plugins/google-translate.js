"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const google_translate_api_1 = __importDefault(require("google-translate-api"));
const app_1 = __importDefault(require("../app"));
module.exports = function (options) {
    const pluginName = 'google-translate';
    this.add({ role: 'translator', cmd: 'translate' }, function (args, done) {
        google_translate_api_1.default(args.text, { from: args.from, to: args.to })
            .then(res => {
            done(null, { text: res.text });
        })
            .catch(err => {
            app_1.default.Instance.getLogger().error(err);
            done(err, null);
        });
    });
    return pluginName;
};
