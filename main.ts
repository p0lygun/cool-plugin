// File structure 
// declare types
// consts variables
// helper functions
// Sub-Plugins
// SubPlugin Loader
// jquery loader (this calls sub plugin loader)

// declaring types start
import type * as BlocklyObject  from './node_modules/blockly/core/blockly.js'
import { Abstract } from './node_modules/blockly/core/events/events_abstract.js'
import { BlockMove } from './node_modules/blockly/core/events/events_block_move.js'
import { append } from './node_modules/blockly/core/serialization/blocks.js'
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
// const variables start
const BF2042SDK = BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c'),
        Blockly = _Blockly,
        mainWorkspace = Blockly.getMainWorkspace(),
        modBlock = mainWorkspace.getAllBlocks(false)[0];
// const variables end
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

function showStartupBanner(){
    logger.info("\r\n\r\n   _____            _   _____  _             _           \r\n  \/ ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    \/ _ \\ \/ _ \\| | |  ___\/| | | | |\/ _` | | \'_ \\\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___\/ \\___\/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___\/\r\n                                        __\/ |            \r\n                                       |___\/             \r\n\n              Adding spice to your logic editor")
}
// helper functions ends
// sub plugins start
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



modBlock.setOnChange(function (event: BlockMove) {
    if(event.newParentId && event.type == Blockly.Events.BLOCK_MOVE){
        if(mainWorkspace.getBlockById(event.blockId).type == "ruleBlock")
            listBlocksInModBlock();
    }
    
})

// sub plugins end
// loaders start
function loadSubPlugins(){
    showStartupBanner();
    listBlocksInModBlock();
    logger.info("coolness loaded");
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
(window as any).listBlocksInModBlock = listBlocksInModBlock
