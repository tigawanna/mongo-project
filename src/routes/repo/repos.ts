import express from "express";
import { getViewerRepos } from "./user_pkgs/packages";
import { fetchAllRepos, parseReposMiddleware } from "./handlers";
import { PkgsRequest } from "./types";


const router = express.Router();

router.get("/", async (req, res) => {
  res.send("repos page ");
});

router.get("/all", async (req, res) => {
  const all_repos  = await getViewerRepos()
  res.json({all_repos});
});



router.post("/pkgs", fetchAllRepos,parseReposMiddleware, async (req: PkgsRequest, res) => {

 
})

export default router;




