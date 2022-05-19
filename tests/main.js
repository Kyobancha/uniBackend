const database = require("../database/database.js");
const httpServer = require("../httpServer.js");
const request = require("supertest");
const assert = require("chai").assert;

const server = httpServer.getServer();

request(server)
    .get("/publicUsers")
    .end((err, res) => {
        if (err) throw err;
        console.log(res.body);
    })
  

//top level
describe("All tests", () => {
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

    after(() => {
        console.log("Shutting down application");
        database.close();
        server.close();
    });
})



describe('hooks', function () {
    before(function () {
      // runs once before the first test in this block
    });
  
    after(function () {
        console.log("Shutting down application");
        database.close();
        server.close();
    });
  
    beforeEach(function () {
      // runs before each test in this block
    });
  
    afterEach(function () {
      // runs after each test in this block
    });
  
    // test cases
  });

//low level
// describe("User API", function () {
//     describe("get all users", function () {
//       it("should return -1 when the value is not present", function () {
//         assert.equal([1, 2, 3].indexOf(4), -1);
//       });
//     });
//   });
  
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
  