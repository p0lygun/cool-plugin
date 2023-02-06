import { createTessWoker, loadWorker, doOCR } from "./tessApi";
import { BF2042SDK } from "../main";

export function loadCoordinateReader() {
  $.get(BF2042SDK.getUrl("html/coordinateReader.html"), function (data) {
    $("#leftMenuPane").find("#leftMenuContent").html(data);
  }).done(function () {
    $("#uploadImg").on("change", function (event: any) {
      $("#imageArea").append(
        `<div class="coordinateContainer">
        <div class="coordImgContainer">
          <img src="${URL.createObjectURL(event.target.files[0])}" alt="" />
        </div>
        <div class="coordinates" contenteditable="true"></div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt=""
          width="15"
          onclick="return this.parentNode.remove();"
          style="cursor: pointer;"
        />
      </div>`
      );
    });
  });
}

export async function startTess() {
  window.coolPlugins.tess = await createTessWoker();
  await loadWorker(window.coolPlugins.tess);
}
export function tessOCR(image: string | HTMLImageElement) {
  doOCR(window.coolPlugins.tess, image).then((text) => {
    console.log(text);
  });
}
