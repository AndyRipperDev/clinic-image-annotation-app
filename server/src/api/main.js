import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Annotation API" });
});

export { router };
