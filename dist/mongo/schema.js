"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupedRepo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupedRepoSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    // type: {type: String,required: true},
    devDependencies: { type: Object },
    dependencies: { type: Object },
    pkg_type: { type: String, required: true },
    favdeps: { type: [String] }
}, { collection: 'grouped' });
exports.GroupedRepo = mongoose_1.default.model("grouped", GroupedRepoSchema);
