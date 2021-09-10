const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const db = require('./dataBase');
const app = express();
app.use(cookieParser());




// Verify Token
function verifyToken(req, res, next) {
    // // Get auth header value
    // const bearerHeader = req.headers['authorization'];


    const { cookies } = req;
    const bearerHeader = cookies.authorization;


    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // // Next middleware
        // next();
        jwt.verify(req.token, process.env.JWT_token, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                let select = `SELECT USERNAME, ID FROM users WHERE USERNAME= '${authData.user.username}'`;
                db.query(select, (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    
                    if (results[0]) {
                        if (results[0].ID === authData.user.ID) {
                            req.data = authData;
                            next();
                        }else{
                            res.status(403).send({msg: `forbidden`});
                        }
                    }else{
                        res.status(403).send({msg: `forbidden`});
                    }
                });
            }
        });

    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

function checkLogin(req, res, next){
       // // Get auth header value
    // const bearerHeader = req.headers['authorization'];
    req.name = undefined
    req.email = undefined

    const { cookies } = req;
    const bearerHeader = cookies.authorization;


    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        jwt.verify(bearer[1],  process.env.JWT_token, (err, authData) => {
            if (err) {
                next();
            } else {
                let select = `SELECT name, email, ID, active FROM users WHERE USERNAME= '${authData.user.username}'`;
                db.query(select, (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    
                    if (results[0]) {
                        if (results[0].ID === authData.user.ID) {
                            req.username = authData.user.username
                            req.name = results[0].name
                            req.email = results[0].email
                            req.active = results[0].active
                            next();
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                });
            }
        });

    } else {
        next();
    }
}

module.exports = {verifyToken, checkLogin};