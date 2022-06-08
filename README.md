# uniBackend

##About
This is a project (WIP) for future references and has been coded as part of a uni class called "Web Engineering II". It is a simple REST-backend (level 2) for a forum using MongoDB (with Mongoose) and Express. Please note that config files have already been provided in this repository on purpose to give you the best user experience possible.
The HTTPS-server runs on port 443.

##How to run the project
To run this project, move into the project's root directory using your console and enter ```npm install```, followed by ```npm start```. ALternatively run ```set NODE_ENV=production&& node ./httpServer.js``` on windows.

##How to run the tests
In case you are interested in the implemented tests, feel free to run ```npm test```. The used technologies are Mocha, Chai and Supertest. The tests have been implemented in a way, that they are supposed to **run independentely**. That means that unskipping tests won't be enough to make them run smoothly. This is an issue that will be fixed in the future. Also please take note, that the tests haven't been fully implemented yet and therefore are **still in work**.

##Available endpoints
| Endpoints          | Description |
| --------------- | ----------- |
| /               | displays a default text, nothing else.       |
| /authenticate   | using basic auth, a registered user can login. The credentials will be validated. |
| /publicusers    | for test purpose. Almost identical to the endpoint */users*, with the difference, that it will output the hashed password on HTTP GET as well. |
| /users          | endpoint for admins only. manages a collection of users |
| /forumThreads   | public endpoint. Each user can have their own threads and fill them with messages. To manage their forumThreads, they need to be authenticated. |
| /forumMessages  | public endpoint. Manages messages with a reference on their owners and threads. |
