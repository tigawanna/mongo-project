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
exports.parseReposMiddleware = exports.fetchAllRepos = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./user_pkgs/helpers");
function fetchAllRepos(req, res, next) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repos = yield (0, helpers_1.fetchRepos)();
            req.pkgs = repos;
            const pkg_json_promises = [];
            try {
                for (var _b = __asyncValues(repos.slice(0, 5)), _c; _c = yield _b.next(), !_c.done;) {
                    const repo = _c.value;
                    pkg_json_promises.push((0, helpers_2.getRepoPackageJson)(repo.nameWithOwner));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const pkgs_json_promises = Promise.allSettled(pkg_json_promises);
            req.pkgs_json_promises = pkgs_json_promises;
            next();
        }
        catch (error) {
            res.status(400).send({ "error fetching repos": error });
            return;
        }
    });
}
exports.fetchAllRepos = fetchAllRepos;
function parseReposMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgs = yield req.pkgs_json_promises;
        res.send(pkgs);
        next();
    });
}
exports.parseReposMiddleware = parseReposMiddleware;
