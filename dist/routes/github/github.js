"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const all_repos = yield (0, helpers_1.getViewerRepos)((_a = req.body) === null || _a === void 0 ? void 0 : _a.viewer_token);
    res.json({ all_repos });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    console.log("requeets.body    === ", req.body);
    const all_repos = yield (0, helpers_1.getViewerRepos)((_b = req.body) === null || _b === void 0 ? void 0 : _b.viewer_token);
    if (!((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.viewer_token)) {
        res.status(400).send(new Error("viewer_token is required"));
        return;
    }
    if (all_repos && "message" in all_repos) {
        console.log("error loading  viewer repos  ==> ", all_repos);
        res.status(400).send(new Error(all_repos.message));
    }
    res.json({ all_repos });
}));
exports.default = router;
