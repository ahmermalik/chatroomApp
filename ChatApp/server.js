const express = require('express');
const path = require('path');

const SocketServer = require('./modules/SocketServer');

const app = express();
const PORT = 4000;

app.listen(PORT);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});