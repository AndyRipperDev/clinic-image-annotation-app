import multer from "multer";
import fs from "node:fs/promises";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folderName = req.params.folderName;
    const folderPath = `./data/folders/${folderName}/`;

    await fs.mkdir(folderPath, { recursive: true });

    file.path = folderPath;
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, "config.json");
  },
});

const folderConfigUploadStorage = multer({ storage: storage });

export { folderConfigUploadStorage };
