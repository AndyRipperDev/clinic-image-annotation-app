import fs from "node:fs/promises";
import path from "path";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import { convertDicomToDzi } from "../../utils/dzi/dzi.converter.js";
import { getAnnotationChangedDate } from "./operations.annotations.js";

const getDicomFileInfo = async (dicomFilePath) => {
  const files = await fs.readdir(dicomFilePath);
  const annotationFilePath = dicomFilePath.replace("/dicom/", "/annotations/");
  const annotationFilePathBackslash = annotationFilePath.replace(
    "\\dicom\\",
    "\\annotations\\"
  );

  if (files.length === 1 && files[0].endsWith(".dcm")) {
    const fileName = files[0];
    const filePath = path.join(dicomFilePath, fileName);
    const stats = await fs.stat(filePath);
    const annotationChangedDate = await getAnnotationChangedDate(
      `${annotationFilePathBackslash}.json`
    );

    return {
      uuid: path.basename(dicomFilePath),
      fileName: fileName,
      created: stats.birthtime,
      lastAnnotaionDate: annotationChangedDate,
    };
  }

  return null;
};

const getDicomFilesInfo = async (dicomPath) => {
  const uuidFolders = await fs.readdir(dicomPath);

  const dicomFiles = await Promise.all(
    uuidFolders.map(async (uuidFolder) => {
      const uuidDicomPath = path.join(dicomPath, uuidFolder);

      return await getDicomFileInfo(uuidDicomPath);

      // const files = await fs.readdir(uuidDicomPath);

      // if (files.length === 1 && files[0].endsWith(".dcm")) {
      //   const fileName = files[0];
      //   const filePath = path.join(uuidDicomPath, fileName);
      //   const stats = await fs.stat(filePath);

      //   return {
      //     uuid: uuidFolder,
      //     fileName: fileName,
      //     created: stats.birthtime,
      //     changed: stats.mtime,
      //   };
      // } else {
      //   return null;
      // }
    })
  );

  return dicomFiles.filter((file) => file !== null);
};

const extractDicomFiles = async (extractDir, zipFile) => {
  const zipFilePath = zipFile.path;

  const data = await fs.readFile(zipFilePath);
  let errorsMess = "";
  let extractedFiles = [];

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

        const extractedFile = await getDicomFileInfo(directoryPath);
        if (extractedFile !== null) {
          extractedFiles.push(extractedFile);
        }

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

  return { extractedFiles: extractedFiles, errors: errorsMess };
};

export { getDicomFilesInfo, getDicomFileInfo, extractDicomFiles };
