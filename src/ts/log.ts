/**
 * Class for handling debug messages and performance logging.
 */
class TypesetBotLog {
    private _tsb: TypesetBot;
    
    debugMode:boolean = true;

    /**
     * The constructor.
     * 
     * @param tsb Instance of main class
     */
    constructor(tsb: TypesetBot) {
        this._tsb = tsb;
    }

    /**
     * Log messages if debug mode is on.
     * 
     * @param message The log message
     */
    log = function(message: any) {
        if (this.debugMode) {
            console.log('TypesetBot: %s', message);
            if (typeof message === 'object') {
                console.log(message);
            }
        }
    }

    /**
     * Log messages if debug mode is on.
     * 
     * @param message The log message
     */
    warn = function(message: any) {
        if (this.debugMode) {
            console.warn('TypesetBot: %s', message);
            if (typeof message === 'object') {
                console.warn(message);
            }
        }
    }

    /**
     * Log messages if debug mode is on or off.
     * 
     * @param message The log message
     */
    error = function(message: any) {
        console.error('TypesetBot: %s', message)
        if (typeof message === 'object') {
            console.error(message);
        }
    }

}
