var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teamlab-step3', {useMongoClient: true});

/*モデル読み込み*/
var model = require('../model.js');


/* GET users listing. */
router.get('/color', function(req, res, next) {
  res.render('color', { title: 'color' });
});

router.post('/color', function(req, res, next) {
  var User = mongoose.model('User');
  User.findOne({name:req.session.user}, function(err, user) {
    var r = req.body.r;
    var g = req.body.g;
    var b = req.body.b;

    var Color = model.Color;
    var color = new Color();
    color.r = r;
    color.g = g;
    color.b = b;
    color.user = user._id;

    color.save();

    user.colors.push(color._id);
    user.save();

    res.render('color', { title: 'top' });
  });


});


module.exports = router;
