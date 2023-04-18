import { getRepoPackageJson } from "./helpers";
import { DecodedPackageJson, RequiredDecodedPackageJson, ViewerRepos } from "./types";

// get all viewer repositories using graphql API
export async function getViewerRepos() {
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
`
    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                //@ts-expect-error
                "Authorization": `bearer ${import.meta.env.RAKKAS_GH_PAT}`,
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
        })
        const data = await response.json() as unknown as ViewerRepos
        // console.log("#step 1 : all user repositories ===== ", data)
        return data

    } catch (err) {
        console.log("error fetching viewer repos  ==> ", err)
        return err as ViewerRepos
    }
}





export async function getAllReoosPackageJson() {
    const repos = await getViewerRepos();
    const reposPkgJson: DecodedPackageJson[] = [];
    if ("viewer" in repos.data) {
        const reposList = repos.data.viewer.repositories.nodes

        for await (const repo of reposList) {
            try {
                const pkgjson = await getRepoPackageJson(repo.nameWithOwner);
                if (pkgjson) {
                    reposPkgJson.push(pkgjson);
                }
            } catch (error) {
                console.log("error fetching list of  package.jsons >>>>>>>>>>> ", error);
                throw error;
            }
        }
 
        return reposPkgJson;
    }
    return new Error("viewer repositories not found");
}
