const express = require("express");
const router = express.Router();
const AuthenticationService = require('./AuthenticationService');

router.get('/', (req, res) => {
    AuthenticationService.authenticate(req)
    .then(result => {
        if(result === 401){
            res.status(401)
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.send({ message: 'Missing Authorization Header of wrong credentials.' });
        } else if (typeof result === 'string' || result instanceof String){
            AuthenticationService.createToken(result)
            .then(result => {
                console.log(result);
                res.setHeader('Authorization', 'Bearer ' + result);
                res.send({ message: 'Authentication was successful' });
            })
        } else {
            console.log(result)
            res.status(400);
            res.send({ message: 'Please check your request data.' });
        }
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})

module.exports = router;