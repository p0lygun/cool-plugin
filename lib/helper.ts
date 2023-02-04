import type * as BlocklyObject from "../node_modules/blockly/core/blockly.js";
import { logger } from "../main";

export function centerAndSelectBlock(block: BlocklyObject.Block) {
  (block as any).select();
  var mWs = window.mainWorkspace as any;
  var xy = block.getRelativeToSurfaceXY(); // Scroll the workspace so that the block's top left corner
  var m = mWs.getMetrics(); // is in the (0.2; 0.3) part of the viewport.
  mWs.scrollbar.set(
    xy.x * mWs.scale - m.contentLeft - m.viewWidth,
    xy.y * mWs.scale - m.contentTop - m.viewHeight * 0.1
  );
}

export function centerAndSelectBlockByID(id: string) {
  centerAndSelectBlock(window.mainWorkspace.getBlockById(id));
}

export async function listBlocksInModBlock(): Promise<BlocklyObject.Block[]> {
  const blocks = [];
  let block = window.modBlock.getChildren(false)[0];
  while (block) {
    blocks.push(block);
    block = block.nextConnection.targetBlock();
  }
  return blocks;
}

export function getRuleName(block: BlocklyObject.Block): string {
  if (block.type === "ruleBlock")
    return block.inputList[0].fieldRow[1].getValue();
}

export function mutationObserverWrapper(
  target: string | Node,
  callback: MutationCallback
) {
  const observer = new MutationObserver(callback),
    config = {
      childList: true,
      subtree: true,
    };
  observer.observe(typeof target === "string" ? $(target)[0] : target, config);
}

export function showStartupBanner() {
  logger.info(
    "\r\n\r\n   _____            _   _____  _             _           \r\n  / ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    / _ \\ / _ \\| | |  ___/| | | | |/ _` | | '_ \\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___/ \\___/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___/\r\n                                        __/ |            \r\n                                       |___/             \r\n\n              Adding spice to your logic editor"
  );
}
export function waitForElm(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
