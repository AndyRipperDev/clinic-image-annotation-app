import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { router as mainRouter } from "../api/main.js";
import { router as folderRouter } from "../api/folders.js";
import cron from "node-cron";
import { deleteUnusedDicomUuids } from "../utils/storageOperations/operations.dzi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", mainRouter);
app.use("/folders", folderRouter);
app.use(
  "/dzi_images",
  express.static(path.join(__dirname, "../../data/dzi_images"))
);
app.use(
  "/viewer/images",
  express.static(path.join(__dirname, "../media/viewer/images"))
);

cron.schedule("0 0 * * 0", () => {
  console.log("Running a maintenance task every week");
  console.log("Found unused dzi images:");
  deleteUnusedDicomUuids(24 * 7).then(console.log);
});

// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   getUnusedDicomUuids(24 * 7).then(console.log);
//   deleteUnusedDicomUuids(24 * 7 ).then(console.log);
//   getUnusedDicomUuids(24 * 7).then(console.log);
// });

export { app };
