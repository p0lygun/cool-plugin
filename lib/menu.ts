import { logger, BF2042SDK } from "../main";
import { PlainDraggable } from "../static/js/plain-draggable.min.js";
import { loadCoordinateReader } from "../plugins/coordinatReader";
export function menuInitlizer() {
  logger.info("Initializing left plugins menu");
  const matTree = $("app-editor-menu mat-tree");
  if (matTree) {
    if ($("#cool_leftMenuButton").length === 0) {
      $.get(BF2042SDK.getUrl("html/leftMenuButton.html"), function (data) {
        matTree.append(data);
      }).done(function () {
        const leftMenuButtonImage = $("#cool_leftMenuButtonImage");
        if (leftMenuButtonImage) {
          leftMenuButtonImage.attr(
            "src",
            BF2042SDK.getUrl("static/images/leftMenuButton.svg")
          );
          $("#cool_leftMenuButton").on("click", leftMenuButtonCallback);
        }
      });
    } else {
      logger.warn("Left Menu Button already exists");
    }
  } else {
    logger.critical("Couldn't find root menu tree");
  }
}

function leftMenuButtonCallback() {
  leftMenuPopupHandler();
}
function leftMenuPopupHandler() {
  $("#leftMenuPane").length === 0
    ? makeLeftMenuPopup()
    : $("#leftMenuPane").css("visibility", "visible");
}
function makeLeftMenuPopup() {
  $.get(BF2042SDK.getUrl("html/leftMenu/popup.html"), function (data) {
    $(".content").append(data);
  }).done(function () {
    const leftMenuPane = $("#leftMenuPane");
    if (leftMenuPane) {
      const leftMenuPaneDragHandler = new PlainDraggable(leftMenuPane[0]);
      leftMenuPaneDragHandler.setOptions({
        handle: leftMenuPane.find("#leftMenuPaneTitlebar .draggable")[0],
      });
      $(".red-close").on("click", function () {
        leftMenuPane.css("visibility", "hidden");
      });
      leftMenuPane.show(200, function () {
        loadCoordinateReader();
      });
    }
  });
}
