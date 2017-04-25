"use strict";
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require("socket.io")(http);
let path = require('path');
let golMultiplayer = require('./gameOfLifeMultiplayer');

let port = process.env.PORT || 5003;

app.use(express.static(__dirname+ '/../client'));

app.get('/', function expressRootRouter(request, response){
    response.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

golMultiplayer.start(io);

http.listen(port);
