const jwt = require("jsonwebtoken");
const config = require('../config');
let User = require('../models/user');

module.exports = async function authenticate(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token,"middleware")
    if (token) {
        jwt.verify(token, config.signature, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: "user not authorized",
                    success: false
                })
            } else {
                next();
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
}
