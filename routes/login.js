var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teamlab-step3', {useMongoClient: true});

/* モデル読み込み */
var model = require('../model.js');

/* ユーザー登録 */
router.post('/signup', function(req, res, next) {
  console.log("ーーーー ユーザー登録 ーーーー");
  var userName = req.body.name;
  var passWord = req.body.password;
  var passConfirm = req.body.confirm;
  if(passWord != passConfirm) {
    res.render('login');
  } else {
    console.log("ーーーー 登録成功 ーーーー");
    var User = model.User;
    var user = new User();
    user.name = userName;
    user.password = passWord;
    user.save();
    req.session.user = userName;
    res.render('index', {
      userName: req.session.user
    });
  }
});

/* ログイン */
router.get('/', function(req, res, next) {
  console.log("ーーーー ログイン ーーーー");
  var userName = req.query.loginName;
  var passWord = req.query.loginPassword;
  var query = { "name": userName, "password": passWord };
  var User = mongoose.model('User');
  User.find(query, function(err, data) {
        if(err){
            console.log(err);
        }
        if(data == "") {
          res.render('login');
        }else {
          console.log("ーーーー ログイン成功 ーーーー");
          req.session.user = userName;
          res.render('index', {
            userName: req.session.user
          });
        }
  });
});


module.exports = router;
