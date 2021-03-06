const { assert } = require("chai");
const request = require("supertest");
const httpServer = require("../../httpServer.js");
const server = httpServer.getApp();
const { admin, manfred } = require("../testUtils/testUsers.js")
const AuthenticationService = require("../../endpoints/authentication/AuthenticationService")

let adminToken;
let manfredToken;

describe("testing GET function on /users", () => {
    it("should return 401.", () => {
        return request(server)
            .get("/users")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 401);
            });
    });
    it("should not authenticate the admin with wrong credentials", () => {
        return request(server)
            .get("/authenticate")
            .auth("admin", "wrong password")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 401);
            });
    });
    it("should authenticate the admin", () => {
        return request(server)
            .get("/authenticate")
            .auth(admin.userID, admin.password)
            .then(async (res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
                adminToken = await AuthenticationService.createToken(admin)
            });
    });
    it("should return all users", () => {
        return request(server)
            .get("/users/")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return a 404 on a non-existing user", () => {
        return request(server)
            .get("/users/unknown")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should return the admin user", () => {
        return request(server)
            .get("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should delete the admin user", () => {
        return request(server)
            .delete("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should return an empty array to prove that the admin was deleted", () => {
        return request(server)
            .get("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should return a 404 on the second attempt to delete the same user", () => {
        return request(server)
            .delete("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should add a new admin user", () => {
        return request(server)
            .post("/users")
            .send(admin)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should return the admin user", () => {
        return request(server)
            .get("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.hasAnyKeys(res.body, "userID", "userName", "password", "isAdministrator");
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should add a new user named 'manfred'", () => {
        return request(server)
            .post("/users")
            .send(manfred)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should not authenticate the user 'manfred' with wrong credentials", () => {
        return request(server)
            .post("/users")
            .send(manfred)
            .auth(manfred.userID, "Wrong password")
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 401);
            });
    });
    it("should authenticate the user 'manfred' with correct credentials", () => {
        return request(server)
            .get("/authenticate")
            .auth(manfred.userID, manfred.password)
            .then(async (res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
                manfredToken = await AuthenticationService.createToken(manfred)
            });
    });
    it("should get 403, since Manfred's is no administrator and therefore unauthorized", () => {
        return request(server)
            .get("/users")
            .set('Authorization', 'Bearer ' + manfredToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                
                assert.equal(res.statusCode, 403);
            });
    });
    it("should get manfred. Password should not be included in response", () => {
        return request(server)
            .get("/users/manfred")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.doesNotHaveAnyKeys(res.body, "password");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should update manfred with adminToken", () => {
        return request(server)
            .put("/users/manfred")
            .set('Authorization', 'Bearer ' + adminToken)
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
            .get("/users/manfred")
            .set('Authorization', 'Bearer ' + adminToken)
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
            .post("/users")
            .send( {} )
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.doesNotHaveAnyKeys(res.body, "userID", "userName", "password", "isAdministrator");
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 400);
            });
    });
    it("should delete the admin user", () => {
        return request(server)
            .delete("/users/admin")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should delete manfred", () => {
        return request(server)
            .delete("/users/manfred")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("all entities should be deleted", () => {
        return request(server)
            .get("/users/")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
});