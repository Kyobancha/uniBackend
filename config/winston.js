const { format, createLogger, transports } = require("winston");

//utility function, so adding a transport takes less code
function configureTransportFile(filename, level){
    let fileSettings = {
        filename: "",
        level: "",
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    }

    fileSettings.filename = filename;
    fileSettings.level = level;
    return fileSettings;
}

//this is the logger instance that is going to be manipulated depending on the program environment
const logger = createLogger({
    level: "info",
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.File(configureTransportFile("./logs/default/errorDefault.log", "error")),
        new transports.File(configureTransportFile("./logs/default/combinedDefault.log", "info")),
    ],
    exitOnError: false,
    silent: false,
});

/*format.printf() gives access to all the content that is possible to log,
doesn't define HOW it is going to be defined though. That is done by logger.format.*/
const logFormatDevelopment = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logFormatProduction = format.printf(({ level, message, timestamp, stack }) => {
    if(!stack){
        jsonObject = {
            "time": timestamp,
            "level": level,
            "message": message
        }
        return JSON.stringify(jsonObject, null, 4)
    } else{
        jsonObject = {
            "time": timestamp,
            "level": level,
            "error": stack.split("\n    ")  //this is a characteristic of a stack that can be used to always display it as an array
        }
        return JSON.stringify(jsonObject, null, 4)
    }
});

//adding the wanted format and transports depending on the project environment 
if (process.env.NODE_ENV === "development") {
    logger.format = format.combine(
        //format.colorize(),                //colorizing lines only makes sense on the console, but not in files, since it will lead to additional special characters being logged
        format.timestamp({ format: "YYYYMM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormatDevelopment
    ),
    logger.add(new transports.File(configureTransportFile("./logs/development/developmentError.log", "error")));
    logger.add(new transports.File(configureTransportFile("./logs/development/developmentCombined.log", "info")));
    logger.add(new transports.File(configureTransportFile("./logs/development/developmentDebug.log", "debug")));

    //needed for morgan to write messages
    logger.stream = {
        write: function (message, encoding) {
            logger.info(message);
        },
    };
    logger.info("Started application in development mode")

} else if (process.env.NODE_ENV === "production") {
    //this format will be used for every message
    logger.format = format.combine(
        format.timestamp(),                 //this line is needed to get a concrete time stamp format. Omitting this line will lead into "undefined"
        format.errors({ stack: true }),     //omitting this line will lead into the error to appear as a regular string
        logFormatProduction                 //the content of what is supposed to be logged is defined in here
    ),
    //these are the files that will be written into
    logger.add(new transports.File(configureTransportFile("./logs/production/productionError.log", "error")));
    logger.add(new transports.File(configureTransportFile("./logs/production/productionCombined.log", "info")));
    
    //morgan will fire this code every time a http-request is made.
    //the raw message is filtered and transformed into JSON
    logger.stream = {
        write: (message, encoding) => {
            let messageElements = message.split(",");
            logger.info({
                "remote-addr": messageElements[0],
                "remote-user": messageElements[1],
                "date": messageElements[2],
                "method": messageElements[3],
                "url": messageElements[4],
                "http-version": messageElements[5],
                "status": messageElements[6],
                "content-length": messageElements[7],
                "referrer": messageElements[8],
                "user-agent": messageElements[9].split("\n")[0] // this needs to be done since the last entry of the message always ends with an "\n"
            });
        },
    };
    logger.info("Started application in production mode")
    
} else {
    logger.info("Started application in default mode. This is unusual. You might want to start your application in development or production environment instead.")
}




module.exports = logger;
