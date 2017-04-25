document.addEventListener("DOMContentLoaded", () => {
    var socket = io();
    var mouseIsDown = false;
    var running = false;
    var tds = document.getElementsByTagName("td");
    var runButton = document.getElementById("run-button");
    var stopButton = document.getElementById("stop-button");
    var clearButton = document.getElementById("clear-button");
    var runningText = document.getElementById("running-text");
    var genereationNumber = document.getElementById("generation-number");
    var userColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    document.addEventListener("mousedown", () => {
        mouseIsDown = true;
    }, false);
    document.addEventListener("mousedown", () => {
        mouseIsDown = false;
    }, false);

    for(let td of tds)
    {
        td.addEventListener("mousedown", (event) =>
        {
            e.preventDefault();
            if(running){
                return;
            }
            var cell = event.target;
            if(cell.hasClass('live')){
                socket.emit('cell-deselected', cell.attr('id'));
            }
            else{
                socket.emit('cell-selected', cell.attr('id'), userColor);
            }
        }, false);
        td.addEventListener("mouseout", () =>
        {
            if(running){
                return;
            }
            var cell = $(this);
            if(mouseIsDown &&!cell.hasClass('live')){
                socket.emit('cell-selected', cell.attr('id'), userColor);
            }
        }, false);
    }

    clearButton.addEventListener('click', () => {
        if(!running){
            socket.emit('clear');
        }
    }, false);

    runButton.addEventListener('click', () => {
        socket.emit('running');
        event.target.attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    }, false);

    stopButton.addEventListener('click', (event) => {
        socket.emit('stopping');
        event.target.attr('disabled', 'disabled');
        runButton.removeAttr('disabled');
        clearButton.removeAttr('disabled');
        runningText.hide();
    }, false);

    socket.on('join', function socketJoinHandler(liveCells, isRunning, generationNumber){
        running = isRunning;
        generationNumber.innerHTML = generationNumber;
        if(running){
            runButton.attr('disabled', 'disabled');
            stopButton.removeAttr('disabled');
            clearButton.attr('disabled', 'disabled');
            runningText.show();
        }
        else{
            runButton.removeAttr('disabled');
            stopButton.attr('disabled', 'disabled');
            clearButton.removeAttr('disabled');
            runningText.hide();
        }
        clearAllCells();
        for(cellKey in liveCells){
            var cell = document.getElementById(id);
            if(!cell.hasClass('live')){
                cell.addClass('live');
                cell.css('background-color', liveCells[cellKey]);
            }
        }
    });

    socket.on('running', function socketGameRunningHandler(){
        running = true;
        runButton.attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    });

    socket.on('nextGeneration', function socketNextGenerationHandler(generationNumber, cellsBorn, cellsDied){
        generationNumber.innerHTML = generationNumber;
        var uiCell;
        for(cellKey in cellsBorn){
            uiCell = document.getElementById(cellKey);
            if(!uiCell.hasClass('live')){
                uiCell.addClass('live');
                uiCell.css('background-color', cellsBorn[cellKey]);
            }
        }
        for(cellKey in cellsDied){
            uiCell = document.getElementById(cellKey);
            if(uiCell.hasClass('live')){
                uiCell.removeClass('live');
                uiCell.css('background-color', "#eeeeee");
            }
        }
    });

    socket.on('stopping', function socketGameStoppingHandler(){
        running = false;
        stopButton.attr('disabled', 'disabled');
        runButton.removeAttr('disabled');
        clearButton.removeAttr('disabled');
        runningText.hide();
    });

    socket.on('clear', function socketClearingHandler(){
        generationNumber.innerHTML  = 0;
        clearAllCells();
    });

    socket.on('life', function socketLifeHandler(id, color){
        var cell = document.getElementById(id);
        if(!cell.hasClass('live')){
            cell.addClass('live');
            cell.css('background-color', color);
        }
    });

    socket.on('death', function socketDeathHandler(id){
        var cell = document.getElementById(id);
        if(cell.hasClass('live')){
            cell.removeClass('live');
            cell.css('background-color', '#eeeeee');
        }
    });

    var clearAllCells = function clearAllCellsHandler() {
        let liveOnes = document.getElementsByClassName$("live");
        liveOnes.css('background-color', "#eeeeee");
        liveOnes.removeClass('live');
    }
});