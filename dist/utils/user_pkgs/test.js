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
const repos = [
    'https://api.github.com/repos/angular/angular',
    'https://api.github.com/repos/facebook/react',
    'https://api.github.com/repos/vuejs/vue'
];
Promise.all(repos.map((repo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${repo}/contents/package.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch package.json for ${repo}`);
        }
        const packageJSON = yield response.json();
        console.log(`Package.json for ${repo}: `, packageJSON);
        return packageJSON;
    }
    catch (error) {
        console.error(error);
        return null;
    }
})))
    .then((results) => {
    console.log('All package.json files fetched:', results);
})
    .catch((error) => {
    console.error(error);
});
