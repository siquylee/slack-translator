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
    }
    static get Instance() {
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
        log4js.configure(`${this.getRootPath()}/log4js.json`);
        this._seneca.use('./plugins/google-translate');
        // Test plugin
        this._seneca.act({ role: 'translator', cmd: 'translate', from: 'en', to: 'ja', text: 'Hello World' }, function (err, res) {
            if (err)
                console.log(err);
            console.log(res);
        });
        // Test logger
        this.getLogger().info('Up & running');
    }
    getLogger(name = 'default') {
        return log4js.getLogger(name);
    }
    getRootPath() {
        return __dirname;
    }
}
exports.default = App;
