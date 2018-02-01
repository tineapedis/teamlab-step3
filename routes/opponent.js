var express = require('express');
var router = express.Router();

router.get('/opponent', function(req, res, next) {
  res.render('opponent', {
    title: req.session.user,
    userName: req.session.user
  });
});

module.exports = router;
