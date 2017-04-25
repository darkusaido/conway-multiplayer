"use strict";
var express = require('express');
var app = express();
let http = require('http').Server(app);
let io = require("socket.io")(http);
let path = require('path');
let golMultiplayer = require('./gameOfLifeMultiplayer');

app.use(require('morgan')('short'));

// ************************************
// This is the real meat of the example
// ************************************
(function ()
{
    // Step 1: Create & configure a webpack compiler
    var webpack = require('webpack');
    var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../client/webpack.config');
    var compiler = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
})();

// Do anything you like with the rest of your express application.

app.get("/", function (req, res)
{
    res.sendFile(__dirname + '../client/index.html');
});

gol.start(io);

if (require.main === module)
{
    var server = http.createServer(app);
    server.listen(process.env.PORT || 1616, function ()
    {
        console.log("Listening on %j", server.address());
    });
}
