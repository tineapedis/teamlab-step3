var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/teamlab-step3', {useMongoClient: true});

var fs = require('fs');
var Canvas = require('canvas'),
    Image = Canvas.Image;

// ユーザーが保存したカラーを取得
router.get('/colorlist', function(req, res, next) {
  console.log("ーーーー カラー全件取得 ーーーー");
  var Color = mongoose.model('Color');
  Color.find({}, function(err, colors) {
    res.send(colors);
  });
});

// ユーザー情報取得
router.get('/user', function(req, res, next) {
  console.log("ーーーー ユーザー情報取得 ーーーー");
  var User = mongoose.model('User');
  User.findOne({name:req.session.user}, function(err, user) {
    res.send(user);
  });
});

// ユーザーのアイコン編集
router.post('/editicon', function(req,res) {
  console.log("ーーーー アイコン編集 ーーーー");
  var icon = req.body.iconColor;
  console.log(icon);
  var userName = req.session.user;
  var r=0, g=0, b=0;
  // 非同期処理
  let promise = new Promise((resolve, reject) => {
    var Color = mongoose.model('Color');
    Color.findOne({_id:req.body.listColor},function(err, color) {
      if (err) {
        res.render('index');
      } else if(color.r == "undefined"){
        res.render('index');
      } else {
        r = color.r;
        g = color.g;
        b = color.b;
      }
    });
    resolve('')
  })
  promise.then((msg) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var User = mongoose.model('User');
      if(icon=="backColor") {
        User.update({name:userName}, { $set: { backColor:[r,g,b]} },{upsert: false}, function(err,data) {
        });
      } else if(icon=="hairColor") {
        User.update({name:userName}, { $set: { hairColor:[r,g,b]} },{upsert: false}, function(err,data) {
        });
      } else if(icon=="faceColor") {
        User.update({name:userName}, { $set: { faceColor:[r,g,b]} },{upsert: false}, function(err,data) {
        });
      } else if(icon=="eyeColor") {
        User.update({name:userName}, { $set: { eyeColor:[r,g,b]} },{upsert: false}, function(err,data) {
        });
      } else if(icon=="") {

      }
      res.render('index');
    }, 500)
  })
})
});

module.exports = router;
