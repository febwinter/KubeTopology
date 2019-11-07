var express = require('express');
var getJson = require('./firstdata.js').test;

var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  var data = getJson();
  //res.render('index.html', {Data: data});
  data.then(d => {
    //console.log(d); 
    res.render('index.html', {Data: d});
  });
});

module.exports = router;
