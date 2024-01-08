import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { logError, logNormal, logSuccess } from "./utils/helpers";

const PORT = 5000;

const startServer = async () => {
  dotenv.config();

  const app: Express = express();
  const port = process.env.PORT ? process.env.PORT : PORT;
  app.use(express.json());
  app.use(express.static("public"));

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" });
  });



  app.listen(port, () => {
  logNormal(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};
startServer().catch((e) => logError("error starting server======== ", e));
