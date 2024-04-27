import fs from "node:fs/promises";
import path from "path";

const getAnnotation = async (annotaionFilePath) => {
  let errMsg = null;
  let annotations = null;

  try {
    const data = await fs.readFile(annotaionFilePath, "utf8");

    annotations = JSON.parse(data);
  } catch (error) {
    errMsg = `Error reading/parsing JSON file: ${error}`;
  }

  return { annotations: annotations, error: errMsg };
};

const createAnnotation = async (annotaionFilePath, annotationData) => {
  try {
    await fs.writeFile(annotaionFilePath, annotationData, "utf8");
    return true;
  } catch (err) {
    return false;
  }
};

const annotationExists = async (annotaionFilePath) => {
  return await fs
    .access(annotaionFilePath)
    .then(() => true)
    .catch(() => false);
};

const getAnnotationChangedDate = async (annotaionFilePath) => {
  const annotationFound = await annotationExists(annotaionFilePath);

  if (annotationFound) {
    const stats = await fs.stat(annotaionFilePath);
    return stats.mtime;
  }

  return null;
};

export {
  getAnnotation,
  createAnnotation,
  annotationExists,
  getAnnotationChangedDate,
};
