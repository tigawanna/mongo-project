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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReoosPackageJson = exports.getViewerRepos = void 0;
const helpers_1 = require("./helpers");
// get all viewer repositories using graphql API
function getViewerRepos() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    query($first: Int!) {
    viewer {
    repositories(first:$first,isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        id
        name
        nameWithOwner
      }
    }
  }
}
`;
        try {
            const response = yield fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    "Authorization": `bearer ${process.env.GH_PAT}`,
                    "Content-Type": "application/json",
                    "accept": "application/vnd.github.hawkgirl-preview+json"
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        first: 50
                    },
                    // operationName,
                }),
            });
            const data = yield response.json();
            // console.log("#step 1 : all user repositories ===== ", data)
            return data;
        }
        catch (err) {
            console.log("error fetching viewer repos  ==> ", err);
            return err;
        }
    });
}
exports.getViewerRepos = getViewerRepos;
function getAllReoosPackageJson() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const repos = yield getViewerRepos();
        const reposPkgJson = [];
        if ("viewer" in repos.data) {
            const reposList = repos.data.viewer.repositories.nodes;
            try {
                for (var reposList_1 = __asyncValues(reposList), reposList_1_1; reposList_1_1 = yield reposList_1.next(), !reposList_1_1.done;) {
                    const repo = reposList_1_1.value;
                    try {
                        const pkgjson = yield (0, helpers_1.getRepoPackageJson)(repo.nameWithOwner);
                        if (pkgjson) {
                            reposPkgJson.push(pkgjson);
                        }
                    }
                    catch (error) {
                        console.log("error fetching list of  package.jsons >>>>>>>>>>> ", error);
                        throw error;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (reposList_1_1 && !reposList_1_1.done && (_a = reposList_1.return)) yield _a.call(reposList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log("reposPkgJson === ", reposPkgJson);
            return reposPkgJson;
        }
        return new Error("viewer repositories not found");
    });
}
exports.getAllReoosPackageJson = getAllReoosPackageJson;
