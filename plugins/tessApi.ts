import Tesseract, { createWorker, createScheduler } from "tesseract.js";
import { logger } from "../main";

export async function createTessWoker() {
  return await createWorker({ logger: (m) => {
    // console.log(m);    
    $('#tessLog').append(`<p>${m.status} ${m.progress.toFixed(2)*100}%</p>`);
  } });
}

export async function loadWorker(worker: Tesseract.Worker) {
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
}

export function createTessScheduler() {
  window.coolPlugins.tess.scheduler = createScheduler();
}


export async function doOCR(
  worker: Tesseract.Worker,
  image: string | HTMLImageElement | Blob | File
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

export function batchOCR(scheduler: Tesseract.Scheduler, images: string[]) {}