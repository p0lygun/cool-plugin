import type * as BlocklyObject from "../node_modules/blockly/core/blockly.js";
import { FlyoutSectionLabel, logger } from "../main";
export function searchWithCategory() {
  logger.info("loading searchWithCategory plugin....");
  $("input.searchbar")
    .remove()
    .clone()
    .appendTo("span.searchbarspan")
    .on("keyup", function (event: JQuery.KeyUpEvent) {
      setTimeout(function () {
        const ToolBox = (
          window.mainWorkspace as any
        ).getToolbox() as BlocklyObject.Toolbox;
        const result = ToolBox.getToolboxItems()[0];
        const input = ($("input.searchbar").val() as string).trim();
        if (input.length) {
          let flyoutContent = [],
            tempFlyoutContent = [];

          for (const [key, blocks] of Object.entries(window.allBlocks)) {
            tempFlyoutContent = [];
            const label: FlyoutSectionLabel = {
              kind: "LABEL",
              text: key,
            };
            tempFlyoutContent.push(label);
            blocks.forEach((block) => {
              if (
                block.displayName.toLowerCase().includes(input.toLowerCase())
              ) {
                tempFlyoutContent.push(block);
              }
            });
            if (tempFlyoutContent.length > 1) {
              flyoutContent = flyoutContent.concat(tempFlyoutContent);
            }
          }

          (result as any).updateFlyoutContents(flyoutContent);
          (result as any).show();
          ToolBox.setSelectedItem(result);
        } else {
          (result as any).hide();
        }
      }),
        100;
    });
}
