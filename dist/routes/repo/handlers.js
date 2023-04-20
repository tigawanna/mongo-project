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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReposMiddleware = exports.createDefaultObject = exports.fetchAllRepos = void 0;
const helpers_1 = require("./user_pkgs/helpers");
const types_1 = require("./user_pkgs/types");
function fetchAllRepos(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof ((_a = req.body) === null || _a === void 0 ? void 0 : _a.viewer_token) === 'undefined') {
                res.status(400).send({ "error": "viewer_token not found in fetchallrepos middleware" });
                return;
            }
            const viewer_token = (_b = req.body) === null || _b === void 0 ? void 0 : _b.viewer_token;
            const pkgs_json_promises = yield (0, helpers_1.getAllReoosPackageJson)(viewer_token);
            // console.log("pkgs_json_promises === ", pkgs_json_promises)
            if (pkgs_json_promises instanceof Error) {
                throw pkgs_json_promises;
            }
            req.pkgs_json_promises = pkgs_json_promises;
            next();
        }
        catch (error) {
            console.log("error fetching repos  ==> ", error);
            res.status(400).send({ "error fetching repos": error });
            return;
        }
        return;
    });
}
exports.fetchAllRepos = fetchAllRepos;
function createDefaultObject() {
    return types_1.pkgTypesArr.reduce((acc, curr) => {
        acc[curr] = {
            name: null,
            dependencies: [],
            count: 0
        };
        return acc;
    }, {});
}
exports.createDefaultObject = createDefaultObject;
function parseReposMiddleware(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pkgs = yield req.pkgs_json_promises;
            const pkg_values = (_a = pkgs === null || pkgs === void 0 ? void 0 : pkgs.map((pkgjson) => ("value" in pkgjson) && pkgjson.value)) === null || _a === void 0 ? void 0 : _a.filter((pkgjson) => pkgjson);
            const pkgs_obj = pkg_values && pkg_values.reduce((acc, curr) => {
                var _a;
                if (!curr.pkg_type) {
                    return acc;
                }
                const currDepsSet = curr.favdeps;
                const oldArr = (_a = acc[curr.pkg_type]) === null || _a === void 0 ? void 0 : _a.dependencies;
                const newDepsArr = [...oldArr, ...currDepsSet].slice(0, 10);
                acc[curr.pkg_type] = {
                    name: curr.pkg_type,
                    dependencies: newDepsArr,
                    count: acc[curr.pkg_type].count + 1
                };
                return acc;
            }, createDefaultObject());
            res.json({ pkgs_obj, pkg_values });
            next();
        }
        catch (error) {
            res.status(400).send({ "error parsing repos in parseRecordMiddleware": error });
        }
    });
}
exports.parseReposMiddleware = parseReposMiddleware;
