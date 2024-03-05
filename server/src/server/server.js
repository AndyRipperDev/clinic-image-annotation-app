import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { router as mainRouter } from "../api/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use("/", mainRouter);
app.use(
  "/dzi_images",
  express.static(path.join(__dirname, "../../data/dzi_images"))
);
app.use(
  "/viewer/images",
  express.static(path.join(__dirname, "../media/viewer/images"))
);

export { app };
