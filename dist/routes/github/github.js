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
const helpers_2 = require("../../utils/helpers");
const queries_1 = require("../../mongo/queries");
const mutations_1 = require("../../mongo/mutations");
// var clc = require("cli-color");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.send('PAT Bearer token  required for this action: ' + token);
        return;
    }
    try {
        const user = yield (0, helpers_1.getGithubViewer)(token);
        if (user.email !== "denniskinuthiaw@gmail.com") {
            (0, helpers_2.logError)("user is not him ==> ", user);
            res.send({ "user is not him ": user });
            return;
        }
        const aggr_repos = yield (0, queries_1.getGroupedRepos)();
        (0, helpers_2.logSuccess)("AGGR repos ", aggr_repos);
        res.json(aggr_repos);
    }
    catch (err) {
        (0, helpers_2.logError)("error fetching aggregated mongo records", err);
        res.status(400).send({ error: err });
    }
}));
// router.put("/group", async (req, res) => {
//   if (!req.body?.ownwer_repo_name){
//     res.status(400).send(new Error("repo_name is required"))
//     return
//   }
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) {
//     res.send('PAT required for this action: ' + token);
//     return
//   }
//   try {
//     const repo = req.body.owner_repo_name
//     const repo_pkg_json = await updateRepo(repo,token)
//     logSuccess("repo_pkg_json update",repo_pkg_json);
//     res.json(repo_pkg_json);
//   } catch (error) {
//     logError("error in the update_repo catch block  ==> ", error)
//   }
// });
router.post("/batch_create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.send('PAT Bearer token required for this action: ' + token);
            return;
        }
        const reposPkgJson = yield (0, helpers_1.computeAllPkgJsons)(token);
        const parsedRepos = reposPkgJson.filter((repo) => (repo && ("name" in repo) && repo.name && repo.pkg_type));
        const repo_insert_res = yield (0, mutations_1.batchCreateRepos)(parsedRepos);
        (0, helpers_2.logSuccess)("repo_insert_res gotten=== ", repo_insert_res);
        res.json({ repo_insert_res });
        return;
    }
    catch (error) {
        (0, helpers_2.logError)("error in the batch_create catch block  ==> ", error);
        res.status(400).send({ error });
    }
    // logError("viewer repos not found");
    // res.status(400).send(new Error("viewer repositories not found"))
}));
router.put("/batch_update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.send('PAT Bearer token required for this action: ' + token);
            return;
        }
        const reposPkgJson = yield (0, helpers_1.computeAllPkgJsons)(token);
        const parsedRepos = reposPkgJson.filter((repo) => (repo && ("name" in repo) && repo.name && repo.pkg_type));
        const repo_insert_res = yield (0, mutations_1.batchUpdateRepos)(parsedRepos);
        res.json({ "batch repo update ": repo_insert_res });
    }
    catch (error) {
        (0, helpers_2.logError)("error in the batch_update catch block  ==> ", error);
        res.status(400).send({ error });
    }
    (0, helpers_2.logError)("viewer repos not found");
    res.status(400).send(new Error("viewer repositories not found"));
}));
exports.default = router;
