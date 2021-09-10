const express = require('express');
const router = express.Router();
const { checkLogin } = require('./verify');
// const db = require('./dataBase');



router.get('/', checkLogin, (req, res) => {
    if (req.name && req.email) {
        res.render('index', {
            name: req.name,
            email: req.email
        });
       
    } else {
        res.render('index');
        
    }

})

router.get('/login', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('login');
    } else if (!req.name || !req.email || req.active != 1) {
        res.status(302).redirect('/register');
    } else {
        res.status(302).redirect('/home')
    }
})

router.get('/register', checkLogin, (req, res) => {
    if (!req.name || !req.email || req.active != 1) {
        res.render('register', {
            email: req.email
        });
    } else {
        res.status(302).redirect('/home')
    }
})

router.get('/recovery', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('recovery');
    } else {
        res.status(302).redirect('/home')
    }
})

router.get('/home', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        let firstname = req.name.split(' ')
        firstname = firstname[0]
        res.render('home', {
            firstname,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/dashboard', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('dashboard', {
            userID: req.username,
            name: req.name,
            email: req.email,
            active: function () {
                if (req.active == 1) {
                    return 'active'
                } else {
                    return 'not active'
                }
            }
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/setting', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('setting', {
            userID: req.username,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})






module.exports = router;