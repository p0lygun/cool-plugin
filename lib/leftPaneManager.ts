import { logger, BF2042SDK } from "../main";
import { listRules, startListRulesChangeListner } from "../plugins/rulesList";
import { waitForElm } from "../lib/helper";

export function leftPluginPaneManager() {
  function populateleftPagePlugins() {
    (function () {
      logger.info("Starting Rules list plugin...");
      startListRulesChangeListner();
      listRules();
    })();
  }

  logger.info("Adding left plugin pannel");
  const div = $("<div></div>").load(
    BF2042SDK.getUrl("html/leftPluginPane.html"),
    function () {
      $(".blocklyScrollbarHorizontal").after(div.html());
    }
  );

  let leftIconContainer: undefined | JQuery<HTMLElement>;
  waitForElm("#leftPluginPage").then(function (elem) {
    const documentRoot = $(":root");
    documentRoot.css(
      "--leftPageMarginLeft",
      `${$(".blocklyToolboxDiv").width()}px`
    );
    documentRoot.css(
      "--collapsed-rule-bg-image-url",
      `url(${BF2042SDK.getUrl("static/images/rule_collapsed_no_name.svg")})`
    );
    documentRoot.css(
      "--left-arrow-svg-url",
      `url(${BF2042SDK.getUrl("static/images/left_arrow.svg")})`
    );
    populateleftPagePlugins();
    leftIconContainer = $("#leftPaneOpenIconContainer");
  });
  window.addEventListener("flyout_show_event", function (e: CustomEvent) {
    if (leftIconContainer) leftIconContainer.hide(0);
  });
  window.addEventListener("flyout_hide_event", function (e: CustomEvent) {
    if (leftIconContainer) leftIconContainer.show(0);
  });
}
