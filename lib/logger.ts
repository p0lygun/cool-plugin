export class Logger {
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