const database = require("../database/database.js");
const httpServer = require("../httpServer.js");
const request = require("supertest");
const logger = require("../config/winston.js");
const assert = require("chai").assert;

let app;

//top level
describe("All tests", () => {
    // add a test hook
    before(() => {
        app = httpServer.getApp();
    });

    after(() => {
        try{
            logger.info("Shutting down application");
            database.closeDb();
        } catch(err){
            logger.error(err)
        }
    });

    describe.skip("Execute Application Tests", function () {
        require("./mochaTests/applicationTests");
    });
    describe.skip("Login Tests", function () {
        require("./mochaTests/loginTests");
    });
    describe("Public User Service Tests", function () {
        require("./mochaTests/publicUserTests");
    });
    describe.skip("User Service Tests", function () {
        require("./mochaTests/userTests");
    });
    describe.skip("Forum Thread Tests", function () {
        require("./mochaTests/forumThreadTests");
    });
    describe.skip("Forum Messages Tests", function () {
        require("./mochaTests/forumMessageTests");
    });
});
