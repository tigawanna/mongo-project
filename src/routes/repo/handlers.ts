import { Response, NextFunction } from 'express';
import { PkgsRequest } from './types';
import { fetchRepos } from './helpers';
import { getRepoPackageJson } from './user_pkgs/helpers';


export async function fetchAllRepos(req: PkgsRequest, res: Response, next: NextFunction){
    try {
        const repos = await fetchRepos()
        req.pkgs = repos
        const pkg_json_promises=[]
        for await (const repo of repos.slice(0,5)){
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


export async function parseReposMiddleware(req:PkgsRequest, res: Response, next: NextFunction) {
    const pkgs = await req.pkgs_json_promises
    res.send(pkgs);
    next()
}
