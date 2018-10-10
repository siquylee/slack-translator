import { SlackController } from 'botkit';
import * as log4js from 'log4js';

export default class App {
    private static _instance: App;
    private controller: SlackController;

    private constructor() {
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public get storage() {
        return this.controller.storage;
    }

    public init(controller: SlackController): void {
        this.controller = controller;
        log4js.configure('./log4js.json');
    }

    public getLogger(name?: string): log4js.Logger {
        return log4js.getLogger(name);
    }

    public getRootPath(): string {
        return __dirname;
    }
}