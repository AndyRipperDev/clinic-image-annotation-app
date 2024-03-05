import sharp from "sharp";
import path from "path";

const convertToDzi = async (inputFile, outputPath, overlap = 0, size = 256) => {
  try {
    const outputPathFile = path.join(outputPath, "output.dz");

    await sharp(inputFile)
      .png()
      .tile({
        overlap: overlap,
        size: size,
      })
      .toFile(outputPathFile);

    return true;
  } catch (error) {
    return false;
  }
};

export { convertToDzi };
