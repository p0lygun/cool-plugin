// File structure 
// declare types
// consts variables
// helper functions
// Sub-Plugins
// SubPlugin Loader
// jquery loader (this calls sub plugin loader)

// declaring types start
import type * as BlocklyObject  from './node_modules/blockly/core/blockly.js'
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

declare var BF2042Portal: BF2042PortalRuntimeSDK, _Blockly: BlocklyRuntime;

// declaring types end
// variables declare start
const BF2042SDK = BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c'),
        Blockly = _Blockly,
        mainWorkspace = Blockly.getMainWorkspace(),
        modBlock = mainWorkspace.getAllBlocks(false)[0];
let isScreenSupported = true;
// variables declare end
// helper functions start

class Logger {
    pluginName: string;
    showPluginName: boolean
    constructor (pluginName = '', showPluginName = false) {
        this.pluginName = pluginName;
        this.showPluginName = showPluginName;
    }

    fancyLog(message: string, color: string){
        if(!message){
            return
        }
        console.log(`${this.showPluginName ? `${this.pluginName} : ` : ''}%c${message}`, `color: ${color}`)
    }
    info(message: string){
        this.fancyLog(message , '#26FFDF')
    }
    warn(message: string){
        this.fancyLog(message , '#F26A1B')
    }
    critical(message: string){
        this.fancyLog(message , '#FF2C10')
    }
    
}
const logger = new Logger(BF2042SDK.manifest.name);

function mutationObserverWrapper(target: string| Node, callback:MutationCallback){
    const observer = new MutationObserver(callback),
        config = {
            childList: true,
            subtree: true
        }
        observer.observe(typeof target === 'string' ? $(target)[0] : target , config)
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


function showStartupBanner(){
    logger.info("\r\n\r\n   _____            _   _____  _             _           \r\n  \/ ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    \/ _ \\ \/ _ \\| | |  ___\/| | | | |\/ _` | | \'_ \\\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___\/ \\___\/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___\/\r\n                                        __\/ |            \r\n                                       |___\/             \r\n\n              Adding spice to your logic editor")
}
function listBlocksInModBlock(): BlocklyObject.Block[]{
    const blocks = []
    let currChild = modBlock.getChildren(false)[0]
    while(currChild){
        blocks.push(currChild)
        currChild = currChild.getChildren(false)[0]
    }
    // blocks.forEach((block) => {
    //     console.log(block.inputList[0].fieldRow[1].getValue())
    // })
    return blocks
}

// helper functions ends
// sub plugins start
function addleftPluginPane(){
    const div = $('<div></div>').load(BF2042SDK.getUrl('html/leftPluginPane.html'), function (){
        $('.blocklyScrollbarHorizontal').after(div.html())
    })
    
    waitForElm('#leftPluginPage').then(function (elem) {
        $(':root').css('--leftPageMarginLeft', `${$('.blocklyToolboxDiv').width()}px`)
    })
    
}

modBlock.setOnChange(function (event: BlockMove) {
    if(event.newParentId && event.type == Blockly.Events.BLOCK_MOVE){
        if(mainWorkspace.getBlockById(event.blockId).type === "ruleBlock")
            listBlocksInModBlock();
    }
})

function main(){
    mutationObserverWrapper('app-rules', function (mutationList, observer){
        for(const mutation of mutationList){
            if(mutation.type === 'childList'){
                if(document.getElementsByClassName('not-supported').length){ // required to build dynamic html again as DOM is recreated
                    isScreenSupported = false;
                } else {
                    if(!isScreenSupported){
                        addleftPluginPane();
                        isScreenSupported = true;
                    }
                }
            }
        }
    })
}


// sub plugins end
// loaders start
function loadSubPlugins(){
    showStartupBanner();
    addleftPluginPane();
    logger.info("coolness loaded");    
    main();
}
(function () {
    // Load the script
    if(typeof (window as any).jQuery === 'undefined'){
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
(window as any).modBlock = modBlock,
(window as any).listBlocksInModBlock = listBlocksInModBlock,
(window as any).addPane = addleftPluginPane
