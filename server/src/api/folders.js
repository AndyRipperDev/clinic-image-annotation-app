import express from "express";
import fs from "node:fs/promises";
import path from "path";
import {
  uploadStorage,
  preuploadMiddleware,
} from "../middleware/storage.middleware.js";
import {
  createFolder,
  folderExists,
  getFolderStats,
  getFoldersStats,
} from "../utils/storageOperations/operations.folder.js";
import {
  getDicomFilesInfo,
  getDicomFileInfo,
  extractDicomFiles,
} from "../utils/storageOperations/operations.dicom.js";
import {
  getAnnotation,
  createAnnotation,
  annotationExists,
} from "../utils/storageOperations/operations.annotations.js";

import JSZip from "jszip";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const foldersInfo = await getFoldersStats(directoryPath);

    res.status(200).json(foldersInfo);
  } catch (err) {
    console.error("Error reading directory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const folderPath = path.join(directoryPath, folderName);
    const folderFound = await folderExists(folderPath);
    if (folderFound) {
      return res.status(400).json({ error: "Folder already exists" });
    }

    const folderCreated = await createFolder(folderPath);
    if (!folderCreated) {
      return res.status(500).json({ error: "Folder creation failed" });
    }

    const folderInfo = await getFolderStats(folderPath);

    res.status(201).json(folderInfo);
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:folderName", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const folderInfo = await getFolderStats(folderPath);

    res.status(200).json(folderInfo);
  } catch (err) {
    console.error("Error retrieving folder information:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:folderName/download", async (req, res) => {
  const directoryPath = "./data/folders/";
  const zip = new JSZip();

  const { folderName } = req.params;
  const folderPath = path.join(directoryPath, folderName);

  // Recursive function to get all files in a directory
  const getFilesInDirectory = async (dir, fileList = []) => {
    const files = await fs.readdir(dir);

    for (let file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await getFilesInDirectory(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }

    return fileList;
  };

  // Get all files in the directory
  const files = await getFilesInDirectory(folderPath);

  // Append each file to the zip file
  // for (let filePath of files) {
  //   const fileContent = await fs.readFile(filePath);
  //   const zipPath = path.relative(folderPath, filePath);
  //   zip.file(zipPath, fileContent);
  // }

  // Append each file to the zip file
  for (let filePath of files) {
    const fileContent = await fs.readFile(filePath);
    const zipPath = path.join(folderName, path.relative(folderPath, filePath));
    zip.file(zipPath, fileContent, {
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    });
  }

  // Generate zip file and send it
  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(res.attachment(`${folderName}.zip`));
});

router.put("/:folderName", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.params;
    const { newFolderName } = req.body;

    if (!newFolderName) {
      return res.status(400).json({ error: "New folder name is required" });
    }

    const folderPath = path.join(directoryPath, folderName);
    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const newFolderPath = path.join(directoryPath, newFolderName);
    await fs.rename(folderPath, newFolderPath);

    const folderInfo = await getFolderStats(newFolderPath);

    res.status(200).json(folderInfo);
  } catch (err) {
    console.error("Error renaming folder:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:folderName", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await fs.rm(folderPath, { recursive: true });

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:folderName/dicom", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const dicomPath = path.join(folderPath, "dicom");
    const dicomFilesInfo = await getDicomFilesInfo(dicomPath);

    res.status(200).json(dicomFilesInfo);
  } catch (err) {
    console.error("Error retrieving DICOM information:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/:folderName/dicom",
  preuploadMiddleware,
  uploadStorage.single("dicomFilesZip"),
  async (req, res) => {
    const directoryPath = "./data/folders/";

    try {
      const { folderName } = req.params;
      const folderPath = path.join(directoryPath, folderName);

      const folderFound = await folderExists(folderPath);
      if (!folderFound) {
        return res.status(404).json({ error: "Folder not found" });
      }

      const dicomPath = path.join(folderPath, "dicom");
      const extractionResult = await extractDicomFiles(dicomPath, req.file);

      if (extractionResult.errors.trim() == "") {
        // const dicomFilesInfo = await getDicomFilesInfo(dicomPath);
        res.status(200).json(extractionResult.extractedFiles);
      } else {
        res.status(500).json({ error: extractionResult.errors });
      }
    } catch (error) {
      console.error("Error uploading DICOM files", error);
      res.status(500).json({ error: `Error uploading DICOM files: ${error}` });
    }
  }
);

router.get("/:folderName/dicom/:dicomUuid/download", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const dicomPath = path.join(folderPath, "dicom", dicomUuid);

    const dicomFound = await folderExists(dicomPath);
    if (!dicomFound) {
      return res.status(404).json({ error: "DICOM file not found" });
    }

    const dicomFile = await getDicomFileInfo(dicomPath);

    if (dicomFile === null) {
      return res.status(404).json({ error: "DICOM file not found" });
    }

    const downloadFile = path.resolve(dicomPath, dicomFile.fileName);
    res.download(downloadFile);
  } catch (err) {
    console.error("Error downloading DICOM file:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:folderName/dicom/:dicomUuid", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const dicomPath = path.join(folderPath, "dicom", dicomUuid);

    const dicomFound = await folderExists(dicomPath);
    if (!dicomFound) {
      return res.status(404).json({ error: "DICOM file not found" });
    }

    await fs.rm(dicomPath, { recursive: true });

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationFound = await annotationExists(annotationFilePath);
    if (annotationFound) {
      await fs.unlink(annotationFilePath);
    }

    res.status(200).json({ message: "DICOM file deleted successfully" });
  } catch (err) {
    console.error("Error deleting DICOM file:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:folderName/annotations", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { dicomUuid, annotationData } = req.body;
    if (!dicomUuid) {
      return res.status(400).json({ error: "DICOM UUID is required" });
    }
    if (!annotationData) {
      return res.status(400).json({ error: "Annotation data are required" });
    }

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationFound = await annotationExists(annotationFilePath);
    if (annotationFound) {
      return res.status(400).json({ error: "Annotation already exists" });
    }

    const annotationCreated = await createAnnotation(
      annotationFilePath,
      annotationData
    );

    // const annotationResult = await getAnnotation(annotationFilePath);

    if (annotationCreated) {
      res.status(201).json(annotationData);
    } else {
      res.status(500).json({ error: "Error while creating annotation" });
    }
  } catch (err) {
    console.error("Error retrieving annotation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:folderName/annotations/:dicomUuid", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationFound = await annotationExists(annotationFilePath);
    if (!annotationFound) {
      return res.status(404).json({ error: "Annotation not found" });
    }

    const annotationResult = await getAnnotation(annotationFilePath);

    if (annotationResult.error === null) {
      res.status(200).json(annotationResult.annotations);
    } else {
      res.status(500).json({ error: annotationResult.error });
    }
  } catch (err) {
    console.error("Error retrieving annotation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:folderName/annotations/:dicomUuid/download", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationFound = await annotationExists(annotationFilePath);
    if (!annotationFound) {
      return res.status(404).json({ error: "Annotation not found" });
    }

    res.download(annotationFilePath);
  } catch (err) {
    console.error("Error downloading annotation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:folderName/annotations/:dicomUuid", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { annotationData } = req.body;
    if (!annotationData) {
      return res.status(400).json({ error: "Annotation data are required" });
    }

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationCreated = await createAnnotation(
      annotationFilePath,
      annotationData
    );

    if (annotationCreated) {
      res.status(200).json(annotationData);
    } else {
      res.status(500).json({ error: "Error while updating annotation" });
    }
  } catch (err) {
    console.error("Error retrieving annotation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:folderName/annotations/:dicomUuid", async (req, res) => {
  const directoryPath = "./data/folders/";

  try {
    const { folderName, dicomUuid } = req.params;
    const folderPath = path.join(directoryPath, folderName);

    const folderFound = await folderExists(folderPath);
    if (!folderFound) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const annotationFilePath = path.join(
      folderPath,
      "annotations",
      `${dicomUuid.trim()}.json`
    );

    const annotationFound = await annotationExists(annotationFilePath);
    if (!annotationFound) {
      return res.status(404).json({ error: "Annotation not found" });
    }

    await fs.unlink(annotationFilePath);

    res.status(200).json({ message: "Annotation deleted successfully" });
  } catch (err) {
    console.error("Error retrieving annotation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router };
