import { createTessWoker, loadWorker, doOCR } from "./tessApi";
import { BF2042SDK, logger, Blockly } from "../main";

declare var Jimp: any;

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
        addImageToRead(event.target.files[0]);
      });
      if (localStorage.getItem("cool_plugin_regexFormat") == null) {
        localStorage.setItem(
          "cool_plugin_regexFormat",
          "X:([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[Ee]([+-]?\\d+))? Y:([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[Ee]([+-]?\\d+))? Z:([+-]?(?=\\.\\d|\\d)(?:\\d+)?(?:\\.?\\d*))(?:[Ee]([+-]?\\d+))?"
        );
      }
      $("#regexFormat").val(
        localStorage.getItem("cool_plugin_regexFormat") as string
      );
      $("#regexFormat").on("change input", function () {
        localStorage.setItem(
          "cool_plugin_regexFormat",
          $(this).val() as string
        );
      });
      $("#btnStartOCR").on("click", async function () {
        await startTess();
      });
      $("#btnAddBlocks").on("click", function () {
        $(".coordinates").each(function (index, elm) {
          const element = $(elm);
          if (element.attr("data-bad-image") == "true") return;
          addVectorBlock(extractCoordinates(element.text()));
        });
      });
    });
  }
}

document.addEventListener("paste", async (e) => {
  e.preventDefault();
  if ($("#leftMenuPane").css("visibility") != "visible") return;
  const clipboardItems =
    typeof navigator?.clipboard?.read === "function"
      ? await navigator.clipboard.read()
      : e.clipboardData.files;

  for (const clipboardItem of clipboardItems) {
    let blob;
    if ((clipboardItem as any).type?.startsWith("image/")) {
      // For files from `e.clipboardData.files`.
      blob = clipboardItem;
      // Do something with the blob.
      addImageToRead(blob);
    } else {
      // For files from `navigator.clipboard.read()`.
      const imageTypes = (clipboardItem as any).types?.filter((type) =>
        type.startsWith("image/")
      );
      for (const imageType of imageTypes) {
        blob = await (clipboardItem as any).getType(imageType);
        // Do something with the blob.
        addImageToRead(blob);
      }
    }
  }
});

function addImageToRead(image: File | Blob) {
  const fileUrl = URL.createObjectURL(image),
    uid = fileUrl.split("/").pop();
  if ($(`#${uid}`).length == 0) {
    $("#imageArea").append(
      `<div id="${uid}" class="coordinateContainer">
          <div class="coordImgContainer">
            <img class="coordImg" id="${uid}_img" src="${fileUrl}" alt="" />
          </div>
          <div id="${uid}_coord" class="coordinates" contenteditable="true"></div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
            alt=""
            width="15"
            onclick="return $(this).parent().remove();"
            style="cursor: pointer;"
          />
        </div>`
    );
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
  const xmlDom = Blockly.Xml.textToDom(blockXML);
  Blockly.Xml.domToWorkspace(xmlDom, Blockly.getMainWorkspace());
}

export function extractCoordinates(text: string) {
  const regex = new RegExp($("#regexFormat").val() as string, "ig");
  let matches: Array<any>;
  matches = regex.exec(text);
  if (matches) {
    matches = matches.filter((item) => parseFloat(item)); // remove empty items
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

  $(".coordImg").each(function (index, elm) {
    const element = $(elm);
    const id = element.attr("id").split("_")[0];
    Jimp.read({
      url: String(element.attr("src")),
    })
      .then((image) => {
        image
          .greyscale()
          .contrast(0.5)
          .invert()
          .getBase64("image/png", async (err, res) => {
            const {
              data: { text },
            } = await window.coolPlugins.tess.worker.recognize(res);
            const coord = $(`#${id}_coord`);
            if (text.length > 0) {
              coord.text(text);
            } else {
              coord.text("No coordinates found");
              coord.attr("data-bad-image", "true");
            }
          });
      })
      .catch((error) => {
        console.log(`Error loading image -> ${error}`);
      });
  });
}
export async function tessOCR(image: string | HTMLImageElement | Blob | File) {
  return await doOCR(window.coolPlugins.tess.worker, image);
}
