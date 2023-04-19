import { Response, NextFunction } from 'express';
import { PkgsRequest } from './types';
import { fetchRepos } from './helpers';
import { getRepoPackageJson } from './user_pkgs/helpers';
import {  pkgTypesArr, PlainDecodedPackageJson, TPkgType, TPkgTypeObj } from './user_pkgs/types';


export async function fetchAllRepos(req: PkgsRequest, res: Response, next: NextFunction){
    try {
        const repos = await fetchRepos()
        req.pkgs = repos
        const pkg_json_promises=[]
        for await (const repo of repos.slice(0,50)){
            pkg_json_promises.push(getRepoPackageJson(repo.nameWithOwner))
        }
        const pkgs_json_promises = Promise.allSettled(pkg_json_promises)
        req.pkgs_json_promises = pkgs_json_promises
        next();
    } catch (error) {
        res.status(400).send({"error fetching repos":error});
     return
    }

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
    const pkgs = await req.pkgs_json_promises 
    const pkg_values = pkgs?.map((pkgjson) => ("value" in pkgjson) && pkgjson.value)?.filter((pkgjson) => pkgjson) as unknown as PlainDecodedPackageJson[]
    const pkgs_obj = pkg_values&&pkg_values.reduce((acc:TPkgTypeObj,curr) => {
  
        if(!curr.pkg_type){
            return acc
        }

        const currDepsSet = curr.favdeps
        const oldArr = acc[curr.pkg_type]?.dependencies
        const newDepsArr= [...oldArr, ...currDepsSet].slice(0,10)
       
         acc[curr.pkg_type] = {
            name:curr.pkg_type,
            dependencies:newDepsArr,
            count:acc[curr.pkg_type].count + 1
        }   
        return acc  
        },createDefaultObject())

        res.json({pkgs_obj,pkg_values});
    next()
}
