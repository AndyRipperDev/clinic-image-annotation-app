import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = "./data/dicom/" + req.dicomUniqueDirectory + "/";
    file.path = path;
    fs.mkdirSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadStorage = multer({ storage: storage });

const preuploadMiddleware = (req, res, next) => {
  req.dicomUniqueDirectory = uuidv4();
  next();
};

export { uploadStorage, preuploadMiddleware };
