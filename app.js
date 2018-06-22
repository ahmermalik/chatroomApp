var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ROOMS = {};
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();                             //first build the app.
var http = require('http').Server(app);         //call http in order to create a connection pipeline.
var io = require('socket.io')(http);            //call http and io in before app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/socket-io',
    express.static('node_modules/socket.io-client/dist'));










//emit message once user connects to the socket.
io.on('connection', function(client){
    console.log('User has connected.');

client.on('incoming', function(msg){
    io.emit('chat-msg', msg);
});

//joining a room.

client.on('join-room', function(room, username){
    client.join(room, function() {
        console.log(client.rooms);
        msg = {msg: '**new user joined**', user: 'SERVER'};
        io.to(room).emit('chat-msg', msg);
    });


//emit message once user leaves the socket.
client.on('disconnect', function () {
    console.log('User has disconnected.');
    });
});

client.on('incoming', function(msg){
    io.to(msg.room).emit('chat-msg', msg.msg);
    });
});



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;

var PORT = process.env.PORT || 8000;

http.listen(PORT, function () {             //since we're using web socket, it will not be app.listen, but instead http.listen
    console.log('Listening on port ' +PORT);
});


//set up landing page which allows you to select chatroom or create your own chatroom.
//set up multi chatroom functions.
//set up user-id for chatrooms.
