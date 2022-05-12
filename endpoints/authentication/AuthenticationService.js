const config = require('config');
const UserService = require('../user/UserService');
const jwt = require('jsonwebtoken');

async function authenticate(req){
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return(401);
    } else{
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userId, password] = credentials.split(':');
        return UserService.authenticate(userId, password)
        .then(user => {
            if (!user) {
                return 401;
            } else{
                return user;
            }
        })
        .catch(() => {
            throw new Error("This is our fault, sorry!");
        })
    }
}

//premise is, that the authentication went successfully
function createToken(user){
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ userID: user.userID, userName: user.userName, isAdministrator: user.isAdministrator}, config.get("session.tokenKey"), {
            algorithm: config.get("session.algorithm"),
            expiresIn: config.get("session.timeToLive")
        })
        resolve(token);
    })
}

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = config.get('session.tokenKey');
        let algorithm = config.get('session.algorithm');
        jwt.verify(token, privateKey, { algorithm: algorithm }, (err, user) => {
            if (err) {
                res.status(401).json({ error: "Not Authorized" });
                return;
            } else{
                req.user = user;
                return next();
            }
        });
    } else {
        res.status(401).json({ error: "Not Authorized" });
        return;
    }
}


module.exports = { authenticate, createToken, isAuthenticated }