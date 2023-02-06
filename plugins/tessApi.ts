import Tesseract, { createWorker } from "tesseract.js";
import { logger } from "../main";

export async function createTessWoker() {
  return await createWorker({ logger: (m) => console.log(m) });
}

export async function loadWorker(worker: Tesseract.Worker) {
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
}

export async function doOCR(
  worker: Tesseract.Worker,
  image: string | HTMLImageElement
) {
  if (worker) {
    const {
      data: { text },
    } = await worker.recognize(image);
    return text;
  } else {
    logger.critical("Worker not initialized");
  }
}
