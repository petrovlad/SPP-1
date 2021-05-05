const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  let name;

  if (req.session.user) {
    name = req.session.user.name;
  }

  res.render('index', { name: name });
});

module.exports = router;
