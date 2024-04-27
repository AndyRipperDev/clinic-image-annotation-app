import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "node:fs/promises";
import path from "path";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folderName = req.params.folderName;
    const dicomPath = `./data/folders/${folderName}/dicom/`;
    const annotationsPath = `./data/folders/${folderName}/annotations/`;

    await fs.mkdir(dicomPath, { recursive: true });
    await fs.mkdir(annotationsPath, { recursive: true });

    file.path = dicomPath;
    cb(null, dicomPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.dicomZipUniqueName + ext);
  },
});

const uploadStorage = multer({ storage: storage });

const preuploadMiddleware = (req, res, next) => {
  req.dicomZipUniqueName = uuidv4();
  next();
};

export { uploadStorage, preuploadMiddleware };
