import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Annotation API" });
});

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
