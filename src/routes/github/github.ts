import express from "express";
import { getOneRepoPackageJson, getViewerRepos } from "./helpers";
import { DecodedPackageJson } from "./type";
import { logError, logNormal, logSuccess } from "../../utils/helpers";
import { getGroupedRepos } from "../../mongo/queries";
import { GroupedRepo } from "../../mongo/schema";




// var clc = require("cli-color");
const router = express.Router();


router.get("/", async (req, res) => {
  // const all_repos  = await getViewerRepos(req.body?.viewer_token)
  try{
    // const aggr_repos = await getGroupedRepos()
  // const aggr_repos = await GroupedRepo.create({
  //  dependencies: {"nice":"nice"},
  //  devDependencies: {"nice":"nice"},
  //  favdeps:["nice"],
  //  name:"test",
  //  pkg_type:"test",
  //  type:"test",
   // })
  const aggr_repos = await getGroupedRepos()
    logSuccess("AGGR repos ",aggr_repos);
    res.json(aggr_repos);
  }catch(err){
    logError("error fetching aggregated mongo records",err)
    res.status(400).send({ error: err })
  }


});

router.get("/group", async (req, res) => {
  // const all_repos  = await getViewerRepos(req.body?.viewer_token)
  // logSuccess("github endpoint");
  
  res.json({ boobs: "YES" });
});



router.post("/", async (req, res) => {
  // console.log("requeets.body    === ",chalk.green(req.body))

  try {
    if (!req?.body?.viewer_token) {
      res.status(400).send(new Error("viewer_token is required"))
      return
    }
    const all_repos = await getViewerRepos(req.body?.viewer_token)

    if (all_repos && "message" in all_repos) {
      logError("error loading  viewer repos  ==> ", all_repos)
      res.status(400).send(new Error(all_repos.message))
      return
    }

    const reposPkgJson: DecodedPackageJson[] = [];

    if (all_repos && "data" in all_repos) {
      const reposList = all_repos.data.viewer.repositories.nodes
      for await (const repo of reposList) {
        const pkgjson = await getOneRepoPackageJson(repo.nameWithOwner);
        if (pkgjson) {
          reposPkgJson.push(pkgjson);
        }
      }
    }
    logNormal("repo pkg jsns", reposPkgJson)
    res.json({ reposPkgJson });
  }
  catch (error) {
    logError("error loading  viewer repos in main catch block  ==> ", error)
    res.status(400).send({ error })
  }

  logError("viewer repos not found");
  res.status(400).send(new Error("viewer repositories not found"))

});





export default router;




// [
//   {
//     "$group": {
//       "_id": "$pkg_type",
//       "repo_names": { "$push": "$name" },
//       "top_favdeps": { "$push": "$favdeps" }
//     }
//   },
//   {
//     "$unwind": "$top_favdeps"
//   },
//   {
//     $sort: {
//       "top_favdeps": -1
//     }
//   },
//   {
//     "$unwind": "$top_favdeps"
//   },
//   {
//     "$group": {
//       "_id": "$_id",
//       "repo_names": { "$first": "$repo_names" },
//       "top_favdeps": { "$addToSet": "$top_favdeps" }
//     }
//   }
// ]
