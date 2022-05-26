const { assert } = require("chai");
const request = require("supertest");
const httpServer = require("../../httpServer.js");
const server = httpServer.getApp();
const { admin, manfred } = require("../testUtils/testUsers.js")
const { forumThread1, forumThread2 } = require("../testUtils/testForumThreads.js")
const { forumMessage1, forumMessage2, forumMessage3 } = require("../testUtils/testForumMessages.js")
const AuthenticationService = require("../../endpoints/authentication/AuthenticationService")
const ForumThreadService = require("../../endpoints/forumThread/ForumThreadService")
const ForumMessageService = require("../../endpoints/forumMessage/ForumMessageService")

let adminToken;
let manfredToken;

let forumThread1Id;
let forumThread2Id;

let forumMessage1Id;
let forumMessage2Id;
let forumMessage3Id;


describe("testing /forumMessages", () => {
    it("should return all forumMessages even without token.", () => {
        return request(server)
            .get("/forumMessages")
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
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
    it("should return all forumMessages when using a token", () => {
        return request(server)
            .get("/forumMessages")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
            });
    });
    it("should return a 404 on a non-existing forumMessage", () => {
        return request(server)
            .get("/forumMessages/unknown")
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
    it("should return all (2) forumThreads", () => {
        return request(server)
            .get("/forumThreads")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.body.length, 2);
                assert.equal(res.statusCode, 200);
                ForumThreadService.getAll().then((result) => {
                    forumThread1Id = result[0]._id
                    forumThread2Id = result[1]._id
                })
            });
    });
    forumMessage1.forumThreadID = forumThread1Id
    forumMessage2.forumThreadID = forumThread1Id
    forumMessage3.forumThreadID = forumThread2Id
    it("should add a new forumMessages", () => {
        return request(server)
            .post("/forumMessages")
            .send(forumMessage1)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 201);
            });
    });
    // it("should add a new forumMessages", () => {
    //     return request(server)
    //         .post("/forumMessages")
    //         .send(forumMessage2)
    //         .set('Authorization', 'Bearer ' + adminToken)
    //         .then((res) => {
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.statusCode, 201);
    //         });
    // });
    // it("should add a new forumMessages using the token of 'manfred'", () => {
    //     return request(server)
    //         .post("/forumMessages")
    //         .send(forumMessage3)
    //         .set('Authorization', 'Bearer ' + manfredToken)
    //         .then((res) => {
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.statusCode, 201);
    //         });
    // });
    // it("should return all (3) forumMessages", () => {
    //     return request(server)
    //         .get("/forumMessages")
    //         .set('Authorization', 'Bearer ' + adminToken)
    //         .then((res) => {
    //             assert.typeOf(res.body, "array");
    //             assert.equal(res.body.length, 3);
    //             assert.equal(res.statusCode, 200);
    //             // ForumThreadService.getAll().then((result) => {
    //             //     forumThread1Id = result[0]._id
    //             //     forumThread2Id = result[1]._id
    //             //     forumThread3Id = result[2]._id
    //             // })
    //         });
    // });
    // it("should return the forumThread1", () => {
    //     return request(server)
    //         .get("/forumThreads/" + forumThread1Id)
    //         .set('Authorization', 'Bearer ' + adminToken)
    //         .then((res) => {
    //             assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.body.ownerID, admin.userID);
    //             assert.equal(res.statusCode, 200);
    //         });
    // });
    // it("should return the forumThread3", () => {
    //     return request(server)
    //         .get("/forumThreads/" + forumThread3Id)
    //         .set('Authorization', 'Bearer ' + adminToken)
    //         .then((res) => {
    //             assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.body.ownerID, manfred.userID);
    //             assert.equal(res.statusCode, 200);
    //         });
    // });
//     it("should return all forumThreads of admin", () => {
//         return request(server)
//             .get("/forumThreads/myForumThreads")
//             .set('Authorization', 'Bearer ' + adminToken)
//             .then((res) => {
//                 assert.typeOf(res.body, "array");
//                 assert.equal(res.body.length , 2);
//                 assert.equal(res.body[0].ownerID , admin.userID);
//                 assert.equal(res.body[1].ownerID , admin.userID);
//                 assert.equal(res.statusCode, 200);
//             });
//     });
//     it("should return all forumThreads of manfred", () => {
//         return request(server)
//             .get("/forumThreads/myForumThreads")
//             .set('Authorization', 'Bearer ' + manfredToken)
//             .then((res) => {
//                 assert.typeOf(res.body, "array");
//                 assert.equal(res.body.length , 1);
//                 assert.equal(res.body[0].ownerID , manfred.userID);
//                 assert.equal(res.statusCode, 200);
//             });
//     });
//     it("should return all forumThreads of admin even without token", () => {
//         return request(server)
//             .get("/forumThreads?ownerID=admin")
//             .then((res) => {
//                 assert.typeOf(res.body, "array");
//                 assert.equal(res.body.length , 2);
//                 assert.equal(res.body[0].ownerID , admin.userID);
//                 assert.equal(res.body[1].ownerID , admin.userID);
//                 assert.equal(res.statusCode, 200);
//             });
//     });
//     it("should return all forumThreads of manfred even without token", () => {
//         return request(server)
//             .get("/forumThreads?ownerID=manfred")
//             .then((res) => {
//                 assert.typeOf(res.body, "array");
//                 assert.equal(res.body.length , 1);
//                 assert.equal(res.body[0].ownerID , manfred.userID);
//                 assert.equal(res.statusCode, 200);
//             });
//     });
//     it("should update forumThread1", () => {
//         return request(server)
//             .put("/forumThreads/" + forumThread1Id)
//             .set('Authorization', 'Bearer ' + adminToken)
//             .send({
//                 _id: 123,
//                 ownerID: manfred.userID,
//                 name: "updated forumThread1",
//                 description: "updated description"
//             })
//             .then((res) => {
//                 assert.typeOf(res.body, "object");
//                 assert.equal(res.statusCode, 204);
//             });
//     });
//     it("should return the forumThread1 and proof that it was updated", () => {
//         return request(server)
//             .get("/forumThreads/" + forumThread1Id)
//             .set('Authorization', 'Bearer ' + adminToken)
//             .then((res) => {
//                 assert.hasAnyKeys(res.body, "_id", "ownerID", "name", "description");
//                 assert.typeOf(res.body, "object");
//                 assert.equal(res.statusCode, 200);
//                 assert.equal(res.body._id, forumThread1Id);
//                 assert.equal(res.body.ownerID, admin.userID);
//                 assert.notEqual(res.body.name, forumThread1.name);
//                 assert.notEqual(res.body.description, forumThread1.description);
                
//             });
//     });
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
            .delete("/forumMessages/" + forumMessagesId1)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 204);
            });
    });
    // it("should delete forumThread2", () => {
    //     return request(server)
    //         .delete("/forumMessages/" + forumMessagesId2)
    //         .set('Authorization', 'Bearer ' + adminToken)
    //         .then((res) => {
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.statusCode, 204);
    //         });
    // });
    // it("should delete forumThread3", () => {
    //     return request(server)
    //         .delete("/forumMessages/" + forumMessagesId3)
    //         .set('Authorization', 'Bearer ' + manfredToken)
    //         .then((res) => {
    //             assert.typeOf(res.body, "object");
    //             assert.equal(res.statusCode, 204);
    //         });
    // });
    it("should return 404", () => {
        return request(server)
            .delete("/forumMessages/" + forumMessagesId3)
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "object");
                assert.equal(res.statusCode, 404);
            });
    });
    it("all entities should be deleted", () => {
        return request(server)
            .get("/forumMessages/")
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                assert.typeOf(res.body, "array");
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.length, 0);
            });
    });
});