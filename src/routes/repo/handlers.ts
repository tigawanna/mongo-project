import { Response, NextFunction } from 'express';
import { PkgsRequest } from './types';
import { getAllReoosPackageJson} from './user_pkgs/helpers';
import {  pkgTypesArr, PlainDecodedPackageJson, TPkgTypeObj } from './user_pkgs/types';


export async function fetchAllRepos(req: PkgsRequest, res: Response, next: NextFunction){

    try {
        if (typeof req.body?.viewer_token === 'undefined') {
            res.status(400).send({ "error": "viewer_token not found in fetchallrepos middleware" });
            return;
        }

        const viewer_token = req.body?.viewer_token
        const pkgs_json_promises = await getAllReoosPackageJson(viewer_token)
        // console.log("pkgs_json_promises === ", pkgs_json_promises)
        if(pkgs_json_promises instanceof Error){
            throw pkgs_json_promises

        }
        req.pkgs_json_promises = pkgs_json_promises
        next();
    } catch (error) {
        console.log("error fetching repos  ==> ", error);
        res.status(400).send({"error fetching repos":error});
     return
    }
return 
}



export function createDefaultObject(): TPkgTypeObj {
    return pkgTypesArr.reduce((acc, curr) => {
        acc[curr] = {
            name:null,
            dependencies:[],
            count:0
    };
        return acc;
    }, {} as TPkgTypeObj);
}

export async function parseReposMiddleware(req:PkgsRequest, res: Response, next: NextFunction) {
    try {
        const pkgs = await req.pkgs_json_promises
        const pkg_values = pkgs?.map((pkgjson) => ("value" in pkgjson) && pkgjson.value)?.filter((pkgjson) => pkgjson) as unknown as PlainDecodedPackageJson[]
        const pkgs_obj = pkg_values && pkg_values.reduce((acc: TPkgTypeObj, curr) => {

            if (!curr.pkg_type) {
                return acc
            }

            const currDepsSet = curr.favdeps
            const oldArr = acc[curr.pkg_type]?.dependencies
            const newDepsArr = [...oldArr, ...currDepsSet].slice(0, 10)

            acc[curr.pkg_type] = {
                name: curr.pkg_type,
                dependencies: newDepsArr,
                count: acc[curr.pkg_type].count + 1
            }
            return acc
        }, createDefaultObject())

        res.json({ pkgs_obj, pkg_values });
        next()
        
    } catch (error) {
        res.status(400).send({ "error parsing repos in parseRecordMiddleware": error }); 
    }

}
