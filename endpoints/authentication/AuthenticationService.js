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
            if (!isMatch) {
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
function createToken(userId){
    return new Promise((resolve, reject) => {
        const jwtKey = 'my_secret_key';
        //NOTE
        const token = jwt.sign({ userId, userName}, jwtKey, {
            algorithm: config.get("session.algorithm"),
            expiresIn: config.get("session.timeToLive")
        })
        resolve(token);
    })
}

// function verify(token){
//     // Retrieve the token from the header or as a cookie
//     // If there is a token, verify it the with secret key
//     try {
//         var payload = jwt.verify(token, jwtKey)
//     } catch (e) {
//     // if the token is wrong, an exception is thrown
//     if (e instanceof jwt.JsonWebTokenError) {
//     // Not logged in, redirect to error page
//     }
//     // Do the action the user requested
// }


module.exports = { authenticate, createToken }