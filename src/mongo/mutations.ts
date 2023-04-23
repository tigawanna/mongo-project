import { getOneRepoPackageJson } from "../routes/github/helpers";
import { DecodedPackageJson } from "../routes/github/type";
import { GroupedRepo } from "./schema";


export async function batchCreateRepos(repos:DecodedPackageJson[]){
try {
    const res = await GroupedRepo.insertMany(repos)
    return res
} catch (error) {
    throw error
}
}

export async function updateRepo(owner_repo:string,viewer_token:string) {
  try {
        const repo_pkg_json = await getOneRepoPackageJson(owner_repo,viewer_token)
        if(repo_pkg_json && "message" in repo_pkg_json){
            throw new Error(repo_pkg_json.message)
        }
        const res = await GroupedRepo.findOneAndUpdate({name:repo_pkg_json.name},repo_pkg_json)
        return res
    } catch (error) {
        throw error
    }
}


export async function batchUpdateRepos(repos:DecodedPackageJson[]){
    try {
        return await GroupedRepo.updateMany({},repos)
       
    } catch (error) {
        throw error
    }
}
