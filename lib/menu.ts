import { logger, BF2042SDK } from "../main";

export function menuInitlizer() {
  const matTree = $("app-editor-menu mat-tree");
  if (matTree) {
    $.get(BF2042SDK.getUrl("html/leftMenuButton.html"), function (data) {
      matTree.append(data);
    }).done(function () {;
        const leftMenuButtonImage = $("#cool_leftMenuButtonImage");
        if (leftMenuButtonImage) {
            leftMenuButtonImage.attr("src", BF2042SDK.getUrl("static/images/leftMenuButton.svg"));
            $('#cool_leftMenuButton').on('click', function () {
                logger.info("Left Menu Button Clicked");
            });
        }
    });
  } else {
    logger.critical("Couldn't find root menu tree");
  }
}
