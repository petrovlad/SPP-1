const express = require('express');
const router = express.Router();
const User = require('../models/user').User;
const md5 = require('md5');

router.get('/login', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/kittens');
        return;
    }

    res.render('login');
});

router.post('/login', function (req, res, next) {

    if (req.session.user) {
        res.redirect('/kittens');
        return;
    }

    const email = req.body.email;
    const password = md5(req.body.password);

    if (!(email && password)) throw new Error();

    User.findOne({email: email}, function (err, user) {
        if (user) {
            if (user.checkPassword(password)) {
                req.session.user = user;
                res.redirect('/kittens');
                return;
            }
        }
        res.redirect('/auth/login');
    });
});

router.get('/register', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/kittens');
        return;
    }

    res.render('register');
});

router.post('/register', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/kittens');
        return;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = new User({name: name, email: email, password: password});

    User.findOne({email: email}, function (err, found) {
        if (found) {
            res.redirect('/auth/login');
        } else {
            user.save(function (err) {
                req.session.user = user;
                res.redirect('/kittens');
            });
        }
    });
});

module.exports = router;