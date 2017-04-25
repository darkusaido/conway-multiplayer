import * as io from "socket.io";

document.addEventListener("DOMContentLoaded", () => {
    let socket = io();
    let mouseIsDown = false;
    let running = false;
    let tds = document.getElementsByTagName("td");
    let runButton = document.getElementById("run-button");
    let stopButton = document.getElementById("stop-button");
    let clearButton = document.getElementById("clear-button");
    let runningText = document.getElementById("running-text");
    let generationNumber = document.getElementById("generation-number");
    let userColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

    document.addEventListener("mousedown", () => {
        mouseIsDown = true;
    }, false);
    document.addEventListener("mousedown", () => {
        mouseIsDown = false;
    }, false);

    for(let td of tds)
    {
        td.addEventListener("mousedown", (event: MouseEvent) =>
        {
            event.preventDefault();
            if(running){
                return;
            }
            let cell = event.target as HTMLElement;
            if(cell.classList.contains("live")){
                socket.emit("cell-deselected", cell.getAttribute("id"));
            }
            else{
                socket.emit("cell-selected", cell.getAttribute("id"), userColor);
            }
        }, false);
        td.addEventListener("mouseout", () =>
        {
            if(running){
                return;
            }
            let cell = event.target as HTMLElement;
            if(mouseIsDown &&!cell.classList.contains("live")){
                socket.emit("cell-selected", cell.getAttribute("id"), userColor);
            }
        }, false);
    }

    clearButton.addEventListener("click", () => {
        if(!running){
            socket.emit("clear");
        }
    }, false);

    runButton.addEventListener("click", () => {
        socket.emit("running");
        runButton.setAttribute("disabled", "disabled");
        stopButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "disabled");
        runningText.classList.remove("hidden");
    }, false);

    stopButton.addEventListener("click", (event) => {
        socket.emit("stopping");
        stopButton.setAttribute("disabled", "disabled");
        runButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "");
        runningText.classList.add("hidden");
    }, false);

    socket.on("join", function socketJoinHandler(liveCells: Array<any>, isRunning, generationNumber){
        running = isRunning;
        generationNumber.innerHTML = generationNumber;
        if(running){
            runButton.setAttribute("disabled", "disabled");
            stopButton.setAttribute("disabled", "");
            clearButton.setAttribute("disabled", "disabled");
            runningText.classList.remove("hidden");
        }
        else{
            runButton.setAttribute("disabled", "");
            stopButton.setAttribute("disabled", "disabled");
            clearButton.setAttribute("disabled", "");
            runningText.classList.add("hidden");
        }
        clearAllCells();
        for(let cellKey in liveCells){
            let cell = document.getElementById(cellKey);
            if(!cell.classList.contains("live")){
                cell.classList.add("live");
                cell.style.backgroundColor = liveCells[cellKey];
            }
        }
    });

    socket.on("running", function socketGameRunningHandler(){
        running = true;
        runButton.setAttribute("disabled", "disabled");
        stopButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "disabled");
        runningText.classList.remove("hidden");
    });

    socket.on("nextGeneration", function socketNextGenerationHandler(generationNumber, cellsBorn: Array<any>, cellsDied: Array<any>){
        generationNumber.innerHTML = generationNumber;
        let uiCell: HTMLElement;
        for(let cellKey in cellsBorn){
            uiCell = document.getElementById(cellKey);
            if(!uiCell.classList.contains("live")){
                uiCell.classList.add("live");
                uiCell.style.backgroundColor = cellsBorn[cellKey];
            }
        }
        for(let cellKey in cellsDied){
            uiCell = document.getElementById(cellKey);
            if(uiCell.classList.contains("live")){
                uiCell.classList.remove("live");
                uiCell.style.backgroundColor = "#eeeeee";
        }
        }
    });

    socket.on("stopping", function socketGameStoppingHandler(){
        running = false;
        stopButton.setAttribute("disabled", "disabled");
        runButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "");
        runningText.classList.add("hidden");
    });

    socket.on("clear", function socketClearingHandler(){
        generationNumber.innerHTML  = "0";
        clearAllCells();
    });

    socket.on("life", function socketLifeHandler(id, color){
        let cell = document.getElementById(id);
        if(!cell.classList.contains("live")){
            cell.classList.add("live");
            cell.style.backgroundColor = color;
        }
    });

    socket.on("death", function socketDeathHandler(id){
        let cell = document.getElementById(id);
        if(cell.classList.contains("live")){
            cell.classList.remove("live");
            cell.style.backgroundColor = "#eeeeee";
    }
    });

    let clearAllCells = function clearAllCellsHandler() {
        let liveOnes = document.getElementsByClassName("live");
        for(let i = 0; i < liveOnes.length; i++)
        {
            let liveOne = liveOnes[i] as HTMLElement;
            liveOne.style.backgroundColor = "#eeeeee";
            liveOne.classList.remove("live");
        }
    }
});