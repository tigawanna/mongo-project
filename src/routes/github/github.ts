import express from "express";
import { computeAllPkgJsons } from "./helpers";
import { logError,logNormal,logSuccess } from "../../utils/helpers";
import { getGroupedRepos } from "../../mongo/queries";
import { batchCreateRepos, batchUpdateRepos, updateRepo } from "../../mongo/mutations";




// var clc = require("cli-color");
const router = express.Router();


router.get("/", async (req, res) => {
  try{
  const aggr_repos = await getGroupedRepos()
    logSuccess("AGGR repos ",aggr_repos);
    res.json(aggr_repos);
  }catch(err){
    logError("error fetching aggregated mongo records",err)
    res.status(400).send({ error: err })
  }


});

router.put("/group", async (req, res) => {
  if (!req.body?.ownwer_repo_name){
    res.status(400).send(new Error("repo_name is required"))
    return
  }

  try {
    const repo = req.body.owner_repo_name
    const repo_pkg_json = await updateRepo(repo)
    logSuccess("repo_pkg_json update",repo_pkg_json);
    res.json(repo_pkg_json);
  } catch (error) {
    logError("error in the update_repo catch block  ==> ", error)
  }

});



router.post("/batch_create", async (req, res) => {
  try {
    if (!req?.body?.viewer_token) {
      res.status(400).send(new Error("viewer_token is required"))
      return
    }
    
    const reposPkgJson = await computeAllPkgJsons(req.body.viewer_token)
    const parsedRepos = reposPkgJson.filter((repo) => (repo&&("name" in repo)&&repo.name&&repo.pkg_type))
    const repo_insert_res = await batchCreateRepos(parsedRepos)
    logSuccess("repo_insert_res gotten=== ",repo_insert_res);

    res.json({ repo_insert_res });
    return
  }
  catch (error) {
    logError("error in the batch_create catch block  ==> ", error)
    res.status(400).send({ error })
    
  }

  // logError("viewer repos not found");
  // res.status(400).send(new Error("viewer repositories not found"))

});



router.put("/batch_update", async (req, res) => {
  try {
    if (!req?.body?.viewer_token) {
      res.status(400).send(new Error("viewer_token is required"))
      return
    }

    const reposPkgJson = await computeAllPkgJsons(req.body.viewer_token)
    const parsedRepos = reposPkgJson.filter((repo) => (repo && ("name" in repo) && repo.name && repo.pkg_type))
    const repo_insert_res = await batchUpdateRepos(parsedRepos)
    res.json({ "batch repo update ": repo_insert_res });
  }
  catch (error) {
    logError("error in the batch_update catch block  ==> ", error)
    res.status(400).send({ error })
  }

  logError("viewer repos not found");
  res.status(400).send(new Error("viewer repositories not found"))

});




export default router;





