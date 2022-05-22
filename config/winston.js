const { format, createLogger, transports } = require("winston");

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYYMM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormat
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File({
            filename: "./logs/error.log",
            level: "error",
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        }),
        new transports.File({
            filename: "./logs/combined.log",
            level: "info",
            json: true,
        }),
    ],
    exitOnError: false,
    silent: false,
});

if (process.env.NODE_ENV !== "production") {
    console.log("Started application in default mode");
    // logger.add(
    //     new transports.Console({
    //         format: format.simple(),
    //     })
    // );
} else {
    console.log("Started application in production mode");
}

logger.info("hey");

//-----------------------------------

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
