/*
 * febwinter
 * final commit : 2019.11.28
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const mqtt = require('mqtt');
var amqp = require('amqplib/callback_api');

//socket.io
var io = require('socket.io').listen(3100);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


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
//add
app.use(express.static(path.join(__dirname, 'node_modules')));

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

/* AMQP SETTING */

const url = 'amqp://rabbitmq:rabbitmq@192.168.10.220:30672';
const queueName = 'dashboard';

/* Connect To MQTT Local Host */

io.on('connection', function (socket) {
  console.log('socket connected');

  amqp.connect(url, function (error, connect) {
    if (error) {
      console.log(error);
      return;
    }
    connect.createChannel(function (error, channel) {
      if (error) {
        console.log(error);
        return;
      }
      channel.assertQueue(queueName, {
        durable: true
      }, function (error) {
        function recevieMessage() {
          console.log("chekcing");
          channel.get(queueName, {}, function (error, message) {
            if (error) {
              console.log(error);
            } else if (message) {
              console.log("Get MQTT message");
              channel.ack(message);
              console.log(JSON.parse(message.content));
              socket.emit('recMsg', JSON.parse(message.content));
              setTimeout(recevieMessage,3000);
            }
            else {
              setTimeout(recevieMessage,1000);
            }

          });
        }
        recevieMessage();
      });
    });
  });


//   amqp.connect(url, function (error0, connection) {
//     if (error0) {
//       throw error0;
//     } else {
//       console.log("MQTT connected")
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         throw error1;
//       }

//       channel.assertQueue(queueName, {
//         durable: true
//       });

//       channel.consume(queueName, function (msg) {
//         console.log("Get MQTT message");
//         console.log(JSON.parse(msg.content));
//         socket.emit('recMsg', JSON.parse(msg.content));
//         //channel.ack(msg);
//       }, {
//         noAck: false
//       });


//     });
//   });

});



module.exports = app;
