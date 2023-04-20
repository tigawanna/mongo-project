"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const log = (msg) => {
    console.log(chalk_1.default.green(msg));
};
exports.log = log;
function logger(color, msg) {
    console.log(chalk_1.default[color](msg));
}
