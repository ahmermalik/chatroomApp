const WebSocketServer = require('ws').Server;

let wss = new WebSocketServer({ port: 3000 });

const HEADERS = {
    JOIN: 'JOIN',
    CHAT: 'CHAT'
};

let users = []; // array of users in room

onConnection = (ws) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);

        onMessage(ws, msg);
    });

    ws.on('close', function () {
        onConnectionClose(ws);
    });
};

onConnectionClose = (ws) => {
    console.log('connection closed', ws);

    let index = users.indexOf(ws);

    if(index != -1){
        users.splice(index, 1); // remove user from array
    }
};

/**
 *
 * @param ws The WebSocket that sent this message
 * @param msg {Object}
 */
onMessage = (ws, msg) => {
    switch(msg.header){
        case HEADERS.JOIN: // new user joined room
            onUserJoin(ws, msg);
            break;
        case HEADERS.CHAT:
            onUserMessage(ws, msg);
            break;
        default:
            console.log('received unknown header');
            break;
    }
};

/**
 *
 * @param ws
 * @param msg
 */
onUserJoin = (ws, msg) => {
    users.push(ws);
    ws.userName = msg.userName;

    sendChatToEveryone(`${ws.userName} joined!`);
};

/**
 *
 * @param ws {WebSocket}
 * @param msg {Object} i.e {header: "CHAT", chat: yy}
 */
onUserMessage = (ws, msg) => {
    sendChatToEveryone(`${ws.userName}: ${msg.chat}`);
};

/**
 *
 * @param ws {WebSocket}
 * @param chat {String}
 */
sendChat = (ws, chat) => {
    ws.send(JSON.stringify({
        header: HEADERS.CHAT,
        chat: chat
    }));
};

/**
 * Send a specific chat message to everyone
 * @param chat {String}
 */
sendChatToEveryone = (chat) => {
    for(let i  = 0;i<users.length;i++){
        sendChat(users[i], chat);
    }
};

wss.on('connection', onConnection);