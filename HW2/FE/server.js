const express = require('express');
const http = require('http');
const path = require('path');

const angularApp = express();

const PORT = 7781;

angularApp.use(express.static(__dirname + '/vote-app/dist/vote-app'));

angularApp.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(angularApp);

server.listen(PORT, () => {
    console.log(`Server for vote-app has been started on port: ${PORT}`);
});

