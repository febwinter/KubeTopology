var express = require('express');
var getJson = require('./firstdata.js').test;
const mqtt = require('mqtt');

var router = express.Router();

/* MQTT setting */

const options = {
  host: '127.0.0.1',
  post: 1883,
  protocol: 'mqtt',
};
const client = mqtt.connect(options);
client.on("connect", (res) => {
  console.log("connection :" + client.connected);
});


/* GET home page. */
router.get('/dashboard', function (req, res, next) {

  /* Connect To MQTT Local Host */

  const topicList = ['topic/test1', 'topic/test2', 'topic/test3'];
  client.subscribe(topicList);

  client.on('message', (topic, message, packet) => {
    const jsonMsg = JSON.parse(message);
    console.log(jsonMsg);
  });

  /* Sending Initial Json Data */
  var data = getJson();
  data.then(d => {
    //console.log(d); 
    res.render('index.html', {
      Data: d
    });
  });
});

module.exports = router;