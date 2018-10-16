"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = __importStar(require("log4js"));
const seneca_1 = __importDefault(require("seneca"));
class App {
    constructor() {
        this.langFile = process.env.LOCALE_PATH;
        this.currentLang = 'en';
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    get controller() {
        return this._controller;
    }
    get storage() {
        return this._controller.storage;
    }
    get seneca() {
        return this._seneca;
    }
    init(controller) {
        this._controller = controller;
        this._seneca = seneca_1.default();
        this.setLocale(this.currentLang);
        log4js.configure(`${this.rootPath}/log4js.json`);
        this._seneca.use('./plugins/google-translate');
        this._seneca.use('./plugins/google-analytics');
    }
    getLogger(name = 'default') {
        return log4js.getLogger(name);
    }
    get rootPath() {
        return __dirname;
    }
    get lang() {
        return this.currentLang;
    }
    setLocale(lang) {
        var i18n_module = require('i18n-nodejs');
        this.currentLang = lang;
        this.i18n = new i18n_module(lang, this.langFile);
    }
    localize(msg, args) {
        return this.i18n.__(msg, args);
    }
    track(type, args) {
        let types = ['translate'];
        if (types.indexOf(type) >= 0) {
            if (type == 'translate' && process.env.GA_TRACK_ID) {
                args.role = 'analytics';
                args.cmd = 'track-translate';
                App.instance.seneca.act(args, (err, res) => {
                    if (err)
                        App.instance.getLogger().error(err);
                });
            }
        }
    }
}
exports.default = App;
