import log4js from "log4js";

log4js.configure({
    appenders: {
        console: {
            type: "console" 
        },

        //* Declaración
        warnFile: {
            type: "file",
            filename: "./logs/warn.log" 
        },
        errorFile: {
            type: "file",
            filename: "./logs/error.log"
        },

        //* Loggers
        loggerWarn: {
            appender: "warnFile",
            type: "logLevelFilter",
            level: "warn"
        },
        loggerError: {
            appender: "errorFile",
            type: "logLevelFilter",
            level: "error"
        }, 
        loggerConsole: {
            appender: "console",
            type: "logLevelFilter",
            level: "info"
        }
    },
    categories: {
        default: {
            appenders: [
                "loggerConsole",
                "loggerError",
                "loggerWarn", 
            ],
            level: "all"
        }
    }
});

const logger = log4js.getLogger()


export default logger;