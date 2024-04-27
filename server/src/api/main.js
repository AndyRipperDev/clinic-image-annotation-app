import express from "express";
import path from "path";
import { convertDicomToDzi } from "../utils/dzi/dzi.converter.js";
import {
  uploadStorage,
  preuploadMiddleware,
} from "../middleware/storage.middleware.js";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs/promises";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Annotation API" });
});

router.post(
  "/upload/:folderName",
  preuploadMiddleware,
  uploadStorage.single("dicomFilesZip"),
  async (req, res) => {
    try {
      const folderName = req.params.folderName;
      const extractDir = `./data/folders/${folderName}/dicom/`;
      const zipFile = req.file;
      const zipFilePath = zipFile.path;

      const data = await fs.readFile(zipFilePath);
      let errorsMess = "";

      const zip = await JSZip.loadAsync(data);
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          try {
            const fileData = await zip.files[filename].async("nodebuffer");
            const uniqueDirectory = uuidv4();
            const outputFile = path.join(extractDir, uniqueDirectory, filename);
            const directoryPath = path.join(extractDir, uniqueDirectory);

            await fs.mkdir(directoryPath, { recursive: true });
            await fs.writeFile(outputFile, fileData);

            const outputPath = "./data/dzi_images/" + uniqueDirectory + "/";
            const success = await convertDicomToDzi(outputFile, outputPath);

            if (!success) {
              errorsMess += `Unexpected error during converting DICOM file \'${filename}\' to deep zoom images\n`;
            }
          } catch (error) {
            errorsMess += `Unexpected error during extracting and converting DICOM file \'${filename}\' to deep zoom images: ${error}\n`;
          }
        })
      );

      await fs.unlink(zipFilePath);

      if (errorsMess.trim() == "") {
        res.status(200).json({
          message: "DICOM files uploaded successfully",
        });
      } else {
        res.status(500).json({ message: errorsMess });
      }
    } catch (error) {
      console.error("Error uploading DICOM files", error);
      res
        .status(500)
        .json({ message: `Error uploading DICOM files: ${error}` });
    }
  }
);

export { router };

//DONE GET: folders/
//DONE POST: folders/

//DONE GET: folders/folderName
//DONE PUT: folders/folderName
//DONE DELETE: folders/folderName

// GET: folders/folderName/annotations/
//DONE POST: folders/folderName/annotations/

//DONE GET: folders/folderName/annotations/dicomUuid
//DONE PUT: folders/folderName/annotations/dicomUuid
//DONE DELETE: folders/folderName/annotations/dicomUuid

//DONE GET: folders/folderName/dicom/
//DONE POST: folders/folderName/dicom/ // upload

//NOT IMPLEMENTED GET: folders/folderName/dicom/dicomUuid
//NOT IMPLEMENTED PUT: folders/folderName/dicom/dicomUuid
//DONE DELETE: folders/folderName/dicom/dicomUuid
