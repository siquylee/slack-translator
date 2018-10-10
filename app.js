"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = __importStar(require("log4js"));
class App {
    constructor() {
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    get storage() {
        return this.controller.storage;
    }
    init(controller) {
        this.controller = controller;
        log4js.configure('./log4js.json');
    }
    getLogger(name) {
        return log4js.getLogger(name);
    }
    getRootPath() {
        return __dirname;
    }
}
exports.default = App;
