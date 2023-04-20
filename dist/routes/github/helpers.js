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
exports.getViewerRepos = void 0;
function getViewerRepos(viewer_token) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("viewerr token  === ", viewer_token)
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
                    "Authorization": `bearer ${viewer_token}`,
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
            console.log("all user repositories ===== ", data);
            if ("message" in data) {
                console.log("error fetching viewer repos  ==> ", data);
                throw data;
            }
            return data;
        }
        catch (err) {
            console.log("error fetching viewer repos  ==> ", err);
            return err;
        }
    });
}
exports.getViewerRepos = getViewerRepos;
