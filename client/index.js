$(document).ready(function documentReady(){
    var socket = io();
    var mouseIsDown = false;
    var running = false;
    var runButton = $('#run-button');
    var stopButton = $('#stop-button');
    var clearButton = $('#clear-button');
    var runningText = $('#running-text');
    var userColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    var colorCell = function($cell, cell) {
        $cell.css('background-color', cell.color);
        console.log($cell + " is being set to " + cell.color);
    }

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
            var cell = $('#' + liveCells[cellKey].id);
            if(!cell.hasClass('live')){
                cell.addClass('live');
            }
            colorCell(cell, liveCells[cellKey]);
        }
    });

    socket.on('running', function socketGameRunningHandler(){
        running = true;
        runButton.attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    });

    //inconsistent looping of cells compared to socket.join 
    socket.on('nextGen', function socketNextGenerationHandler(generationNumber, cellsBorn, cellsDied){
        $('#generation-number').text(generationNumber);
        var uiCell;
        for(cell in cellsBorn){
            uiCell = $('#' + cellsBorn[cell].id);
            colorCell(uiCell, cellsBorn[cell]);
            if(!uiCell.hasClass('live')){
                uiCell.addClass('live');
            }
        }
        for(cell in cellsDied){
            uiCell = $('#' + cellsDied[cell].id);
            uiCell.css('background-color', "#eeeeee");

            if(uiCell.hasClass('live')){
                uiCell.removeClass('live');
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

    //unneccesary liveCells being passed
    socket.on('clear', function socketClearingHandler(liveCells, generationNumber){
        $('#generation-number').text(generationNumber);
        clearAllCells();
    });

    socket.on('life', function socketLifeHandler(cellObj){
        id = cellObj.id;
        console.log('life at ' + JSON.stringify(cellObj));
        var cell = $('#' + id);
        colorCell(cell, cellObj)
        if(!cell.hasClass('live')){
            cell.addClass('live');
        }
    });

    socket.on('death', function socketDeathHandler(id){
        console.log('death at ' + id);
        var cell = $('#' + id);
        cell.css('background-color', "#eeeeee");
        if(cell.hasClass('live')){
            cell.removeClass('live');
        } 
    });

    var clearAllCells = function clearAllCellsHandler() {
        $('.live').css('background-color', "#eeeeee");
        $('.live').removeClass('live');
    }
});    