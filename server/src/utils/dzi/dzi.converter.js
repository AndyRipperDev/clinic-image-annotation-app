import sharp from "sharp";
import path from "path";
import fs from "node:fs/promises";
import dicomParser from "dicom-parser";
import dcmjsImaging from "dcmjs-imaging";
const { DicomImage, NativePixelDecoder } = dcmjsImaging;

const convertImageToDzi = async (
  inputFile,
  outputPath,
  overlap = 0,
  size = 256
) => {
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

const convertDicomToDzi = async (
  inputFile,
  outputPath,
  overlap = 2,
  size = 128
) => {
  try {
    const outputPathFile = path.join(outputPath, "output.dz");
    const dicomFileData = await fs.readFile(inputFile);
    const dicomFileDataParsed = dicomParser.parseDicom(dicomFileData);

    await NativePixelDecoder.initializeAsync();

    const image = new DicomImage(dicomFileDataParsed.byteArray.buffer);
    const renderingResult = image.render();
    const renderedPixels = renderingResult.pixels;
    const width = renderingResult.width;
    const height = renderingResult.height;

    await sharp(renderedPixels, {
      raw: {
        width: width,
        height: height,
        channels: 4,
      },
    })
      .toColourspace("rgb16")
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

export { convertImageToDzi, convertDicomToDzi };
