import fs from "node:fs/promises";
import path from "path";
import { getDicomFilesInfo } from "./operations.dicom.js";

const createFolder = async (folderPath) => {
  try {
    await fs.mkdir(folderPath, { recursive: true });

    const dicomPath = `${folderPath}/dicom/`;
    const annotationsPath = `${folderPath}/annotations/`;

    await fs.mkdir(dicomPath, { recursive: true });
    await fs.mkdir(annotationsPath, { recursive: true });
    return true;
  } catch (err) {
    return false;
  }
};

const getFolderDicomFilesCount = async (folderPath) => {
  const dicomPath = path.join(folderPath, "dicom");
  let dicomFilesCount = 0;
  try {
    const dicomFilesInfo = await getDicomFilesInfo(dicomPath);
    dicomFilesCount = dicomFilesInfo.length;
  } catch (error) {
    dicomFilesCount = 0;
  }

  return dicomFilesCount;
};

const getFoldersStats = async (directoryPath) => {
  const files = await fs.readdir(directoryPath, { withFileTypes: true });
  const directories = files.filter((file) => file.isDirectory());

  return await Promise.all(
    directories.map(async (directory) => {
      const folderPath = path.join(directoryPath, directory.name);
      // const dicomPath = path.join(folderPath, "dicom");
      const dicomFilesCount = await getFolderDicomFilesCount(folderPath);
      // try {
      //   const dicomFilesInfo = await getDicomFilesInfo(dicomPath);
      //   dicomFilesCount = dicomFilesInfo.length;
      // } catch (error) {
      //   dicomFilesCount = 0;
      // }

      const stats = await fs.stat(folderPath);
      return {
        name: directory.name,
        created: stats.birthtime,
        changed: stats.mtime,
        dicomFilesCount: dicomFilesCount,
      };
    })
  );
};

const getFolderStats = async (folderPath) => {
  const stats = await fs.stat(folderPath);
  const dicomFilesCount = await getFolderDicomFilesCount(folderPath);
  return {
    name: path.basename(folderPath),
    created: stats.birthtime,
    changed: stats.mtime,
    dicomFilesCount: dicomFilesCount,
  };
};

const folderExists = async (folderPath) => {
  return await fs
    .stat(folderPath)
    .then(() => true)
    .catch(() => false);
};

export { createFolder, getFoldersStats, getFolderStats, folderExists };
