import express from "express";

import { fetchAllRepos, parseReposMiddleware } from "./handlers";
import { PkgsRequest } from "./types";
import { getViewerRepos } from "./user_pkgs/helpers";


const router = express.Router();

router.get("/", async (req, res) => {
  res.send("repos page ");
});

router.get("/all", async (req, res) => {
  const all_repos  = await getViewerRepos(req.body?.viewer_token)
  res.json({all_repos});
});



router.post("/pkgs", fetchAllRepos,parseReposMiddleware, async (req: PkgsRequest, res) => {
  // console.log("request.body  ", req.body)

  if (!req.body?.viewer_token) {
    res.status(400).send({ "error": "github token required " });
  }
})

export default router;




