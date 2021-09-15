const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const shajs = require('sha.js');
const db = require('./dataBase');
const otp = require('./otp');
const { verifyToken, check } = require('./verify');
const router = express.Router();
const app = express();
app.use(cookieParser());



// //to prevent CSRF attack
// router.use(( req, res, next) => {
//     const { cookies } = req;
//     const { siteCodeU } = req.headers;
//     const siteCodeC = cookies.siteCodeC;

//     if (siteCodeU == siteCodeC) {
//         next();
//     } else {
//         res.status(403).send({ msg: "forbidden, to prevent CSRF attack" })
//     }
// })



//to prevent SQL injection && XSS attack through username, email, name
router.use((req, res, next) => {
    const { username, email, uname } = req.body;
    const cred = [username, email, uname];
    let valid = check(cred)
    if (valid) {
        next();
    } else {
        res.status(403).send({ msg: 'ERROR: only [ A-Za-z0-9{@_. -(){}[]!} ] can be used as username, email and name' })
    }
})

//password hashing
router.use((req, res, next) => {
    var { password, userOTP, newPassword } = req.body;

    const hash = (key) => {
        for (let i = 0; i < key.length; i++) {
            if (key[i] == "'" || key[i] == '"' || key[i] == "`") {
                if (key[i - 1] != "\\") {
                    var part1 = key.slice(0, i);
                    var part2 = key.slice(i, key.length);
                    part1 = part1 + '\\';
                    key = part1.concat(part2);
                }
            }
        }
        key = (new shajs.sha1().update(`${key}`).digest('hex'))
        return key;
    }

    if (password) {
        password = hash(password);
        req.body.password = password;
    }

    if (userOTP) {
        userOTP = hash(userOTP);
        req.body.userOTP = userOTP;
    }

    if (newPassword) {
        newPassword = hash(newPassword);
        req.body.newPassword = newPassword;
    }

    next();

})



router.get('/test', (req, res) => {
    res.json({ msg: "router working" })
    console.log(req.body);
})

router.post('/signup/', (req, res) => {
    const { username, email, password, uname } = req.body;
    if (username && email && password && uname) {
        try {
            let select = `SELECT USERNAME, active FROM users WHERE USERNAME= '${username}'`;
            db.query(select, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (!results[0]) {
                    var ID = uuid.v4();
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = (Math.floor(today.getTime() / 1000));

                    otp(email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            db.promise().query(`INSERT INTO USERS VALUES('${username}', '${password}', '${ID}', '${email}', '0', '${uname}', '${OTP_timestamp}', '0', '0', '${OTP}')`);

                            // Mock user
                            const user = {
                                username: username,
                                ID: ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '3600s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', 0);
                                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.status(200).send({ msg: `account created!! welcome ${username}, please verify your OTP sent to your email` });
                            });

                        }).catch((err) => {
                            res.status(500).send({ msg: `internal server error please contact with support team` });
                            console.log(err);
                        });

                } else if (results[0].active === 0) {
                    var ID = uuid.v4();
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = (Math.floor(today.getTime() / 1000));

                    otp(email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            db.promise().query(`UPDATE users  SET username='${username}', password='${password}', ID='${ID}', active='0', name='${uname}', email='${email}', OTP='${OTP}', OTP_timestamp='${OTP_timestamp}', OTP_attempt='0', password_attempt='0' WHERE USERNAME= '${username}';`);

                            // Mock user
                            const user = {
                                username: username,
                                ID: ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '3600s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', 0);
                                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.status(200).send({ msg: `account created!! welcome ${username}, please verify your OTP sent to your email` });
                            });

                        }).catch((err) => {
                            res.status(500).send({ msg: `internal server error please contact with support team` });
                            console.log(err);
                        });
                }
                else {
                    res.status(403).send({ msg: "this username already exists, try another unique username" })
                }
            });

        }
        catch (err) {
            console.log(err);
        }
    } else {
        res.status(403).send({ msg: "empty username, password, email or name is not valid" })
    }
});

router.post('/otp/activate', verifyToken, (req, res) => {
    const { userOTP } = req.body;
    authData = req.data;
    let select = `SELECT USERNAME, ID, OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= '${authData.user.username}'`;
    db.query(select, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        var OTP_attempt = results[0].OTP_attempt;
        if (results[0].ID === authData.user.ID) {
            if (userOTP) {
                if (OTP_attempt < 6) {
                    var today = new Date();
                    if (((Math.floor(today.getTime() / 1000)) - results[0].OTP_timestamp) < 7200) {
                        if (results[0].OTP == userOTP) {
                            let select = `UPDATE users  SET active='1', OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE USERNAME= '${authData.user.username}';`;
                            db.query(select, (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                res.cookie('active', 1);
                                res.send({ msg: "account activated!" })
                            });
                        } else {
                            OTP_attempt++;
                            let select = `UPDATE users  SET OTP_attempt='${OTP_attempt}' WHERE USERNAME= '${authData.user.username}';`;
                            db.query(select, (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                } if (OTP_attempt < 3) {
                                    res.status(403).send({ msg: "wrong OTP" });
                                } else {
                                    tries = 6 - OTP_attempt;
                                    res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
                                }

                            });
                        }
                    } else {
                        res.status(403).send({ msg: "OTP expired" });
                    }
                } else {
                    res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
                }
            } else {
                res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
            }
        } else {
            res.status(400).send({ msg: "something went wrong, try to relogin with userID and password after logout" });
        }

    });
});

router.post('/otp/resend', verifyToken, (req, res) => {

    let select = `SELECT ID, email FROM users WHERE USERNAME= '${req.data.user.username}'`;
    db.query(select, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        if (results[0].ID === req.data.user.ID) {

            function randomInt(max, min) {
                var num = (Math.floor(Math.random() * (max - min)) + min);
                return num;
            }
            var OTP = randomInt(10000, 99999);
            var today = new Date();
            var OTP_timestamp = (Math.floor(today.getTime() / 1000));

            otp(results[0].email, OTP)
                .then((result) => {
                    OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                    let select = `UPDATE users  SET OTP='${OTP}', OTP_timestamp='${OTP_timestamp}', OTP_attempt='0' WHERE USERNAME= '${req.data.user.username}';`;
                    db.query(select, (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        res.status(200).send({ msg: "OTP sent, check your your email" })
                    });
                }).catch((err) => {
                    res.status(500).send({ msg: `internal server error please contact with support team` });
                    console.log(err);
                });
        } else {
            res.status(400).send({ msg: "something went wrong, try to relogin with userID and password after logout" });
        }
    });
});

router.post('/signin/', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {

            let select = `SELECT ID, password, password_attempt, active FROM users WHERE USERNAME= '${username}'`;
            db.query(select, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (results[0]) {
                    var { password_attempt } = results[0];
                    if (password_attempt < 20) {
                        if (results[0].password === password) {

                            db.promise().query(`UPDATE USERS SET password_attempt= '0' WHERE USERNAME ='${username}'`);

                            // Mock user
                            const user = {
                                username: username,
                                ID: results[0].ID
                            }

                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '172800s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('authorization', `bearer ${token}`);
                                res.cookie('active', results[0].active);
                                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.send({ msg: `login sucessful! welcome ${username}` });
                            });

                        } else {

                            password_attempt++;
                            let select = `UPDATE users  SET password_attempt='${password_attempt}' WHERE USERNAME= '${username}'`;
                            db.query(select, (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                res.status(403).send({ msg: "wrong ID or password" });

                            });
                        }
                    }
                    else {
                        res.status(403).send({ msg: "maximum password attempt exeeded" })
                    }
                }
                else {
                    res.status(403).send({ msg: "wrong ID or password" });
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    } else {
        res.status(401).send({ msg: "empty username or password is not valid" })
    }
});

router.post('/test/autologin', verifyToken, (req, res) => {

    authData = req.data;
    res.json({
        message: 'relogged in',
        authData
    });

});

router.put('/changecred/', verifyToken, (req, res) => {

    let selectPSWD = `SELECT ID FROM users WHERE USERNAME= '${req.data.user.username}'`;
    db.query(selectPSWD, (err, IDcheck, fields) => {
        if (err) {
            return console.error(err.message);
        }
        if (IDcheck[0].ID === req.data.user.ID) {

            const { password, email, newPassword } = req.body;

            if (email == undefined && (password && newPassword)) {

                let selectPSWD = `SELECT password FROM users WHERE USERNAME= '${req.data.user.username}'`;
                db.query(selectPSWD, (err, dbCred, fields) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    if (dbCred[0].password === password) {

                        db.promise().query(`UPDATE USERS SET PASSWORD= '${newPassword}' WHERE USERNAME ='${req.data.user.username}'`);
                        res.send({ msg: 'password updated sucessfully' });
                    } else {
                        res.status(403).send({ msg: "wrong password" });
                    }
                });
            } else if (email == undefined && (!password || !newPassword)) {
                res.status(403).send({ msg: "current password and new password both must be filled" });
            }
            else if (newPassword == undefined && (password && email)) {

                let selectPSWD = `SELECT password FROM users WHERE USERNAME= '${req.data.user.username}'`;
                db.query(selectPSWD, (err, dbCred, fields) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (dbCred[0].password === password) {

                        db.promise().query(`UPDATE USERS SET email= '${email}' WHERE USERNAME ='${req.data.user.username}'`);
                        res.send({ msg: 'email updated sucessfully' });
                    } else {
                        res.status(403).send({ msg: "wrong password" });
                    }
                });
            } else if (newPassword == undefined && (!email || !password)) {
                res.status(403).send({ msg: "current password and new email both must be filled" });
            }
        } else {
            res.status(403).send({ msg: "something went wrong, please log in again" });
        }
    })

})

router.post('/forgetpassword/otp/request', (req, res) => {
    const { username } = req.body;
    if (username) {
        db.promise().query(`SELECT email FROM users WHERE username='${username}'`)
            .then((result) => {
                if (result[0][0]) {
                    function randomInt(max, min) {
                        var num = (Math.floor(Math.random() * (max - min)) + min);
                        return num;
                    }
                    var OTP = randomInt(10000, 99999);
                    var today = new Date();
                    var OTP_timestamp = (Math.floor(today.getTime() / 1000));

                    otp(result[0][0].email, OTP)
                        .then((result) => {
                            OTP = (new shajs.sha1().update(`${OTP}`).digest('hex'))
                            let select = `UPDATE users  SET OTP='${OTP}', OTP_timestamp='${OTP_timestamp}', OTP_attempt='0' WHERE USERNAME= '${username}';`;
                            db.query(select, (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                                res.send({ msg: "OTP sent, check your your email" })
                            });
                        }).catch((err) => {
                            res.status(500).send({ msg: `internal server error please contact with support team` });
                            console.log(err);
                        });

                } else {
                    res.status(403).send({ msg: "account not found" })
                }
            }).catch((err) => {
                console.error(err);
            });
    } else {
        res.status(403).send({ msg: "please enter your username" })
    }
})

router.post('/forgetpassword/otp/send', (req, res) => {
    const { username, userOTP } = req.body;

    let select = `SELECT OTP, OTP_timestamp, OTP_attempt FROM users WHERE USERNAME= '${username}'`;
    db.query(select, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        if (results[0]) {

            var OTP_attempt = results[0].OTP_attempt;

            if (userOTP) {
                if (OTP_attempt < 6) {
                    var today = new Date();
                    if (((Math.floor(today.getTime() / 1000)) - results[0].OTP_timestamp) < 7200) {
                        if (results[0].OTP === userOTP) {
                            const user = {
                                username: username,
                                OTP: userOTP
                            }
                            jwt.sign({ user }, process.env.JWT_token, { expiresIn: '900s' }, (err, token) => {
                                if (err) {
                                    res.json({ err });
                                }
                                res.cookie('OTPauthorization', `code: ${token}`);
                                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                                res.send({ msg: `enter new password` });
                            });
                        } else {
                            OTP_attempt++;
                            let select = `UPDATE users  SET OTP_attempt='${OTP_attempt}' WHERE USERNAME= '${username}';`;
                            db.query(select, (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                } if (OTP_attempt < 3) {
                                    res.status(403).send({ msg: "wrong OTP" });
                                } else {
                                    tries = 6 - OTP_attempt;
                                    res.status(403).send({ msg: `wrong OTP, ${tries} tries left` });
                                }

                            });
                        }
                    } else {
                        res.status(403).send({ msg: "OTP expired" });
                    }
                } else {
                    res.status(403).send({ msg: "maximum OTP attempt limitation exceeded" });
                }
            } else {
                res.status(403).send({ msg: "blank OTP field is not allowed, please enter your OTP" });
            }
        } else {
            res.status(404).send({ msg: "account not found" })
        }
    });
});

router.post('/forgetpassword/newpassword', (req, res) => {

    const { cookies } = req;
    const { newPassword } = req.body;
    const bearerHeader = cookies.OTPauthorization;

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_token, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                let select = `SELECT ID, OTP, active FROM users WHERE USERNAME= '${authData.user.username}'`;
                db.query(select, (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    if (results[0]) {
                        if (results[0].OTP === authData.user.OTP) {
                            if (newPassword) {
                                let select = `UPDATE users  SET password='${newPassword}', OTP=NULL, OTP_timestamp=NULL, OTP_attempt='0' WHERE USERNAME= '${authData.user.username}';`;
                                db.query(select, (error, result, fields) => {
                                    if (error) {
                                        return console.error(error.message);
                                    }
                                    // Mock user
                                    const user = {
                                        username: authData.user.username,
                                        ID: results[0].ID
                                    }
                                    jwt.sign({ user }, process.env.JWT_token, { expiresIn: '172800s' }, (err, token) => {
                                        if (err) {
                                            res.json({ err });
                                        }
                                        res.clearCookie('OTPauthorization');
                                        res.cookie('authorization', `bearer ${token}`);
                                        res.cookie('active', results[0].active);
                                        res.status(200).send({ msg: `password changed sucessfully!` });
                                    });

                                });
                            } else {
                                res.status(403).send({ msg: `blank password is not allowed` });
                            }
                        } else {
                            res.status(403).send({ msg: `forbidden` });
                        }
                    } else {
                        res.status(403).send({ msg: `forbidden` });
                    }
                });
            }
        });

    } else {
        res.sendStatus(403);
    }


})

router.get('/signout/', (req, res) => {
    res.clearCookie('authorization');
    res.clearCookie('active');
    res.send('ok');
})

router.post('/signout/all', verifyToken, (req, res) => {
    authData = req.data.user.username;
    db.promise().query(`UPDATE USERS SET ID= '${uuid.v4()}' WHERE USERNAME ='${authData}'`);
    res.clearCookie('authorization');
    res.clearCookie('active');
    res.send('ok');
})

module.exports = router;