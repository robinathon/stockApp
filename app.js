const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const { downloadAndProcessData } = require("./scripts/downloadData");
const dotenv = require("dotenv");
dotenv.config();

const stockRouter = require("./Routers/stockRouter");
const userRouter = require("./Routers/userRouter");
app.use(express.json());
app.use(cookieParser());

async function runDownloadScript() {
  try {
    await downloadAndProcessData(); //do not incldue this line while deploying on any free deploying platform, it will exceed the free-tier memory limit.
    console.log("Data download and processing completed.");
  } catch (error) {
    console.error("Error during data download and processing:", error);
  }
}

runDownloadScript().then(() => {
  app.use("/stock", stockRouter);
  app.use("/user", userRouter);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
