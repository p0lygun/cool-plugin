import type * as BlocklyObject from "./node_modules/blockly/core/blockly.js";
type BlocklyRuntime = typeof BlocklyObject;

interface manifestObject {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage: string;
  main: string;
}
interface PluginInfo {
  baseUrl: string;
  manifest: manifestObject;
  getUrl(url: string): string;
  initializeWorkspace(): void;
}
interface PluginObject {
  getPlugin(id: string): PluginInfo;
}
interface BF2042PortalRuntimeSDK {
  Plugins: PluginObject;
}
type ToolBoxBlockItem = {
  blockxml: XMLDocument;
  displayName: string;
  kind: string;
  type: string;
};

export type FlyoutSectionLabel = {
  kind: string;
  text: string;
};

export const BF2042SDK = BF2042Portal.Plugins.getPlugin(
  "1650e7b6-3676-4858-8c9c-95b9381b7f8c"
);

import { Logger } from "./lib/logger";
export const logger = new Logger(BF2042SDK.manifest.name);

import { leftPluginPaneManager } from "./lib/leftPaneManager";
import { searchWithCategory } from "./plugins/searchWithCategory";
import { mutationObserverWrapper, showStartupBanner } from "./lib/helper";

declare global {
  interface Window {
    modBlock: BlocklyObject.Block;
    allBlocks: { [id: string]: ToolBoxBlockItem[] };
    mainWorkspace: BlocklyObject.Workspace;
    Blockly: BlocklyRuntime;
  }
  const logger: Logger;
}

declare var BF2042Portal: BF2042PortalRuntimeSDK, _Blockly: BlocklyRuntime;

const flyout_show_event = new CustomEvent("flyout_show_event", {
    detail: true,
  }),
  flyout_hide_event = new CustomEvent("flyout_hide_event", { detail: false });

let Blockly: BlocklyRuntime = undefined,
  mainWorkspace: BlocklyObject.Workspace = undefined,
  modBlock: BlocklyObject.Block = undefined,
  allBlocks: { [id: string]: ToolBoxBlockItem[] } = {},
  blocklyMutationObserver: MutationObserver = undefined,
  blockly_plugins_loaded = false,
  og_flyout_show = undefined;

function setBlocklyBaseVars() {
  logger.info("Setting Blockly Plugins Base variables...");
  (Blockly = _Blockly),
    (mainWorkspace = Blockly.getMainWorkspace() || undefined);
  if (mainWorkspace) {
    (modBlock = _Blockly
      .getMainWorkspace()
      .getBlocksByType("modBlock", false)[0]),
      (allBlocks = {});
    (mainWorkspace as any)
      .getToolbox()
      .toolboxDef_.contents.forEach((element) => {
        if (
          element.kind === "SEP" ||
          [
            "SEARCH RESULTS",
            "VARIABLES",
            "SUBROUTINES",
            "CONTROL ACTIONS",
          ].includes(element.name)
        ) {
          return;
        }
        element.contents.forEach((block: ToolBoxBlockItem) => {
          if (block.kind === "LABEL") {
            return;
          }
          if (!(element.name in allBlocks)) {
            allBlocks[element.name] = [block];
          } else {
            allBlocks[element.name].push(block);
          }
        });
      });
    let flyout = (mainWorkspace as any).getFlyout();
    og_flyout_show = flyout.setVisible;
    flyout.setVisible = showflyout;
    (window.modBlock = modBlock),
      (window.allBlocks = allBlocks),
      (window.mainWorkspace = mainWorkspace);
    window.Blockly = Blockly;
  }
}

function setGlobalPluginBaseVars() {
  logger.info("Setting Global Plugins Base variables...");
}

function showflyout(show: boolean) {
  og_flyout_show.call(this, show);
  window.dispatchEvent(show ? flyout_show_event : flyout_hide_event);
}

function blocklyPluginMain() {
  if (blocklyMutationObserver == undefined) {
    mutationObserverWrapper("app-rules", function (mutationList, observer) {
      blocklyMutationObserver = observer;
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          if (!document.getElementsByTagName("app-blockly").length) {
            // required to build dynamic html again as DOM is recreated
            if (blockly_plugins_loaded) {
              blockly_plugins_loaded = false;
              observer.disconnect();
              blocklyMutationObserver = undefined;
              logger.warn(
                "DOM recreated.... waiting to reload blockly specific plugins...."
              );
            }
          }
        }
      }
    });
  }
  blockly_plugins_loaded = true;
}

function loadSubPlugins() {
  // blockly dependednt plugins
  blockly_plugins_loaded = false;
  showStartupBanner();
  setGlobalPluginBaseVars();
  BF2042SDK.initializeWorkspace = function () {
    if (!blockly_plugins_loaded) {
      try {
        setBlocklyBaseVars();
        if (mainWorkspace) {
          leftPluginPaneManager();
          searchWithCategory();
        }
        blocklyPluginMain();
      } catch (error) {
        logger.critical("Failed loading plugin... " + error);
      }
    }
  };
  logger.info("coolnesss loaded");
  (window as any).cool_plugin_loaded = true;
}
(function () {
  // Load the script
  if (typeof (window as any).jQuery === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
    script.type = "text/javascript";
    script.addEventListener("load", () => {
      console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
      loadSubPlugins();
    });
    document.head.appendChild(script);
  } else {
    loadSubPlugins();
  }
})();
// loaders end
