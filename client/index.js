$(document).ready(function(){
    var socket = io();
    var mouseIsDown = false;
    
    var DEAD_COLOR = '#eeeeee';

    //not used yet
    var userColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    var colorCell = function(cell) {
        $('#' + cell.id).css('background-color', cell.alive ? cell.color : DEAD_COLOR);

        console.log($('#' + cell.id) + " is alive? " + cell.alive + " and has color " + cell.color);
    }

    var isAlive = function (jcell) {
        return jcell.css('background-color') === DEAD_COLOR;
    }

    $(this).mousedown(function() {
        mouseIsDown = true;
    }).mouseup(function() {
        mouseIsDown = false;
    });

    $('td').on('mousedown', function(e){
        e.preventDefault();

        var jcell = $(this);

        if(!isAlive(jcell)){
            socket.emit('add', jcell.attr('id'));
        }
    });
    $('td').on('mouseout', function(){
        var jcell = $(this);

        if(mouseIsDown && !isAlive(jcell)){
            socket.emit('add', jcell.attr('id'));
        }
    });

    socket.on('join', function(liveCells){
        liveCells.forEach(colorCell);
    });

    socket.on('iterate', function(cellsChanged){
        cellsChanged.forEach(colorCell);
    });

    socket.on('add', function(cell){
        colorCell(cell);
    });
});    