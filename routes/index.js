var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let room = req.query.room || 'main-room'
  res.render('chat.hbs', { title: 'Chat App', room: room});
});


module.exports = router;
