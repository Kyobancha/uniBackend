const UserService = require('../user/UserService');

async function authenticate(req){
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return(401);
    } else{
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userId, password] = credentials.split(':');
        return UserService.authenticate(userId, password)
        .then(isMatch => {
            if (!isMatch) {
                return 401;
            } else{
                return 200;
            }
        })
        .catch(() => {
            throw new Error("This is our fault, sorry!");
        })
    }
}

module.exports = {authenticate}