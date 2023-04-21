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
exports.batchUpdateRepos = exports.updateRepo = exports.batchCreateRepos = void 0;
const helpers_1 = require("../routes/github/helpers");
const schema_1 = require("./schema");
function batchCreateRepos(repos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield schema_1.GroupedRepo.insertMany(repos);
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.batchCreateRepos = batchCreateRepos;
function updateRepo(owner_repo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repo_pkg_json = yield (0, helpers_1.getOneRepoPackageJson)(owner_repo);
            if (repo_pkg_json && "message" in repo_pkg_json) {
                throw new Error(repo_pkg_json.message);
            }
            const res = yield schema_1.GroupedRepo.findOneAndUpdate({ name: repo_pkg_json.name }, repo_pkg_json);
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateRepo = updateRepo;
function batchUpdateRepos(repos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield schema_1.GroupedRepo.updateMany({}, repos);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.batchUpdateRepos = batchUpdateRepos;
