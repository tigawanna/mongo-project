"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const about_1 = __importDefault(require("./routes/about"));
const github_1 = __importDefault(require("./routes/github/github"));
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("./utils/helpers");
const ejs = require("ejs");
const PORT = 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const port = process.env.PORT ? process.env.PORT : PORT;
    app.use(express_1.default.json());
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
    const PROD_MONGODB_URI = `mongodb+srv://denniskinuthiaw:${process.env.ATLAS_PWD}@frankfurt-cluster.htmeu8w.mongodb.net/?retryWrites=true&w=majority`;
    const LOCAL_MONGODB_URI = `mongodb://localhost:27017/green`;
    mongoose_1.default.connect(PROD_MONGODB_URI).then(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, helpers_1.logSuccess)('MongoDb Connected!');
        // const aggr_repos = await GroupedRepo.findById('6441a9c829c381bc7473bf0d')
        // logSuccess("by Id  ", aggr_repos);
    }));
    app.set("view engine", "ejs");
    app.use(express_1.default.static("public"));
    app.get('/', (req, res) => {
        res.render("pages/index");
    });
    app.use("/github", github_1.default);
    app.use("/about", about_1.default);
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
});
startServer().catch(e => console.log("error strting server======== ", e));
