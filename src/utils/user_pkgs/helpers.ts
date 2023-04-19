import { subDepsArr } from "./subdeps";
import { RequiredDecodedPackageJson, TPkgType, DecodedPackageJson } from "./types";

// condition to group packages based on their dependancies/devDependancies
export function pkgTypeCondition(pkg: RequiredDecodedPackageJson): { pkg_type: TPkgType; condition: boolean; } {

    if (pkg.devDependencies?.vite && pkg.devDependencies["@vitejs/plugin-react"]) {
        return { pkg_type: "React+Vite", condition: true }
    }
    if (pkg.dependencies?.react && pkg.dependencies?.relay) {
        return { pkg_type: "React+Relay", condition: true }
    }
    if (pkg.devDependencies?.rakkasjs) {
        return { pkg_type: "Rakkasjs", condition: true }
    }

    if (pkg.dependencies?.next) {
        return { pkg_type: "Nextjs", condition: true }
    }
    if ((pkg.devDependencies?.nodemon || pkg.dependencies?.nodemon || pkg.dependancies?.express)) {
        return { pkg_type: "Nodejs", condition: true }
    }
    return { pkg_type: "Others", condition: false }
}



//  modify package.json to addthe pkg_type 
export async function modifyPackageJson(pgkjson: DecodedPackageJson) {

    if ("name" in pgkjson) {
        pgkjson['pkg_type'] = pkgTypeCondition(pgkjson).pkg_type

        const alldeps = Object.keys(pgkjson.dependencies).map((key) => {
            return key.split('^')[0]
        }).concat(Object.keys(pgkjson.devDependencies).map((key) => {
            return key.split('^')[0]
        })
        )

        const favdeps = subDepsArr.filter((key) => {
            return alldeps.find((dep) => {
                return dep === key
            })
        })

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


        pgkjson['favdeps'] = favdeps
        return pgkjson

    }
    return pgkjson
}


//  get repository package.json
export async function getRepoPackageJson(owner_repo: string) {
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


