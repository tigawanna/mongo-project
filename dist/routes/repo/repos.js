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
const packages_1 = require("./user_pkgs/packages");
const handlers_1 = require("./handlers");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("repos page ");
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const all_repos = yield (0, packages_1.getViewerRepos)();
    res.json({ all_repos });
}));
router.post("/pkgs", handlers_1.fetchAllRepos, handlers_1.parseReposMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const pkgs = await req.pkgs_json_promises
    // res.send(pkgs);
}));
exports.default = router;
