"use strict";
let gol = require("./cpp/build/Release/gol.node");

exports.start = (io) => {
    let running = false;
    let rows = 30;
    let columns = 50;
    let interval;
    let deadColor = "#eeeeee"
    gol.createNewEnvironment(rows, columns);

    io.on("connection", function socketConnectionHandler(socket){
        console.log("someone connected");
        socket.emit("join", gol.getLiveCells(), running, gol.getGenerationNumber());

        socket.on("stopping", function socketStoppingHandler(){
            running = false;
            io.sockets.emit("stopping");
            clearInterval(interval);
        });

        socket.on("running", function socketRunningHandler(){
            running = true;
            io.sockets.emit("running");
            let update = function (){
                gol.nextGeneration();
                console.log(gol.getGenerationNumber());
                let cellsBorn = gol.getCellsBorn();
                let cellsDied = gol.getCellsDied();
                io.sockets.emit("nextGeneration", gol.getGenerationNumber(), cellsBorn, cellsDied);
            };
            interval = setInterval(update, 80);
        });

        socket.on("clear", function socketClearingHandler(){
            gol.createNewEnvironment(rows, columns);
            io.sockets.emit("clear");
        });

        socket.on("cell-selected", function socketCellSelectionHandler(id, color){
            let xY = id.split("-");
            let x = xY[0];
            let y = xY[1];
            gol.setColorAndFlipCell(x,y,color);
            io.sockets.emit("life", id, color);
        });

        socket.on("cell-deselected", function socketCellDeselectionHandler(id){
            let xY = id.split("-");
            let x = xY[0];
            let y = xY[1];
            gol.setColorAndFlipCell(x,y,deadColor);
            io.sockets.emit("death", id);
        });

        socket.on("disconnect", function socketDisconnectionHandler(){
            console.log("someone disconnected");
        });
    });
};