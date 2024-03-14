import express from "express";
import fs from "node:fs/promises";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Annotation API" });
});

router.get("/:id", async (req, res) => {
  //   const annotation = getById;

  const id = req.params.id;
  let errMsg = null;
  let annotations = null;

  try {
    const data = await fs.readFile(
      `./data/annotations/${id}/${id}.json`,
      "utf8"
    );

    // Parse the JSON data
    annotations = JSON.parse(data);
  } catch (error) {
    errMsg = `Error reading/parsing JSON file: ${error}`;
  }

  if (errMsg !== null) {
    res.status(404).json({ error: errMsg });
    return;
  }

  res.status(200).json(annotations);

  return;
  const annotation = [
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

  res.status(200).json(annotation);
});

router.post("/", async (req, res) => {
  let errMsg = null;

  console.log(req.body);
  //   console.log(JSON.parse(req.body));

  if (req.body?.imageUuid === undefined) {
    errMsg = "Image UUID is required";
    console.log(errMsg);
  }

  if (req.body?.annotations === undefined) {
    errMsg = "Annotations are required";
    console.log(errMsg);
  }

  if (errMsg !== null) {
    res.status(409).json({ error: errMsg });
    return;
  }

  const annotations = req.body.annotations;
  const imageUuid = req.body.imageUuid;
  console.log(annotations);

  await fs
    .mkdir(`./data/annotations/${imageUuid}`, { recursive: true })
    .catch(console.error);

  await fs.writeFile(
    `./data/annotations/${imageUuid}/${imageUuid}.json`,
    annotations,
    "utf8"
  );

  res.status(201).json(annotations);
  //   res.status(200).json({ message: "Annotation API" });
});

router.put("/:id", async (req, res) => {
  let errMsg = null;
  const id = req.params.id;

  if (req.body?.annotations === undefined) {
    errMsg = "Annotations are required";
  }

  if (errMsg !== null) {
    res.status(409).json({ error: errMsg });
    return;
  }

  const annotations = req.body.annotations;

  await fs.writeFile(
    `./data/annotations/${id}/${id}.json`,
    annotations,
    "utf8"
  );

  res.status(201).json(annotations);
});

router.delete("/:id", async (req, res) => {
  const annotation = req.body.annotation;

  res.status(200).json(annotation);
});

export { router };
