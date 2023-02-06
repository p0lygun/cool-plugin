import {
  createTessWoker,
  loadWorker,
  createTessScheduler,
  doOCR,
} from "./tessApi";
import { BF2042SDK } from "../main";

export const fetchAsBlob = (url: string) =>
  fetch(url).then((response) => response.blob());

export const convertBlobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export function loadCoordinateReader() {
  $.get(BF2042SDK.getUrl("html/coordinateReader.html"), function (data) {
    $("#leftMenuPane").find("#leftMenuContent").html(data);
  }).done(function () {
    $("#uploadImg").on("change", function (event: any) {
      const fileUrl = URL.createObjectURL(event.target.files[0]);
      if (!window.coolPlugins.tess.images.hasOwnProperty(fileUrl)) {
        const uid = fileUrl.split("/").pop();
        window.coolPlugins.tess.images[uid] = event.target.files[0];
        $("#imageArea").append(
          `<div id="${uid}" class="coordinateContainer">
          <div class="coordImgContainer">
            <img id="${uid}-img" src="${fileUrl}" alt="" />
          </div>
          <div id="${uid}-coord" class="coordinates" contenteditable="true"></div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
            alt=""
            width="15"
            onclick="return removeCoordinateContainer(this);"
            style="cursor: pointer;"
          />
        </div>`
        );
      }
    });
    $("#btnStartOCR").on("click", async function () {
      await startTess();
    });
  });
}

export async function startTess() {
  if (!window.coolPlugins.tess.worker) {
    window.coolPlugins.tess.worker = await createTessWoker();
    await loadWorker(window.coolPlugins.tess.worker);
  }
  if(!window.coolPlugins.tess.scheduler){
    createTessScheduler();
  }
  if (window.coolPlugins.tess.scheduler && window.coolPlugins.tess.worker) {
    window.coolPlugins.tess.scheduler.addWorker(window.coolPlugins.tess.worker);
  }
  
  

  for(const key in window.coolPlugins.tess.images){
    const blob = window.coolPlugins.tess.images[key];
    const {data: {text}} = await window.coolPlugins.tess.worker.recognize(blob);
    $(`#${key}-coord`).text(text);
  }
    
}
export async function tessOCR(image: string | HTMLImageElement | Blob | File) {
  return await doOCR(window.coolPlugins.tess.worker, image);
}
