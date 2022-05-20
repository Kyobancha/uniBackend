const { assert } = require("chai");
const request = require("supertest");
const httpServer = require("../../httpServer.js");
const server = httpServer.getServer();

describe("GET", () => {
    it('should return an Array', () => {
        request(server)
            .get("/publicUsers")
            .expect(res => {
                console.log(res.statusCode)
                res.statusCode = 201
                console.log(res.statusCode)
            })
            .then(res => {
                assert.typeOf(res.body, "array")
                // assert.isNull(res.body, "SUPER LONG STRRIIIIIIIIIIIIIIIIIIIIIIING")
                assert.typeOf(res.body, "int", "------------------------------------")
                assert('foo' !== 'bar', 'foo is not bar');
                done();
            })
            .catch(err => {
                done(err)
            })
    })
    it('shut the duck up', () => {
        request(server)
            .get("/publicUsers")
            .expect(res => {
                console.log(res.statusCode)
                res.statusCode = 201
            })
            .assert(() => {
                // assert.fail(new Error("Some error message here"));
            })
            .then(res => {
                throw new Error("Some error message here");
                assert.fail()
                assert.typeOf(res.body, "int", "------------------------------------")
                assert('foo' !== 'bar', 'foo is not bar');
                done();
            })
            .catch(err => {
                assert.fail(new Error("Some error message here"));
            })
    })
});
//   // assert.typeOf(foo, 'string');
//   // assert.equal(foo, 'bar');
//   // assert.lengthOf(foo, 3)
//   // assert.property(tea, 'flavors');
//   // assert.lengthOf(tea.flavors, 3);

//   var expect = require("chai").expect;
//   const request = require("supertest");
//   const app = require("./httpServer");
//   describe("Test the basic application", function () {
//     describe("Test the root page", function () {
//       it("Test the home page", function () {
//         request(app).get("/").expect(200);
//       });
//     });
//   });

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


//sendet Request
// describe("Test Login mit Json-Body über Route", function () {
//     it("Login mit Json-Daten via HTTP-Request", function () {
//         user = { ...require('../utils/loginUser1.json') }
//         request(app).post('/login')
//             .send(user)
//             .expect(function (err, res) {
//                 var jsonContent = testUtils.parseJsonBody(res);
//                 expect(jsonContent => {
//                     expect(jsonContent.userID).to.equal(user.userID);
//                 });
//             }).end(function (err, res) {
//             });
//     });
// });