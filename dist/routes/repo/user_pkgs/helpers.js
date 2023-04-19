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
exports.getRepoPackageJson = exports.modifyPackageJson = exports.mostFaveDepsList = exports.createPkgObject = exports.pkgTypeCondition = exports.getAllReoosPackageJson = exports.getViewerRepos = void 0;
const types_1 = require("./types");
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
                        const pkgjson = yield getRepoPackageJson(repo.nameWithOwner);
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
            // console.log("reposPkgJson === ", reposPkgJson);
            return reposPkgJson;
        }
        return new Error("viewer repositories not found");
    });
}
exports.getAllReoosPackageJson = getAllReoosPackageJson;
// condition to group packages based on their dependancies/devDependancies
function pkgTypeCondition(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if ((_a = pkg.devDependencies) === null || _a === void 0 ? void 0 : _a.rakkasjs) {
        return { pkg_type: "Rakkasjs", condition: true };
    }
    if ((_b = pkg.dependencies) === null || _b === void 0 ? void 0 : _b.next) {
        return { pkg_type: "Nextjs", condition: true };
    }
    if (((_c = pkg.dependencies) === null || _c === void 0 ? void 0 : _c.react) && ((_d = pkg.dependencies) === null || _d === void 0 ? void 0 : _d['react-relay'])) {
        return { pkg_type: "React+Relay", condition: true };
    }
    if (((_e = pkg.devDependencies) === null || _e === void 0 ? void 0 : _e.vite) && ((_f = pkg.dependencies) === null || _f === void 0 ? void 0 : _f.react)) {
        return { pkg_type: "React+Vite", condition: true };
    }
    if ((((_g = pkg.devDependencies) === null || _g === void 0 ? void 0 : _g.nodemon) || ((_h = pkg.dependencies) === null || _h === void 0 ? void 0 : _h.nodemon) || ((_j = pkg.dependancies) === null || _j === void 0 ? void 0 : _j.express))) {
        return { pkg_type: "Nodejs", condition: true };
    }
    return { pkg_type: "Others", condition: false };
}
exports.pkgTypeCondition = pkgTypeCondition;
function createPkgObject(pkg) {
    // @ts-expect-error
    const pkgtypeObj = {};
    if ("name" in pkg)
        types_1.pkgTypesArr.map((key) => {
            pkgtypeObj[key] = {
                name: "",
                dependencies: pkg.dependencies,
                devDependencies: new Set(),
                count: 0
            };
        });
}
exports.createPkgObject = createPkgObject;
exports.mostFaveDepsList = [
    "tailwindcss", "supabase", "typescript", "react-router-dom", "react-icons",
    "firebase", "dayjs", "axios", "socket.io", "pocketbase", "react-to-print",
    "react-query", "rollup", "express", "graphql", "jest", "vitest", "nodemon"
];
//  modify package.json to addthe pkg_type 
function modifyPackageJson(pgkjson) {
    return __awaiter(this, void 0, void 0, function* () {
        if ("name" in pgkjson) {
            const typeCondition = pkgTypeCondition(pgkjson);
            console.log("typeCondition", typeCondition);
            pgkjson['pkg_type'] = typeCondition.pkg_type;
            const alldeps = Object.keys(pgkjson.dependencies).map((key) => {
                return key.split('^')[0];
            }).concat(Object.keys(pgkjson.devDependencies).map((key) => {
                return key.split('^')[0];
            }));
            const favdeps = exports.mostFaveDepsList.filter((key) => {
                return alldeps.find((dep) => {
                    return dep === key;
                });
            });
            pgkjson['favdeps'] = favdeps;
            return pgkjson;
        }
        return pgkjson;
    });
}
exports.modifyPackageJson = modifyPackageJson;
//  get repository package.json
function getRepoPackageJson(owner_repo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const headersList = {
                "Authorization": `bearer ${process.env.GH_PAT}`,
            };
            const response = yield fetch(`https://api.github.com/repos/${owner_repo}/contents/package.json`, {
                method: "GET",
                headers: headersList
            });
            const data = yield response.json();
            if (data && data.encoding === "base64" && data.content) {
                const stringBuffer = Buffer.from(data.content, data.encoding).toString();
                const pgkjson = yield JSON.parse(stringBuffer);
                return yield modifyPackageJson(pgkjson);
            }
            // console.log("data === ",data)
            return data;
        }
        catch (error) {
            console.log("error fetching package.json >>>>>>>>>>>>  ", error);
            return error;
        }
    });
}
exports.getRepoPackageJson = getRepoPackageJson;
