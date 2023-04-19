import express from "express";

import { fetchAllRepos, parseReposMiddleware } from "./handlers";
import { PkgsRequest } from "./types";
import { getViewerRepos } from "./user_pkgs/helpers";


const router = express.Router();

router.get("/", async (req, res) => {
  res.send("repos page ");
});

router.get("/all", async (req, res) => {
  const all_repos  = await getViewerRepos()
  res.json({all_repos});
});



router.post("/pkgs", fetchAllRepos,parseReposMiddleware, async (req: PkgsRequest, res) => {
// const pkgs = await req.pkgs_json_promises
  // res.send(pkgs);
})

export default router;




