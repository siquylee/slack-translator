import { SlackController } from 'botkit';
import * as log4js from 'log4js';
import seneca, { Instance } from 'seneca';

export default class App {
    private static _instance: App;
    private _controller: SlackController;
    private _seneca: Instance;

    private constructor() {
    }

    public static get Instance() {
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
        log4js.configure(`${this.getRootPath()}/log4js.json`);
        this._seneca.use('./plugins/google-translate');
    }

    public getLogger(name = 'default'): log4js.Logger {
        return log4js.getLogger(name);
    }

    public getRootPath(): string {
        return __dirname;
    }
}