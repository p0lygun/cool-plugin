// File structure 
// declare types
// consts variables
// helper functions
// Sub-Plugins
// SubPlugin Loader
// jquery loader (this calls sub plugin loader)

// declaring types start
import type * as BlocklyObject from './node_modules/blockly/core/blockly.js'
import { BlockMove } from './node_modules/blockly/core/events/events_block_move.js'
type BlocklyRuntime = typeof BlocklyObject
interface manifestObject {
    id: string,
    name: string,
    version: string,
    description: string,
    author: string,
    homepage: string,
    main: string
}
interface PluginInfo {
    baseUrl: string,
    manifest: manifestObject,
    getUrl(url: string): string

}
interface PluginObject {
    getPlugin(id: string): PluginInfo
}
interface BF2042PortalRuntimeSDK {
    Plugins: PluginObject
}
type ToolBoxBlockItem = {
    blockxml: XMLDocument,
    displayName: string,
    kind: string,
    type: string;
}

type FlyoutSectionLabel = {
    kind: string,
    text: string
}

declare var BF2042Portal: BF2042PortalRuntimeSDK, _Blockly: BlocklyRuntime;

// declaring types end
// variables declare start
const BF2042SDK = BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c');

let Blockly: BlocklyRuntime, 
    mainWorkspace: BlocklyObject.Workspace, 
    modBlock: BlocklyObject.Block, 
    allBlocks: {[id: string]: ToolBoxBlockItem[]} = {},
    isScreenSupported = true;

// variables declare end
// helper functions start
function setBaseVars(){
    logger.info('Setting Base Varialbes...')
    Blockly = _Blockly,
    mainWorkspace = Blockly.getMainWorkspace(),
    modBlock = _Blockly.getMainWorkspace().getBlocksByType('modBlock', false)[0],
    allBlocks = {};
    (mainWorkspace as any).getToolbox().toolboxDef_.contents.forEach(element => {
        if(element.kind === "SEP" || ["SEARCH RESULTS", "VARIABLES", "SUBROUTINES", "CONTROL ACTIONS"].includes(element.name)){
            return
        }
        element.contents.forEach((block: ToolBoxBlockItem)  => {
            if(block.kind === "LABEL"){
                return
            }
            if(!(element.name in allBlocks)){
                allBlocks[element.name] = [block]
            } else {
                allBlocks[element.name].push(block)
            }
        })


    });
    modBlock.setOnChange(function (event: BlockMove) {
        if (event.type == Blockly.Events.BLOCK_MOVE) {
            if (mainWorkspace.getBlockById(event.blockId).type === "ruleBlock"){ 
                handelExperienceRulesListing(); 
            }  
        }
    });
    (window as any).modBlock = modBlock,
    (window as any).allBlocks = allBlocks,
    (window as any).listBlocksInModBlock = listBlocksInModBlock,
    (window as any).addPane = addleftPluginPane,
    (window as any).handelExperienceRulesListing = handelExperienceRulesListing


}

class Logger {
    pluginName: string;
    showPluginName: boolean
    constructor(pluginName = '', showPluginName = false) {
        this.pluginName = pluginName;
        this.showPluginName = showPluginName;
    }

    fancyLog(message: string, color: string) {
        if (!message) {
            return
        }
        console.log(`${this.showPluginName ? `${this.pluginName} : ` : ''}%c${message}`, `color: ${color}`)
    }
    info(message: string) {
        this.fancyLog(message, '#26FFDF')
    }
    warn(message: string) {
        this.fancyLog(message, '#F26A1B')
    }
    critical(message: string) {
        this.fancyLog(message, '#FF2C10')
    }

}
const logger = new Logger(BF2042SDK.manifest.name);

function mutationObserverWrapper(target: string | Node, callback: MutationCallback) {
    const observer = new MutationObserver(callback),
        config = {
            childList: true,
            subtree: true
        }
    observer.observe(typeof target === 'string' ? $(target)[0] : target, config)
}
function showStartupBanner() {
    logger.info("\r\n\r\n   _____            _   _____  _             _           \r\n  \/ ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    \/ _ \\ \/ _ \\| | |  ___\/| | | | |\/ _` | | \'_ \\\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___\/ \\___\/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___\/\r\n                                        __\/ |            \r\n                                       |___\/             \r\n\n              Adding spice to your logic editor")
}

function waitForElm(selector: string) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
async function listBlocksInModBlock(): Promise<BlocklyObject.Block[]> {
    const blocks = []
    let block = modBlock.getChildren(false)[0]
    while(block){
        blocks.push(block)
        block = block.nextConnection.targetBlock()
    }
    return blocks
}
function getRuleName(block: BlocklyObject.Block): string {
    if (block.type === 'ruleBlock')
        return block.inputList[0].fieldRow[1].getValue()
}
function centerAndSelectBlock(block: BlocklyObject.Block) {
    (block as any).select();
    var mWs = (mainWorkspace as any)
    var xy = block.getRelativeToSurfaceXY();	// Scroll the workspace so that the block's top left corner
    var m = mWs.getMetrics();					// is in the (0.2; 0.3) part of the viewport.
    mWs.scrollbar.set( xy.x * mWs.scale - m.contentLeft - m.viewWidth, xy.y * mWs.scale - m.contentTop  - m.viewHeight * 0.1);
}
function centerAndSelectBlockByID(id: string) {
    centerAndSelectBlock(mainWorkspace.getBlockById(id))
}
// helper functions ends
// sub plugins start
function addleftPluginPane() {
    logger.info('Adding left plugin pannel')
    const div = $('<div></div>').load(BF2042SDK.getUrl('html/leftPluginPane.html'), function () {
        $('.blocklyScrollbarHorizontal').after(div.html())
    })

    waitForElm('#leftPluginPage').then(function (elem) {
        const documentRoot = $(':root')
        documentRoot.css('--leftPageMarginLeft', `${$('.blocklyToolboxDiv').width()}px`)
        documentRoot.css('--collapsed-rule-bg-image-url', `url(${BF2042SDK.getUrl('static/images/rule_collapsed_no_name.svg')})`)
        documentRoot.css('--left-arrow-svg-url', `url(${BF2042SDK.getUrl('static/images/left_arrow.svg')})`)
        populateleftPagePlugins();
    })

}

function populateleftPagePlugins(){
    logger.info('Starting Rules list plugin...')
    handelExperienceRulesListing()
}

function handelExperienceRulesListing() {
    const rulesListContaier = $('.collapsedRuleContainer')
    if (rulesListContaier.length) {
        rulesListContaier.children('.collapsedRule').remove()
        listBlocksInModBlock().then(blocks => {
            blocks.forEach((block, index) => {
            const ruleCollapsedBlock = $('<div>', { 
                class: 'collapsedRule',
                "data-block-id": block.id,
            }).append($('<div>').text(index + 1)).append($('<div>').text(getRuleName(block)))
            
            ruleCollapsedBlock.on('click touch',function(){
                centerAndSelectBlockByID(this.getAttribute("data-block-id"))
            })

            ruleCollapsedBlock.appendTo(rulesListContaier)
        })})
    }
}

function searchWithCategoryPlugin(){
    logger.info('loading searchWithCategory plugin....')
    $('input.searchbar').remove().clone().appendTo('span.searchbarspan').on('keyup', function (event: JQuery.KeyUpEvent) {
        setTimeout(
            function(){
               const ToolBox = ((mainWorkspace as any).getToolbox() as BlocklyObject.Toolbox);
                const result = ToolBox.getToolboxItems()[0];
                const input = ($('input.searchbar').val() as string).trim();
                if(input.length){
                    let flyoutContent = [],
                        tempFlyoutContent = [];
                    
                    for (const [key, blocks] of Object.entries(allBlocks)) {
                        tempFlyoutContent = []
                        const label: FlyoutSectionLabel = {
                            kind: "LABEL",
                            text: key
                        };
                        tempFlyoutContent.push(label)
                        blocks.forEach(block => {
                            if(block.displayName.toLowerCase().includes(input.toLowerCase())){
                                tempFlyoutContent.push(block)
                            }
                        })
                        if(tempFlyoutContent.length > 1){
                            flyoutContent = flyoutContent.concat(tempFlyoutContent)
                        }
                    }                    

                    (result as any).updateFlyoutContents(flyoutContent);
                    (result as any).show()
                    ToolBox.setSelectedItem(result)
                }else{
                    (result as any).hide()
                } 
            }
        ), 100
    })
}
function reloadPlugins(){
    logger.warn('DOM recreated.... reloading plugins...')
    setBaseVars();
    addleftPluginPane();
    searchWithCategoryPlugin();
}
function main() {
    mutationObserverWrapper('app-rules', function (mutationList, observer) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                if (document.getElementsByTagName('app-blockly').length) { // required to build dynamic html again as DOM is recreated
                    if (!isScreenSupported) {
                        reloadPlugins();
                        isScreenSupported = true;
                    }
                } else {
                    isScreenSupported = false;                    
                }
            }
        }
    })
}


// sub plugins end
// loaders start
function loadSubPlugins() {
    setBaseVars();
    showStartupBanner();
    addleftPluginPane();
    logger.info("coolness loaded");
    searchWithCategoryPlugin();
    main();
    (window as any).cool_plugin_loaded = true
}
(function () {
    // Load the script
    if (typeof (window as any).jQuery === 'undefined') {
        const script = document.createElement("script");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.type = 'text/javascript';
        script.addEventListener('load', () => {
            console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
            loadSubPlugins();
        });
        document.head.appendChild(script);
    } else {
        loadSubPlugins();
    }

})();
// loaders end