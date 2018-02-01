var express = require('express');
var router = express.Router();

router.get('/battle', function(req, res, next) {
  var id = req.query.roomId;
  res.render('battle', {room_id:id});
});

module.exports = router;
