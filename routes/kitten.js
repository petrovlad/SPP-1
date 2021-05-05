const express = require('express');
const router = express.Router();
const Kitten = require('../models/kitten').Kitten;

router.get('/', function (req, res) {
    if (req.session.user) {

        let userId = req.session.user._id;

        Kitten.find({authorId: userId}, function (err, kittens) {
            res.render('kittens', {kittens: kittens, name: req.session.user.name});
        });
        return;
    }
    res.redirect('/auth/login');
});

router.get('/new', function (req, res) {

    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    res.render('edit', {Kitten: undefined, name: req.session.user.name});
});

router.post('/new', function (req, res) {
    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    const title = req.body.title;
    const authorId = req.session.user;
    const date = req.body.date;
    const description = req.body.description.replaceAll("\r\n", "<br>");
    const linkToFile = "#";

    let creationDateFormatted = "";
    let creationDate = new Date();

    creationDateFormatted += ("00" + creationDate.getDate()).slice(-2)
        + "." + ("00" + creationDate.getMonth() + 1).slice(-2)
        + "." + ("0000" + creationDate.getFullYear()).slice(-4);

    const Kitten = new Kitten({
        title: title,
        authorId: authorId,
        description: description,
        linkToFile: linkToFile,
        creationDate: creationDateFormatted,
        expirationDate: date
    });

    Kitten.save(function (err) {
        res.redirect('/kittens');
    });
});

router.post('/delete', function (req, res) {

    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    const KittenId = req.body.KittenId;

    Kitten.remove({_id: KittenId}, function (err) {
    });

    res.redirect("/kittens");
});

router.get('/update', function (req, res) {
    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    const KittenId = req.query.KittenId;

    Kitten.findOne({_id: KittenId}, function (err, Kitten) {
        Kitten.description = Kitten.description.replaceAll("<br>", "\r\n");
        res.render('edit', {Kitten: Kitten, name: req.session.user.name});
    });
});

router.post('/update', function (req, res) {

    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    const KittenId = req.body.KittenId;
    const title = req.body.title;
    const date = req.body.date;
    const description = req.body.description.replaceAll("\r\n", "<br>");
    const linkToFile = "#";

    Kitten.updateOne({_id: KittenId}, {
        $set: {title: title, description: description, expirationDate: date, linkToFile: linkToFile}
    }, null, function (err) {
        res.redirect("/kittens");
    });
});

module.exports = router;
