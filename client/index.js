$(document).ready(function documentReady(){
    var socket = io();
    var mouseIsDown = false;
    var running = false;
    var runButton = $('#run-button');
    var stopButton = $('#stop-button');
    var clearButton = $('#clear-button');
    var runningText = $('#running-text');
    var userColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    $(this).mousedown(function mouseIsDownSetter() {
        mouseIsDown = true;
    }).mouseup(function mouseIsUpSetter() {
        mouseIsDown = false;
    });
    $('td').on('mousedown', function cellMouseDownHandler(e){
        e.preventDefault();
        if(running){
            return;
        }
        var cell = $(this); 
        if(cell.hasClass('live')){
            socket.emit('cell-deselected', cell.attr('id'));
        }
        else{
            socket.emit('cell-selected', cell.attr('id'), userColor);
        }
    });
    $('td').on('mouseout', function cellMouseOutHandler(){
        if(running){
            return;
        }
        var cell = $(this); 
        if(mouseIsDown &&!cell.hasClass('live')){
            socket.emit('cell-selected', cell.attr('id'), userColor);
        }
    });

    clearButton.on('click', function clearButtonClickHandler(){
        console.log('clear button clicked');
        if(!running){
            socket.emit('clear');
        }
    });

    runButton.on('click', function runButtonClickHandler(){
        console.log('run button clicked')
        socket.emit('running');
        $(this).attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    });

    stopButton.on('click', function stopButtonClickHandler(){
        console.log('stop button clicked')
        socket.emit('stopping');
        $(this).attr('disabled', 'disabled');
        runButton.removeAttr('disabled');
        clearButton.removeAttr('disabled');
        runningText.hide();
    });

    socket.on('join', function socketJoinHandler(liveCells, isRunning, generationNumber){
        running = isRunning;
        $('#generation-number').text(generationNumber);
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
            var cell = $('#' + cellKey);
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
        console.log('client recieved nextGeneration event');
        $('#generation-number').text(generationNumber);
        var uiCell;
        for(cellKey in cellsBorn){
            uiCell = $('#' + cellKey);
            if(!uiCell.hasClass('live')){
                uiCell.addClass('live');
                uiCell.css('background-color', cellsBorn[cellKey]);
            }
        }
        for(cellKey in cellsDied){
            uiCell = $('#' + cellKey);
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
        $('#generation-number').text(0);
        clearAllCells();
    });

    socket.on('life', function socketLifeHandler(id, color){
        var cell = $('#' + id);
        if(!cell.hasClass('live')){
            cell.addClass('live');
            cell.css('background-color', color);
        }
    });

    socket.on('death', function socketDeathHandler(id){
        var cell = $('#' + id);
        if(cell.hasClass('live')){
            cell.removeClass('live');
            cell.css('background-color', '#eeeeee');
        } 
    });

    var clearAllCells = function clearAllCellsHandler() {
        $('.live').css('background-color', "#eeeeee");
        $('.live').removeClass('live');
    }
});    