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
            return user;
        })
        .catch(() => {
            return 401;
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

module.exports = { authenticate, createToken }