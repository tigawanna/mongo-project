import { RequiredDecodedPackageJson, TPkgType, DecodedPackageJson, pkgTypesArr, ViewerRepos, CustomError } from "./types";



export async function getViewerRepos(viewer_token:string) {
    console.log("viewerr token  === ", viewer_token)
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
        })
        const data = await response.json() as unknown as ViewerRepos
        console.log("all user repositories ===== ", data)
        return data

    } catch (err) {
        console.log("error fetching viewer repos  ==> ", err)
        return err as ViewerRepos
    }
}

export async function getAllReoosPackageJson(viewer_token:string) {

    const repos = await getViewerRepos(viewer_token);
    if (repos.data &&  "message" in repos.data && repos.data?.documentation_url){
        console.log("repos.data.documentation_url === ", repos.data.documentation_url)
        throw new CustomError("error getting all repos ",new Error(repos.data.message))
    }

    const reposPkgJson: DecodedPackageJson[] = [];
    if (repos.data  && "viewer" in repos.data) {
        const reposList = repos.data.viewer.repositories.nodes

        for await (const repo of reposList) {
            try {
                const pkgjson = await getOneRepoPackageJson(repo.nameWithOwner);
                if (pkgjson) {
                    reposPkgJson.push(pkgjson);
                }
            } catch (error) {
                console.log("error fetching list of  package.jsons >>>>>>>>>>> ", error);
                throw error;
            }
        }
        // console.log("reposPkgJson === ", reposPkgJson);
        return reposPkgJson;
    }
    return new Error("viewer repositories not found");
}




// condition to group packages based on their dependancies/devDependancies
export function pkgTypeCondition(pkg: RequiredDecodedPackageJson): { pkg_type:TPkgType; condition: boolean; } {
    
    if (pkg.devDependencies?.rakkasjs) {
        return { pkg_type: "Rakkasjs", condition: true }
    }

    if (pkg.dependencies?.next) {
        return { pkg_type: "Nextjs", condition: true }
    }

    if (pkg.dependencies?.react && pkg.dependencies?.['react-relay']) {
        return { pkg_type: "React+Relay", condition: true }
    }

    if (pkg.devDependencies?.vite && pkg.dependencies?.react) {
        return { pkg_type: "React+Vite", condition: true }
    }
    
     if ((pkg.devDependencies?.nodemon || pkg.dependencies?.nodemon || pkg.dependancies?.express)) {
        return { pkg_type: "Nodejs", condition: true }
    }
    return { pkg_type: "Others", condition: false }
}

export function createPkgObject(pkg:DecodedPackageJson){
    // @ts-expect-error
    const pkgtypeObj:{[key in typeof pkgTypesArr[number]]:any} = {}
    if("name" in pkg)
    pkgTypesArr.map((key) => {
        pkgtypeObj[key] = {
            name: "",
            dependencies:pkg.dependencies,
            devDependencies: new Set(),
            count: 0
        }
    })

}


export const mostFaveDepsList = [
    "tailwindcss", "supabase", "typescript", "react-router-dom", "react-icons",
    "firebase", "dayjs", "axios", "socket.io", "pocketbase", "react-to-print",
    "react-query", "rollup", "express", "graphql", "jest", "vitest", "nodemon"]

//  modify package.json to addthe pkg_type 
export async function modifyPackageJson(pgkjson: DecodedPackageJson) {

    if ("name" in pgkjson) {
        const typeCondition = pkgTypeCondition(pgkjson)
        console.log("typeCondition", typeCondition)
        pgkjson['pkg_type'] = typeCondition.pkg_type

        const alldeps = Object.keys(pgkjson.dependencies).map((key) => {
            return key.split('^')[0]
        }).concat(Object.keys(pgkjson.devDependencies).map((key) => {
            return key.split('^')[0]
        })
        )

        const favdeps = mostFaveDepsList.filter((key) => {
            return alldeps.find((dep) => {
                return dep === key
            })
        })

        pgkjson['favdeps'] = favdeps
        return pgkjson

    }
    return pgkjson
}

//  get repository package.json
export async function getOneRepoPackageJson(owner_repo: string) {
    try {
        const headersList = {
            "Authorization": `bearer ${process.env.GH_PAT}`,
        }
        const response = await fetch(`https://api.github.com/repos/${owner_repo}/contents/package.json`, {
            method: "GET",
            headers: headersList
        });

        const data = await response.json()

            if (data && data.encoding === "base64" && data.content) {
            const stringBuffer = Buffer.from(data.content, data.encoding).toString()
            const pgkjson = await JSON.parse(stringBuffer) as DecodedPackageJson
            return await modifyPackageJson(pgkjson)

        }
        // console.log("data === ",data)
        return data as DecodedPackageJson
        
    }
    catch (error) {
        console.log("error fetching package.json >>>>>>>>>>>>  ", error)
        return  error as DecodedPackageJson
    }

}


