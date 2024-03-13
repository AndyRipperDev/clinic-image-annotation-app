import express from "express";
import { convertToDzi } from "../utils/dzi/dzi.converter.js";
import {
  uploadStorage,
  preuploadMiddleware,
} from "../middleware/storage.middleware.js";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post(
  "/upload",
  preuploadMiddleware,
  uploadStorage.single("uploaded_file"),
  async (req, res) => {
    try {
      const { filename, path } = req.file;
      const outputPath = "./data/dzi_images/" + req.dicomUniqueDirectory + "/";
      const success = await convertToDzi(path, outputPath);

      if (success) {
        res.status(200).json({
          message: "File uploaded successfully",
          fileUUID: req.dicomUniqueDirectory,
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error uploading image", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/annotations", (req, res) => {
  const obj = [
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      type: "Annotation",
      body: [
        {
          type: "TextualBody",
          value: "ss",
          purpose: "tagging",
        },
      ],
      target: {
        source: "http://localhost:8080/undefined",
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value:
            "xywh=pixel:205.80043029785156,1585.39013671875,152.20655822753906,70.743896484375",
        },
      },
      id: "#ab6a05d3-0c3b-47bf-8b0d-a24b1ab79cee",
    },
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      type: "Annotation",
      body: [
        {
          type: "TextualBody",
          value: "sdsdsss",
          purpose: "tagging",
        },
      ],
      target: {
        source: "http://localhost:8080/undefined",
        selector: {
          type: "SvgSelector",
          value:
            '<svg><circle cx="870.3642883300781" cy="1648.630859375" r="184.44075799805285"></circle></svg>',
        },
      },
      id: "#eb6c57f6-a34b-409b-b342-cc3f53fb3f91",
    },
    {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      type: "Annotation",
      body: [
        {
          type: "TextualBody",
          value: "adad",
          purpose: "tagging",
        },
      ],
      target: {
        source: "http://localhost:8080/undefined",
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value:
            "xywh=pixel:788.901611328125,269.12493896484375,340.85693359375,370.8695068359375",
        },
      },
      id: "#6ab38859-ff95-4d5c-a9a1-70e48b609195",
    },
  ];

  res.status(200).json(obj);
});

export { router };
