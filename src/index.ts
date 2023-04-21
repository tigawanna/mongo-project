import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import about from "./routes/about";
import github from  './routes/github/github';

import mongoose from 'mongoose';
import { logError, logSuccess } from './utils/helpers';


const ejs = require("ejs");
const PORT=5000;    

const startServer=async()=>
{
    
    dotenv.config();
    
    const app: Express = express();
    const port = process.env.PORT?process.env.PORT:PORT;
    app.use(express.json());


  const PROD_MONGODB_URI = `mongodb+srv://denniskinuthiaw:${process.env.ATLAS_PWD}@frankfurt-cluster.htmeu8w.mongodb.net/?retryWrites=true&w=majority`
  const LOCAL_MONGODB_URI = `mongodb://localhost:27017/green`

  mongoose.connect(PROD_MONGODB_URI).then(
      async() => {
        logSuccess('MongoDb Connected!')

      }
      );

    app.set("view engine", "ejs");
    app.use(express.static("public"));

    app.get('/', (req: Request, res: Response) => {
      res.render("pages/index");
    });

 
    app.use("/github",github);
    app.use("/about",about);

    app.listen(port, () => {
        logSuccess(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
}
startServer().catch(e=>logError("error starting server======== ",e))
