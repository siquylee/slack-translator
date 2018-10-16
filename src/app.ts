import { SlackController } from 'botkit';
import * as log4js from 'log4js';
import seneca, { Instance } from 'seneca';

export default class App {
    private static _instance: App;
    private _controller: SlackController;
    private _seneca: Instance;
    private i18n: any;
    private readonly langFile = process.env.LOCALE_PATH;
    private currentLang = 'en';

    private constructor() {
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public get controller() {
        return this._controller;
    }

    public get storage() {
        return this._controller.storage;
    }

    public get seneca() {
        return this._seneca;
    }

    public init(controller: SlackController): void {
        this._controller = controller;
        this._seneca = seneca();
        this.setLocale(this.currentLang);
        log4js.configure(`${this.rootPath}/log4js.json`);
        this._seneca.use('./plugins/google-translate');
        this._seneca.use('./plugins/google-analytics');
    }

    public getLogger(name = 'default'): log4js.Logger {
        return log4js.getLogger(name);
    }

    public get rootPath() {
        return __dirname;
    }

    public get lang() {
        return this.currentLang;
    }

    public setLocale(lang: string): void {
        var i18n_module = require('i18n-nodejs');
        this.currentLang = lang;
        this.i18n = new i18n_module(lang, this.langFile);
    }

    public localize(msg: string, args?: any): string {
        return this.i18n.__(msg, args);
    }

    public track(type: string, args: any): void {
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