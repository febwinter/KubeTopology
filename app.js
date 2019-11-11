var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mqtt = require('mqtt');
var amqp = require('amqplib/callback_api');

//socket.io
var io = require('socket.io').listen(3100);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// socket.io
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname,'node_modules')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* MQTT setting */

const options = {
  username: 'rabbitmq',
  password: 'rabbitmq'
};
// const client = mqtt.connect('amqp://192.168.10.220:30672/', options);
// client.on("connect", (res) => {
//   console.log('mqtt connected')
//   console.log("connection :" + client.connected);
// });
// //const topicList = ['topic/test1', 'topic/test2', 'topic/test3'];
// client.subscribe('queues/dashboard');
// client.

/* AMQP SETTING */

const url = 'amqp://rabbitmq:rabbitmq@192.168.10.220:30672';
const queueName = 'dashboard';

/* Connect To MQTT Local Host */

io.on('connection', function (socket) {
  console.log('socket connected');


  // socket.on('msg', function (data) {
  //   console.log(data);
  //   socket.emit('recMsg', jsonMsg);
  // })
  //MQTT get

  // client.on('message', (topic, message, packet) => {
  //   console.log('Message Come in!');
  //   var jsonMsg = JSON.parse(message);
  //   //console.log(jsonMsg);

  //   //socket.io
  //   socket.emit('recMsg', jsonMsg)

  // });

  amqp.connect(url, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queueName, {
        durable: true
      });

      channel.consume(queueName, function (msg) {
        channel.ack(msg);
        console.log(JSON.parse(msg.content));
        socket.emit('recMsg', JSON.parse(msg.content));
        //setTimeout(1000);
      }, {
        noAck: false
      });


    });
  });



});



module.exports = app;