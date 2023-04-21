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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const helpers_2 = require("../../utils/helpers");
const queries_1 = require("../../mongo/queries");
// var clc = require("cli-color");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const all_repos  = await getViewerRepos(req.body?.viewer_token)
    try {
        // const aggr_repos = await getGroupedRepos()
        // const aggr_repos = await GroupedRepo.create({
        //  dependencies: {"nice":"nice"},
        //  devDependencies: {"nice":"nice"},
        //  favdeps:["nice"],
        //  name:"test",
        //  pkg_type:"test",
        //  type:"test",
        // })
        const aggr_repos = yield (0, queries_1.getGroupedRepos)();
        (0, helpers_2.logSuccess)("AGGR repos ", aggr_repos);
        res.json(aggr_repos);
    }
    catch (err) {
        (0, helpers_2.logError)("error fetching aggregated mongo records", err);
        res.status(400).send({ error: err });
    }
}));
router.get("/group", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const all_repos  = await getViewerRepos(req.body?.viewer_token)
    // logSuccess("github endpoint");
    res.json({ boobs: "YES" });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("requeets.body    === ",chalk.green(req.body))
    var _a, e_1, _b, _c;
    var _d, _e;
    try {
        if (!((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.viewer_token)) {
            res.status(400).send(new Error("viewer_token is required"));
            return;
        }
        const all_repos = yield (0, helpers_1.getViewerRepos)((_e = req.body) === null || _e === void 0 ? void 0 : _e.viewer_token);
        if (all_repos && "message" in all_repos) {
            (0, helpers_2.logError)("error loading  viewer repos  ==> ", all_repos);
            res.status(400).send(new Error(all_repos.message));
            return;
        }
        const reposPkgJson = [];
        if (all_repos && "data" in all_repos) {
            const reposList = all_repos.data.viewer.repositories.nodes;
            try {
                for (var _f = true, reposList_1 = __asyncValues(reposList), reposList_1_1; reposList_1_1 = yield reposList_1.next(), _a = reposList_1_1.done, !_a;) {
                    _c = reposList_1_1.value;
                    _f = false;
                    try {
                        const repo = _c;
                        const pkgjson = yield (0, helpers_1.getOneRepoPackageJson)(repo.nameWithOwner);
                        if (pkgjson) {
                            reposPkgJson.push(pkgjson);
                        }
                    }
                    finally {
                        _f = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = reposList_1.return)) yield _b.call(reposList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        (0, helpers_2.logNormal)("repo pkg jsns", reposPkgJson);
        res.json({ reposPkgJson });
    }
    catch (error) {
        (0, helpers_2.logError)("error loading  viewer repos in main catch block  ==> ", error);
        res.status(400).send({ error });
    }
    (0, helpers_2.logError)("viewer repos not found");
    res.status(400).send(new Error("viewer repositories not found"));
}));
exports.default = router;
// [
//   {
//     "$group": {
//       "_id": "$pkg_type",
//       "repo_names": { "$push": "$name" },
//       "top_favdeps": { "$push": "$favdeps" }
//     }
//   },
//   {
//     "$unwind": "$top_favdeps"
//   },
//   {
//     $sort: {
//       "top_favdeps": -1
//     }
//   },
//   {
//     "$unwind": "$top_favdeps"
//   },
//   {
//     "$group": {
//       "_id": "$_id",
//       "repo_names": { "$first": "$repo_names" },
//       "top_favdeps": { "$addToSet": "$top_favdeps" }
//     }
//   }
// ]
