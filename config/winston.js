const { format, createLogger, transports } = require("winston");

const logFormatDevelopment = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logFormatProduction = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: "info",
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({
            filename: "./logs/errorDefault.log",
            level: "error",
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        }),
        new transports.File({
            filename: "./logs/combinedDefault.log",
            level: "info",
            json: true,
        }),
    ],
    exitOnError: false,
    silent: false,
});

if (process.env.NODE_ENV === "development") {
    logger.format = format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYYMM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormatDevelopment
    ),
    logger.add(
        new transports.Console({
            format: format.simple(),
            level: "debug",
            colorize: true,
        })
    );
    logger.info("Started application in development mode")
} else if (process.env.NODE_ENV === "production") {
    logger.format = format.combine(
        format.errors({ stack: true }),
        logFormatProduction
    ),
    logger.add(
        new transports.File({
            filename: "./logs/productionCombined.log",
            level: "info",
            colorize: true,
        })
    );
    logger.info("Started application in production mode")
} else {
    logger.info("Started application in default mode")
}

//-----------------------------------

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
