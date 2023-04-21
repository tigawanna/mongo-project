"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logWarning = exports.logSuccess = exports.logNormal = void 0;
const kleur_1 = __importDefault(require("kleur"));
function logNormal(message, data) {
    console.log(kleur_1.default.blue(`${message}`));
    data && console.log(data);
}
exports.logNormal = logNormal;
function logSuccess(message, data) {
    console.log(kleur_1.default.green(`Success: ${message}`));
    data && console.log(data);
}
exports.logSuccess = logSuccess;
function logWarning(message, data) {
    console.log(kleur_1.default.yellow(`Warning: ${message}`));
    data && console.log(data);
}
exports.logWarning = logWarning;
function logError(message, data) {
    console.log(kleur_1.default.red(`Error: ${message}`));
    data && console.log(data);
}
exports.logError = logError;
