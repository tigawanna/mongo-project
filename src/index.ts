import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import about from "./routes/about";
import github from  './routes/github/github';

import mongoose from 'mongoose';
import { logSuccess } from './utils/helpers';
import { GroupedRepo } from './mongo/schema';

const ejs = require("ejs");
const PORT=5000;    

const startServer=async()=>
{
    
    dotenv.config();
    
    const app: Express = express();
    const port = process.env.PORT?process.env.PORT:PORT;
    app.use(express.json());

  // const MONGODB_URI = 'mongodb://localhost:27017/green';

  // mongoose.connect(MONGODB_URI);

  // const db = mongoose.connection;

  // db.on('error', console.error.bind(console, 'MongoDB connection error: '));

  // db.once('open', () => {
  //   logSuccess('MongoDB connection successful!');
  //   const groupedCollection = db.collection('grouped');
  //   // Do something with the collection here...
  // })
  //   // app.use(express.static(__dirname + '/public'));
  
  const PROD_MONGODB_URI = `mongodb+srv://denniskinuthiaw:${process.env.ATLAS_PWD}@frankfurt-cluster.htmeu8w.mongodb.net/?retryWrites=true&w=majority`
  const LOCAL_MONGODB_URI = `mongodb://localhost:27017/green`

  mongoose.connect(PROD_MONGODB_URI).then(
      async() => {
        logSuccess('MongoDb Connected!')
        // const aggr_repos = await GroupedRepo.findById('6441a9c829c381bc7473bf0d')
        // logSuccess("by Id  ", aggr_repos);
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
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
}
startServer().catch(e=>console.log("error strting server======== ",e))
