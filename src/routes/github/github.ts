import express from "express";
import { getViewerRepos } from "./helpers";




const router = express.Router();


router.get("/", async (req, res) => {
  const all_repos  = await getViewerRepos(req.body?.viewer_token)
  res.json({all_repos});
});

router.post("/", async (req, res) => {
    console.log("requeets.body    === ",req.body)
    
    const all_repos = await getViewerRepos(req.body?.viewer_token)

    if(!req?.body?.viewer_token){
       res.status(400).send(new Error("viewer_token is required"))
      return
    }

    if(all_repos && "message" in all_repos){
      console.log("error loading  viewer repos  ==> ", all_repos)
       res.status(400).send(new Error(all_repos.message))
    }


    res.json({all_repos});




});





export default router;




