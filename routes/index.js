var express = require('express');
var getJson = require('./firstdata.js').test;
var router = express.Router();


/* GET home page. */
router.get('/dashboard', function (req, res, next) {

  /* Sending Initial Json Data */
  var data = getJson();
  data.then(d => {
    //console.log(d); 
    res.render('index.html', {Data: d});
  });
});

module.exports = router;