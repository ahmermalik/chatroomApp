var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use('/socket-io',
    express.static('node_modules/socket.io-client/dist'));
app.get('/', function (request, response) {
    response.render('chat.hbs');
});
io.on('connection', function(client){
    console.log('CONNECTED');
    client.on('disconnect', function () {
        console.log('EXITED');
    });
});


<script src="/socket-io/socket.io.js"> </script>

    <script>
var server = io();
server.on('connect', function (s) {
    console.log('connected');
});
</script>


/** back end **/
client.on('incoming', function(msg){                              //you get the message and broadcast it out
    io.emit('chat-msg', msg);                                     //io.emit sends it out to EVERYONE connected to the site.
});                                                               //client.emit only shows it between specific clients.

                                                                    //this goes on the html page
/** front end **/
<input id="message" onkeypress="send_message(event)">              // this creates an input box that people can type in. every time you press a key, it is going to call the send_message function
    <pre id="chat-box"></pre>


server.on('chat-msg', function (msg) {                              //get the message the user is typing and toss it into the chat-box
    var chat = document.getElementById("chat-box");
    chat.insertAdjacentHTML('beforeend', '\n' + msg);
});
function send_message (event) {                             //
    var char = event.which || event.keyCode;            //first thing it checks is what key is being pressed.
    if (char == '13') {                                    //13 = enter key
        var msg = document.getElementById("message");   //
        server.emit('incoming', msg.value);
        msg.value = '';
    }
}

client.on('join-room', function(room){                  //browser will send a request "join-room" and a (room) will be name/number
    client.join(room, function() {
        console.log(client.rooms);                      //when client.joins a room, socket io, sets up a private room which is client.rooms
        io.to(room).emit('chat-msg', '**new user joined**');    //it will only broadcast to people in the room.
    });
    client.on('incoming', function(msg){
        io.to(msg.room).emit('chat-msg', msg.msg);              //it will only broadcast the chat to the chat room.
    });
});