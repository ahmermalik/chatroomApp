let client = new WebSocket("ws://localhost:3000");
let userName = 'Guest'+(Math.floor(Math.random() * 99999));

const HEADERS = {
    JOIN: 'JOIN',
    CHAT: 'CHAT'
};
const ENTER = 13;

client.onopen = function (event) {
    client.send(JSON.stringify({
        header: HEADERS.JOIN,
        userName: userName
    }));
};

client.onmessage = function (event) {
    var msg = JSON.parse(event.data);

    switch(msg.header) {
        case HEADERS.CHAT:
            onChat(msg);
            break;
        default: // unknown packet header
            break;
    }
};

/**
 * Send chat
 * @param chat {String}
 */
sendChat = (chat) => {
    client.send(JSON.stringify({
        header: HEADERS.CHAT,
        chat: chat
    }));
};

/**
 * Handle receiving a chat message
 * @param msg
 */
onChat = (msg) => {
    let chatMessage = msg.chat;

    chatBox.innerHTML += `<div class="chat">${chatMessage}</div>`; // TODO: escape HTML to prevent XSS attack
};

// front end stuff
let chatBox = document.getElementById('chat-box');
let inputTxt = document.getElementById('input-txt');

inputTxt.onkeydown = (e) => {
    if(e.keyCode == ENTER) {
        sendChat(inputTxt.value);
        inputTxt.value = '';
    }
};