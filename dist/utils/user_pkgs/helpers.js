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
exports.getRepoPackageJson = exports.modifyPackageJson = exports.pkgTypeCondition = void 0;
const subdeps_1 = require("./subdeps");
// condition to group packages based on their dependancies/devDependancies
function pkgTypeCondition(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (((_a = pkg.devDependencies) === null || _a === void 0 ? void 0 : _a.vite) && pkg.devDependencies["@vitejs/plugin-react"]) {
        return { pkg_type: "React+Vite", condition: true };
    }
    if (((_b = pkg.dependencies) === null || _b === void 0 ? void 0 : _b.react) && ((_c = pkg.dependencies) === null || _c === void 0 ? void 0 : _c.relay)) {
        return { pkg_type: "React+Relay", condition: true };
    }
    if ((_d = pkg.devDependencies) === null || _d === void 0 ? void 0 : _d.rakkasjs) {
        return { pkg_type: "Rakkasjs", condition: true };
    }
    if ((_e = pkg.dependencies) === null || _e === void 0 ? void 0 : _e.next) {
        return { pkg_type: "Nextjs", condition: true };
    }
    if ((((_f = pkg.devDependencies) === null || _f === void 0 ? void 0 : _f.nodemon) || ((_g = pkg.dependencies) === null || _g === void 0 ? void 0 : _g.nodemon) || ((_h = pkg.dependancies) === null || _h === void 0 ? void 0 : _h.express))) {
        return { pkg_type: "Nodejs", condition: true };
    }
    return { pkg_type: "Others", condition: false };
}
exports.pkgTypeCondition = pkgTypeCondition;
//  modify package.json to addthe pkg_type 
function modifyPackageJson(pgkjson) {
    return __awaiter(this, void 0, void 0, function* () {
        if ("name" in pgkjson) {
            pgkjson['pkg_type'] = pkgTypeCondition(pgkjson).pkg_type;
            const alldeps = Object.keys(pgkjson.dependencies).map((key) => {
                return key.split('^')[0];
            }).concat(Object.keys(pgkjson.devDependencies).map((key) => {
                return key.split('^')[0];
            }));
            const favdeps = subdeps_1.subDepsArr.filter((key) => {
                return alldeps.find((dep) => {
                    return dep === key;
                });
            });
            // if(favdeps.length<15){
            //   const favDepsSet = new Set(favdeps)
            //     alldeps.map((dep) => {
            //     if(favDepsSet.size <= 20){
            //         //@ts-expect-error
            //         favDepsSet.add(dep)
            //     }
            //     return
            // })
            // pgkjson['favdeps'] = Array.from(favDepsSet)
            // return pgkjson
            // }
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
