import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import about from "./routes/about";
import repo from './routes/repo/repos';

const ejs = require("ejs");
const PORT=5000;    

const startServer=async()=>
{
    
    dotenv.config();
    
    const app: Express = express();
    const port = process.env.PORT?process.env.PORT:PORT;
    
    // app.use(express.static(__dirname + '/public'));



    app.set("view engine", "ejs");
    app.use(express.static("public"));

    app.get('/', (req: Request, res: Response) => {
      res.render("pages/index");
    });

    app.use("/repo",repo);
    app.use("/about",about);

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
}
startServer().catch(e=>console.log("error strting server======== ",e))
