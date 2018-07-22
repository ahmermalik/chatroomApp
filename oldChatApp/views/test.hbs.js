var express = require('express');
var app = express();
var morgan = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/static', express.static('public'));
app.use(morgan('dev'));

app.set('view engine', 'hbs');

app.get('/', function(request, response) {
    context = {title: 'Chat App'}
    response.render('chat.hbs', context)
});

class Users {
    constructor (){
        this.names = new Object;
    }
}

users = new Users();

// websocket block
io.on('connection', function(client){
    console.log('Connection established with ', client.id);
    client.send(client.id);
    client.on('disconnect', function() {
        console.log('Connection broken; client disconnected.')
    });

//  client.on('incoming', function(msg) {
//    io.emit('chat-msg', msg)
//  })

    client.on('join-room', function(room, username){
        client.join(room, function() {
            console.log(client.rooms);
            let msg = {msg: '**new user joined**', user: 'SERVER'}
            io.to(room).emit('chat-msg', msg);
        });
        client.on('incoming', function(msg){
            io.to(msg.room).emit('chat-msg', msg);
        });
    });

    client.on('nick-change', function(id, old_username, new_username){
        console.log(id); console.log(old_username); console.log(new_username);
        if (new_username.toLowerCase() == 'server') {
            let msg = {msg: 'Sorry, you cannot impersonate the server.', user: 'SERVER'};
            client.emit('chat-msg', msg);
        }
        else if (new_username === 'Null') { // TODO add unique user enforcement
            let msg = {msg: 'Sorry, you must exist.', user: 'SERVER'};
            client.emit('chat-msg', msg);
        }
        else {
            users.names.id = new_username;
            client.emit('nick-change-success', new_username)
        }
    })
});

http.listen(8000, function() {
    console.log('Listening on port 8000')
});