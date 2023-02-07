import { createTessWoker, loadWorker, doOCR } from "./tessApi";
import { BF2042SDK, logger } from "../main";

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
  if ($("#cool_plugin_coord").length >= 0) {
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
      $("#btnAddBlocks").on("click", function () {
        $(".coordinates").each(function (index, elm) {
          const element = $(elm);
          if (element.attr("data-bad-image") == "true") return;
          addVectorBlock(extractCoordinates(element.text()))
        });
      });
    });
  }
}

function addVectorBlock(coords: Array<number>) {
  const blockXML = `
  <xml xmlns="https://developers.google.com/blockly/xml">
	<block  type="CreateVector" x="0" y="0">
		<value name="VALUE-0">
			<block type="Number">
				<field name="NUM">${coords[0]}</field>
			</block>
		</value>
		<value name="VALUE-1">
			<block type="Number">
				<field name="NUM">${coords[1]}</field>
			</block>
		</value>
		<value name="VALUE-2">
			<block type="Number">
				<field name="NUM">${coords[2]}</field>
			</block>
		</value>
	</block>
  </xml>
  `;
  const xmlDom = _Blockly.Xml.textToDom(blockXML);
  _Blockly.Xml.domToWorkspace(xmlDom, _Blockly.getMainWorkspace());
}

export function extractCoordinates(text: string) {
  const regex = new RegExp($("#regexFormat").val() as string, "ig");
  let matches: Array<any>;
  matches = regex.exec(text);
  matches = matches.filter((item) => parseFloat(item)); // remove empty items
  if (matches) {
    return matches;
  }
  return null;
}

(window as any).extractCoordinates = extractCoordinates;

export async function startTess() {
  if (!window.coolPlugins.tess.worker) {
    window.coolPlugins.tess.worker = await createTessWoker();
    await loadWorker(window.coolPlugins.tess.worker);
  }

  for (const key in window.coolPlugins.tess.images) {
    const blob = window.coolPlugins.tess.images[key];
    const {
      data: { text },
    } = await window.coolPlugins.tess.worker.recognize(blob);
    if (text.length > 0) {
      $(`#${key}-coord`).text(text);
    } else {
      $(`#${key}-coord`).text("No coordinates found");
      $(`#${key}-coord`).attr("data-bad-image", "true");
    }
  }
}
export async function tessOCR(image: string | HTMLImageElement | Blob | File) {
  return await doOCR(window.coolPlugins.tess.worker, image);
}
