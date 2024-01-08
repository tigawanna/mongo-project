// src/index.ts
import express from "express";
import dotenv from "dotenv";

// src/utils/helpers.ts
import kleur from "kleur";
function logSuccess(message, data) {
  console.log(kleur.green(`Success: ${message}`));
  data && console.log(data);
}
function logError(message, data) {
  console.log(kleur.red(`Error: ${message}`));
  data && console.log(data);
}

// src/index.ts
var PORT = 5e3;
var startServer = async () => {
  dotenv.config();
  const app = express();
  const port = process.env.PORT ? process.env.PORT : PORT;
  app.use(express.json());
  app.use(express.static("public"));
  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });
  app.listen(port, () => {
    logSuccess(`\u26A1\uFE0F[server]: Server is running at http://localhost:${PORT}`);
  });
};
startServer().catch((e) => logError("error starting server======== ", e));
//# sourceMappingURL=index.mjs.map