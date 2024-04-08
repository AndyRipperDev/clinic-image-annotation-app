import express from "express";
import dicom from "dicom-parser";
import dcmjsImaging from "dcmjs-imaging";
const { DicomImage, NativePixelDecoder } = dcmjsImaging;
import fsSync from "fs";
import sharp from "sharp";
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
  var dicomData = fsSync.readFileSync(
    "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/1000798_4091902_1.2.840.113564.10.1.2960895627300811770414919314614914422515843.dcm"
  );
  // var dicomData = fs.readFileSync(
  //   "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/1000798_4191091_1.3.51.0.7.2803000903.12511.46154.34320.56679.16182.44692.dcm"
  // );
  var dicomParsed = dicom.parseDicom(dicomData);
  var pixelData = dicomParsed.elements.x7fe00010;
  var pixelDataBuffer = dicom.sharedCopy(
    dicomData,
    pixelData.dataOffset,
    pixelData.length
  );

  console.log(dicomParsed);
  console.log(pixelData);
  console.log(pixelDataBuffer);

  // var pixelDataElement = dicomParsed.elements.x7fe00010;

  // // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
  // var pixelData2 = new Uint16Array(
  //   dicomParsed.byteArray.buffer,
  //   pixelDataElement.dataOffset,
  //   pixelDataElement.length / 2
  // );

  // console.log(pixelData2);

  await NativePixelDecoder.initializeAsync();

  // Create an ArrayBuffer with the contents of the DICOM P10 byte stream.
  const image = new DicomImage(dicomParsed.byteArray.buffer);

  // Render image.
  const renderingResult = image.render();

  // Rendered pixels in an RGBA ArrayBuffer.
  const renderedPixels = renderingResult.pixels;
  // Rendered width.
  const width = renderingResult.width;
  // Rendered height.
  const height = renderingResult.height;

  console.log(image);
  console.log(renderingResult);
  console.log(renderedPixels);

  try {
    const outputPathFile = path.join(
      "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/out",
      "output.dz"
    );
    // const outputPathFile = path.join(
    //   "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/out2",
    //   "output.dz"
    // );

    await sharp(renderedPixels, {
      raw: {
        width: width,
        height: height,
        channels: 4,
      },
    })
      .toColourspace("rgb16")
      .png()
      .tile({
        overlap: 2,
        size: 128,
      })
      .toFile(outputPathFile);
  } catch (error) {
    console.error(error);
  }

  // var dicomFileAsBuffer = fs.readFileSync(
  //   "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/1000798_4091902_1.2.840.113564.10.1.2960895627300811770414919314614914422515843.dcm"
  // );
  // var dicomData = dicom.parseDicom(dicomFileAsBuffer);

  // var pixelData = dicomData.elements.x7fe00010;

  // pixelDataBuffer = dicom.sharedCopy(dicomData, pixelData.dataOffset, pixelData.length);
  // console.log(pixelData);
  // console.log(pixelData.items[0]);

  // var dicomFileAsBuffer = fs.readFileSync(
  //   "E:/Dev/ImageAnotationApp/server/data/folders/folder1/DICOM/1000798_4191091_1.3.51.0.7.2803000903.12511.46154.34320.56679.16182.44692.dcm"
  // );
  // var dataSet = dicom.parseDicom(dicomFileAsBuffer);
  // var pixelData = dataSet.elements.x7fe00010;
  // console.log(pixelData);

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
      // Handle the uploaded zip file
      const zipFile = req.file;
      const zipFilePath = zipFile.path;

      // Create a directory to extract the files
      //const extractDir = path.join(__dirname, 'extracted', zipFile.originalname);
      //await fs.mkdir(extractDir, { recursive: true });

      // Read the uploaded zip file
      const data = await fs.readFile(zipFilePath);

      // Extract the zip file
      const zip = await JSZip.loadAsync(data);
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          try {
            const fileData = await zip.files[filename].async("nodebuffer");
            const uniqueDirectory = uuidv4(); // Generate unique directory name
            const outputFile = path.join(extractDir, uniqueDirectory, filename);
            const directoryPath = path.join(extractDir, uniqueDirectory);

            // Create unique directory
            await fs.mkdir(directoryPath, { recursive: true });
            // Write the extracted file into the unique directory
            await fs.writeFile(outputFile, fileData);

            const outputPath = "./data/dzi_images/" + uniqueDirectory + "/";
            const success = await convertDicomToDzi(outputFile, outputPath);
          } catch (error) {}
        })
      );

      // Get a list of extracted files
      // const extractedFiles = await fs.readdir(extractDir);

      // Do whatever you need with the extracted files (e.g., save them to a database, move them to another location, etc.)
      // For demonstration, let's log the file names
      // console.log("Extracted files:", extractedFiles);

      // Delete the uploaded zip file
      await fs.unlink(zipFilePath);

      //const { filename, path } = req.file;
      // const outputPath = "./data/dzi_images/" + req.dicomUniqueDirectory + "/";
      // const success = await convertImageToDzi(path, outputPath);

      // if (success) {
      res.status(200).json({
        message: "File uploaded successfully",
        fileUUID: req.dicomUniqueDirectory,
      });
      // } else {
      // res.status(500).json({ message: "Internal server error" });
      // }
    } catch (error) {
      console.error("Error uploading image", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// router.post(
//   "/upload",
//   preuploadMiddleware,
//   uploadStorage.single("uploaded_file"),
//   async (req, res) => {
//     try {
//       const { filename, path } = req.file;
//       const outputPath = "./data/dzi_images/" + req.dicomUniqueDirectory + "/";
//       const success = await convertImageToDzi(path, outputPath);

//       if (success) {
//         res.status(200).json({
//           message: "File uploaded successfully",
//           fileUUID: req.dicomUniqueDirectory,
//         });
//       } else {
//         res.status(500).json({ message: "Internal server error" });
//       }
//     } catch (error) {
//       console.error("Error uploading image", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

export { router };
