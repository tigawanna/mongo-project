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
exports.getGroupedRepos = void 0;
const helpers_1 = require("../utils/helpers");
const schema_1 = require("./schema");
function getGroupedRepos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield schema_1.GroupedRepo.aggregate([
                {
                    "$group": {
                        "_id": "$pkg_type",
                        "repo_names": { "$push": "$name" },
                        "top_favdeps": { "$push": "$favdeps" }
                    }
                },
                {
                    "$unwind": "$top_favdeps"
                },
                {
                    $sort: {
                        "top_favdeps": -1
                    }
                },
                {
                    "$unwind": "$top_favdeps"
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "repo_names": { "$first": "$repo_names" },
                        "top_favdeps": { "$addToSet": "$top_favdeps" }
                    }
                }
            ]).exec();
            return result;
        }
        catch (error) {
            (0, helpers_1.logError)("error fetching aggregated mongo records", error);
            throw error;
        }
    });
}
exports.getGroupedRepos = getGroupedRepos;
