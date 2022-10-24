// File structure 
// consts variables
// helper functions
// Sub-Plugins
// SubPlugin Loader
// jquery loader (this calls sub plugin loader)

// const variables start
const BF2042SDK = BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c'),
        Blockly = _Blockly,
        mainWorkspace = Blockly.getMainWorkspace();
// const variables end
// helper functions start
class Logger {
    constructor (pluginName = '', showPluginName = false) {
        this.pluginName = pluginName;
        this.showPluginName = showPluginName;
    }

    fancyLog(message, color){
        if(!message){
            return
        }
        console.log(`${this.showPluginName ? `${this.pluginName} : ` : ''}%c${message}`, `color: ${color}`)
    }
    info(message){
        this.fancyLog(message , '#26FFDF')
    }
    warn(message){
        this.fancyLog(message , '#F26A1B')
    }
    critical(message){
        this.fancyLog(message , '#FF2C10')
    }
    
}
const logger = new Logger(BF2042SDK.manifest.name);

function showStartupBanner(){
    logger.info("\r\n\r\n   _____            _   _____  _             _           \r\n  \/ ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    \/ _ \\ \/ _ \\| | |  ___\/| | | | |\/ _` | | \'_ \\\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___\/ \\___\/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___\/\r\n                                        __\/ |            \r\n                                       |___\/             \r\n\n              Adding spice to your logic editor")
}
// helper functions ends
// sub plugins start
function listBlocks(){
    mainWorkspace.getAllBlocks().slice(1).forEach((block,index) => {
        console.log(`${index} ${block.inputList[0].fieldRow[1].getValue()}`)
    });
}
// sub plugins end
// loaders start
function loadSubPlugins(){
    showStartupBanner();
    listBlocks();
    logger.info("coolness loaded");
}
(function () {
    // Load the script
    if(typeof jQuery === 'undefined'){
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