const { assert } = require("chai");
const request = require("supertest");
const httpServer = require("../../httpServer.js");
const server = httpServer.getApp();
const { admin, manfred } = require("../testUtils/testUsers.js")
const { forumThread1, forumThread2, forumThread3 } = require("../testUtils/testForumThreads.js")
const AuthenticationService = require("../../endpoints/authentication/AuthenticationService")
const ForumThreadService = require("../../endpoints/forumThread/ForumThreadService")

let adminToken;
let manfredToken;

let forumThread1Id;
let forumThread2Id;
let forumThread3Id;

describe("testing /forumThreads", () => {
    it("should return all forumThreads even without token.", () => {
        return request(server)
            .get("/forumThreads")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
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
    it("should post a new user 'manfred'", () => {
        return request(server)
            .post("/users")
            .send(manfred)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
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
    it("should return all forumThreads", () => {
        return request(server)
            .get("/forumThreads/")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return a 404 on a non-existing forumThread", () => {
        return request(server)
            .get("/forumThreads/unknown")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("should add a new forumThread", () => {
        return request(server)
            .post("/forumThreads")
            .send(forumThread1)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should add a new forumThread", () => {
        return request(server)
            .post("/forumThreads")
            .send(forumThread2)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should add a new forumThread using the token of 'manfred'", () => {
        return request(server)
            .post("/forumThreads")
            .send(forumThread3)
            .set('Authorization', 'Bearer ' + manfredToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    it("should return all (3) forumThreads", () => {
        return request(server)
            .get("/forumThreads")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length, 3);
                assert.equal(res.statusCode, 200);
                ForumThreadService.getAll().then((result) => {
                    forumThread1Id = result[0]._id
                    forumThread2Id = result[1]._id
                    forumThread3Id = result[2]._id
                })
            });
    });
    it("should return the forumThread1", () => {
        return request(server)
            .get("/forumThreads/" + forumThread1Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
                assert.typeOf(res.body, "object");
                assert.equal(res.body.ownerID, admin.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return the forumThread3", () => {
        return request(server)
            .get("/forumThreads/" + forumThread3Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
                assert.typeOf(res.body, "object");
                assert.equal(res.body.ownerID, manfred.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return all forumThreads of admin", () => {
        return request(server)
            .get("/forumThreads/myForumThreads")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length , 2);
                assert.equal(res.body[0].ownerID , admin.userID);
                assert.equal(res.body[1].ownerID , admin.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return all forumThreads of manfred", () => {
        return request(server)
            .get("/forumThreads/myForumThreads")
            .set('Authorization', 'Bearer ' + manfredToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length , 1);
                assert.equal(res.body[0].ownerID , manfred.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return all forumThreads of admin even without token", () => {
        return request(server)
            .get("/forumThreads?ownerID=admin")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length , 2);
                assert.equal(res.body[0].ownerID , admin.userID);
                assert.equal(res.body[1].ownerID , admin.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return all forumThreads of manfred even without token", () => {
        return request(server)
            .get("/forumThreads?ownerID=manfred")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length , 1);
                assert.equal(res.body[0].ownerID , manfred.userID);
                assert.equal(res.statusCode, 200);
            });
    });
    it("should update forumThread1", () => {
        return request(server)
            .put("/forumThreads/" + forumThread1Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
                _id: 123,
                ownerID: manfred.userID,
                name: "updated forumThread1",
                description: "updated description"
            })
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should return the forumThread1 and proof that it was updated", () => {
        return request(server)
            .get("/forumThreads/" + forumThread1Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 200);
                assert.equal(res.body._id, forumThread1Id);
                assert.equal(res.body.ownerID, admin.userID);
                assert.notEqual(res.body.name, forumThread1.name);
                assert.notEqual(res.body.description, forumThread1.description);
                
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
    it("should delete forumThread1", () => {
        return request(server)
            .delete("/forumthreads/" + forumThread1Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should delete forumThread2", () => {
        return request(server)
            .delete("/forumthreads/" + forumThread2Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should delete forumThread3", () => {
        return request(server)
            .delete("/forumthreads/" + forumThread3Id)
            .set('Authorization', 'Bearer ' + manfredToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    it("should return 404", () => {
        return request(server)
            .delete("/forumthreads/" + forumThread3Id)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("all entities should be deleted", () => {
        return request(server)
            .get("/forumthreads/")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.length, 0);
            });
    });
});