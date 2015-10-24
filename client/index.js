$(document).ready(function(){
    var socket = io();
    var mouseIsDown = false;
    var running = false;
    var runButton = $('#run-button');
    var stopButton = $('#stop-button');
    var clearButton = $('#clear-button');
    var runningText = $('#running-text');
    $(this).mousedown(function() {
        mouseIsDown = true;
    }).mouseup(function() {
        mouseIsDown = false;
    });
    $('td').on('mousedown', function(e){
        e.preventDefault();
        if(running){
            return;
        }
        var cell = $(this); 
        if(cell.hasClass('live')){
            socket.emit('cell-deselected', cell.attr('id'));
        }
        else{
            socket.emit('cell-selected', cell.attr('id'));
        }
    });
    $('td').on('mouseout', function(){
        if(running){
            return;
        }
        var cell = $(this); 
        if(mouseIsDown &&!cell.hasClass('live')){
            socket.emit('cell-selected', cell.attr('id'));
        }
    });

    clearButton.on('click', function(){
        console.log('clear button clicked');
        if(!running){
            socket.emit('clear');
        }
    });

    runButton.on('click', function(){
        console.log('run button clicked')
        socket.emit('running');
        $(this).attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    });

    stopButton.on('click', function(){
        console.log('stop button clicked')
        socket.emit('stopping');
        $(this).attr('disabled', 'disabled');
        runButton.removeAttr('disabled');
        clearButton.removeAttr('disabled');
        runningText.hide();
    });

    socket.on('join', function(liveCells, isRunning, generationNumber){
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
        for(cellKey in liveCells){
            var cell = $('#' + liveCells[id]);
            if(!cell.hasClass('live')){
                cell.addClass('live');
            }
        }
    });

    socket.on('running', function(){
        running = true;
        runButton.attr('disabled', 'disabled');
        stopButton.removeAttr('disabled');
        clearButton.attr('disabled', 'disabled');
        runningText.show();
    });

    socket.on('nextGen', function(generationNumber, cellsBorn, cellsDied){
        $('#generation-number').text(generationNumber);
        var uiCell;
        for(cell in cellsBorn){
            uiCell = $('#' + cell.id);
            if(!uiCell.hasClass('live')){
                uiCell.addClass('live');
            }
        }
        for(cell in cellsDied){
            uiCell = $('#' + cell.id);
            if(uiCell.hasClass('live')){
                uiCell.removeClass('live');
            }    
        }
    });

    socket.on('stopping', function(){
        running = false;
        stopButton.attr('disabled', 'disabled');
        runButton.removeAttr('disabled');
        clearButton.removeAttr('disabled');
        runningText.hide();
    });

    socket.on('clear', function(liveCells){
        for(cellKey in liveCells){
            var cell = $('#' + liveCells[cellKey]);
            if(cell.hasClass('live')){
                cell.removeClass('live');
            }
        }
    });

    socket.on('life', function(id){
        console.log('life at ' + id);
        var cell = $('#' + id);
        if(!cell.hasClass('live')){
            cell.addClass('live');
        }
    });

    socket.on('death', function(id){
        console.log('death at ' + id);
        var cell = $('#' + id);
        if(cell.hasClass('live')){
            cell.removeClass('live');
        } 
    });
});    