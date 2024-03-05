import express from "express";
import { convertToDzi } from "../utils/dzi/dzi.converter.js";
import {
  uploadStorage,
  preuploadMiddleware,
} from "../middleware/storage.middleware.js";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post(
  "/upload",
  preuploadMiddleware,
  uploadStorage.single("uploaded_file"),
  async (req, res) => {
    try {
      const { filename, path } = req.file;
      const outputPath = "./data/dzi_images/" + req.dicomUniqueDirectory + "/";
      const success = await convertToDzi(path, outputPath);

      if (success) {
        res.status(200).json({
          message: "File uploaded successfully",
          fileUUID: req.dicomUniqueDirectory,
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error uploading image", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export { router };
