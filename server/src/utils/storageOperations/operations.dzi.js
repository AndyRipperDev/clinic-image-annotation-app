import fs from "node:fs/promises";
import path from "path";
import { folderExists } from "./operations.folder.js";

const dicomFileDziExists = async (dicomUuid) => {
  const dziPath = "./data/dzi_images/" + dicomUuid + "/";
  return await folderExists(dziPath);
};

const deleteDicomFileDzi = async (dicomUuid) => {
  const dziPath = "./data/dzi_images/" + dicomUuid + "/";

  if (!(await folderExists(dziPath))) return false;

  try {
    await fs.rm(dziPath, { recursive: true });
  } catch (error) {
    return false;
  }

  return true;
};

const deleteFolderDicomFilesDzi = async (folderDirectoryPath) => {
  const dicomFolders = await fs.readdir(folderDirectoryPath, {
    withFileTypes: true,
  });
  const directories = dicomFolders.filter((dicomFolder) =>
    dicomFolder.isDirectory()
  );

  const results = await Promise.all(
    directories.map(async (directory) => {
      return await deleteDicomFileDzi(directory.name);
    })
  );

  const falseResults = results.filter((result) => !result);
  return falseResults.length === 0;
};

const getCreationDate = async (filePath) => {
  const { birthtime } = await fs.stat(filePath);
  return birthtime;
};

const getLastModifiedDate = async (filePath) => {
  const { mtime } = await fs.stat(filePath);
  return mtime;
};

const isOlderThanFileAgeHours = async (date, fileAgeDate) => {
  return date < fileAgeDate;
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getUnusedDicomUuids = async (maxAgeInHours = 168) => {
  const baseFolderPath = "./data/folders/";
  if (!(await folderExists(baseFolderPath))) return [];

  const now = new Date();
  const fileAgeDate = new Date(now.getTime() - maxAgeInHours * 60 * 60 * 1000);
  let dicomUuids = [];

  const folderNames = await fs.readdir(baseFolderPath, {
    withFileTypes: true,
  });

  for (let folderName of folderNames) {
    if (!folderName.isDirectory()) {
      continue;
    }
    const dicomFolderPath = path.join(baseFolderPath, folderName.name, "dicom");
    const annotationsFolderPath = path.join(
      baseFolderPath,
      folderName.name,
      "annotations"
    );

    const dicomUuidFolders = await fs.readdir(dicomFolderPath, {
      withFileTypes: true,
    });

    for (let dicomUuidFolder of dicomUuidFolders) {
      if (!dicomUuidFolder.isDirectory()) {
        continue;
      }
      const dicomFiles = await fs.readdir(
        path.join(dicomFolderPath, dicomUuidFolder.name)
      );
      if (dicomFiles.length !== 1 || !dicomFiles[0].endsWith(".dcm")) {
        continue;
      }
      const dicomFilePath = path.join(
        dicomFolderPath,
        dicomUuidFolder.name,
        dicomFiles[0]
      );

      const jsonFilePath = path.join(
        annotationsFolderPath,
        dicomUuidFolder.name + ".json"
      );
      const jsonFileExists = await fileExists(jsonFilePath);

      const dicomFileCreationDate = await getCreationDate(dicomFilePath);
      const jsonFileModifiedDate = jsonFileExists
        ? await getLastModifiedDate(jsonFilePath)
        : null;

      if (
        (await isOlderThanFileAgeHours(dicomFileCreationDate, fileAgeDate)) &&
        (!jsonFileExists ||
          (await isOlderThanFileAgeHours(jsonFileModifiedDate, fileAgeDate)))
      ) {
        dicomUuids.push(dicomUuidFolder.name);
      }
    }
  }

  return dicomUuids;
};

const deleteUnusedDicomUuids = async (maxAgeInHours = 168) => {
  const dicomUuids = await getUnusedDicomUuids(maxAgeInHours);

  if (dicomUuids.length === 0) return false;

  const results = await Promise.all(
    dicomUuids.map(async (dicomUuid) => {
      return await deleteDicomFileDzi(dicomUuid);
    })
  );

  const trueResults = results.filter((result) => result);
  return trueResults.length !== 0;
};

export {
  deleteDicomFileDzi,
  deleteFolderDicomFilesDzi,
  dicomFileDziExists,
  getUnusedDicomUuids,
  deleteUnusedDicomUuids,
};
