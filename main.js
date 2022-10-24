"use strict";
// File structure 
// declare types
// consts variables
// helper functions
// Sub-Plugins
// SubPlugin Loader
// jquery loader (this calls sub plugin loader)
exports.__esModule = true;
// declaring types end
// const variables start
var BF2042SDK = BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c'), Blockly = _Blockly, mainWorkspace = Blockly.getMainWorkspace();
// const variables end
// helper functions start
var Logger = /** @class */ (function () {
    function Logger(pluginName, showPluginName) {
        if (pluginName === void 0) { pluginName = ''; }
        if (showPluginName === void 0) { showPluginName = false; }
        this.pluginName = pluginName;
        this.showPluginName = showPluginName;
    }
    Logger.prototype.fancyLog = function (message, color) {
        if (!message) {
            return;
        }
        console.log("".concat(this.showPluginName ? "".concat(this.pluginName, " : ") : '', "%c").concat(message), "color: ".concat(color));
    };
    Logger.prototype.info = function (message) {
        this.fancyLog(message, '#26FFDF');
    };
    Logger.prototype.warn = function (message) {
        this.fancyLog(message, '#F26A1B');
    };
    Logger.prototype.critical = function (message) {
        this.fancyLog(message, '#FF2C10');
    };
    return Logger;
}());
var logger = new Logger(BF2042SDK.manifest.name);
function showStartupBanner() {
    logger.info("\r\n\r\n   _____            _   _____  _             _           \r\n  \/ ____|          | | |  __ \\| |           (_)          \r\n | |     ___   ___ | | | |__) | |_   _  __ _ _ _ __  ___ \r\n | |    \/ _ \\ \/ _ \\| | |  ___\/| | | | |\/ _` | | \'_ \\\/ __|\r\n | |___| (_) | (_) | | | |    | | |_| | (_| | | | | \\__ \\\r\n  \\_____\\___\/ \\___\/|_| |_|    |_|\\__,_|\\__, |_|_| |_|___\/\r\n                                        __\/ |            \r\n                                       |___\/             \r\n\n              Adding spice to your logic editor");
}
// helper functions ends
// sub plugins start
function listBlocks() {
    mainWorkspace.getAllBlocks(false).slice(1).forEach(function (block, index) {
        console.log("".concat(index, " ").concat(block.inputList[0].fieldRow[1].getValue()));
    });
}
// sub plugins end
// loaders start
function loadSubPlugins() {
    showStartupBanner();
    listBlocks();
    logger.info("coolness loaded");
}
(function () {
    // Load the script
    if (typeof window.jQuery === 'undefined') {
        var script = document.createElement("script");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.type = 'text/javascript';
        script.addEventListener('load', function () {
            console.log("jQuery ".concat($.fn.jquery, " has been loaded successfully!"));
            loadSubPlugins();
        });
        document.head.appendChild(script);
    }
    else {
        loadSubPlugins();
    }
})();
// loaders end
