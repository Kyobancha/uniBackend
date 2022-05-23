const { assert } = require("chai");
const request = require("supertest");
const httpServer = require("../../httpServer.js");
const server = httpServer.getApp();
const { admin, manfred } = require("../testUtils/testUsers.js")
const winston = require("../../config/winston.js")
const testUtils = require("../testUtils/testUsers.js")
const user = require("../../endpoints/user/UserModel.js")

describe("testing GET function on /publicUsers", () => {
    it("should return an array with the admin as default user.", () => {
        return request(server)
            .get("/publicUsers")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return a 404 on a non-existing user", () => {
        return request(server)
            .get("/publicUsers/unknown")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should delete the admin user", () => {
        return request(server)
            .delete("/publicUsers/admin")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should return an empty array to prove that the admin was deleted", () => {
        return request(server)
            .get("/publicUsers/admin")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should return a 404 on the second attempt to delete the same user", () => {
        return request(server)
            .delete("/publicUsers/admin")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should add a new admin user", () => {
        return request(server)
            .post("/publicUsers")
            .send(admin)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should return the admin user", () => {
        return request(server)
            .get("/publicUsers/admin")
            .then((res) => {
                assert.hasAnyKeys(res.body, "userID", "userName", "password", "isAdministrator");
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should add a new user named 'manfred'", () => {
        return request(server)
            .post("/publicUsers")
            .send(manfred)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should not add the same user 'manfred' again", () => {
        return request(server)
            .post("/publicUsers")
            .send(manfred)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 405);
            });
    });
    it("should get both users 'admin' and 'manfred'", () => {
        return request(server)
            .get("/publicUsers")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.typeOf(res.body[1], "object");
                assert.hasAnyKeys(res.body[1], "userID", "userName", "password", "isAdministrator");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should update manfred", () => {
        return request(server)
            .put("/publicUsers/manfred")
            .send({
                userName: "tobias",
                password: "12345"
            })
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should return tobias", () => {
        return request(server)
            .get("/publicUsers/manfred")
            .then((res) => {
                assert.hasAnyKeys(res.body, "userID", "userName", "password", "isAdministrator");
                assert.equal(res.body.userID, "manfred")
                assert.equal(res.body.userName, "tobias")
                assert.equal(res.body.isAdministrator, false)
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should not add a user without a valid userID", () => {
        return request(server)
            .post("/publicUsers")
            .send( {} )
            .then((res) => {
                assert.doesNotHaveAnyKeys(res.body, "userID", "userName", "password", "isAdministrator");
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 400);
            });
    });
    it("should delete the admin user", () => {
        return request(server)
            .delete("/publicUsers/admin")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should delete manfred", () => {
        return request(server)
            .delete("/publicUsers/manfred")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("all entities should be deleted", () => {
        return request(server)
            .get("/publicUsers/")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
});

//testst direkt den Service Layer
// describe("Test Login mit Json-Body über Session-Service", function () {
//     it("Login with Json-Data via service", function () {
//         user = { ...require('../utils/loginUser1.json') }
//         sessionService.createSessionToken(user, function (err, token, user) {
//             expect(err).to.be.a('null');
//             expect(token).to.be.a('string');
//             expect(user).to.be.an('object');
//             if (user) {
//                 expect(user.userID).to.equal("tati");
//             }
//         })
//     });
// })