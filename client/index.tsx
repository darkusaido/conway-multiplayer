import * as io from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WebGLRenderer, RenderingOptions, RGBColor, Camera, Vec3 } from "webgl-renderer";
import { Callbacks } from "./utils/callbacks";
import { ButtonBar } from "./components/buttonBar";

declare var WebGLDebugUtils: any;

class App extends React.Component<{}, {}>
{
    constructor()
    {
        super();

        let canvas = document.getElementById("mycanvas") as HTMLCanvasElement;

        let eyePosition = new Vec3(0, 0, 1);
        let lookAtPoint = new Vec3(0, 0, 0);
        let upPosition = new Vec3(0, 1, 1);
        let camera = new Camera(eyePosition, lookAtPoint, upPosition);

        let options: RenderingOptions =
        {
            backgroundColor: new RGBColor(0.8, 0.8, 0.8),
            fullscreen: true,
            resizeCallback: Callbacks.resizeCanvas,
            camera: camera
        };

        const renderer = new WebGLRenderer(canvas, options);

        renderer.start();
    }

    public render()
    {
        return (
            <ButtonBar/>
        );
    }
}

document.addEventListener("DOMContentLoaded", () =>
{
    domReady();
    ReactDOM.render(<App/>, document.getElementById("main"));
});

export function domReady()
{
    let socket = io();

    socket.on("join", function socketJoinHandler(liveCells: Array<any>, isRunning, generationNumber)
    {
        // running = isRunning;
        // generationNumberText.innerHTML = generationNumber;
        // if (running)
        // {
        //     runButton.setAttribute("disabled", "disabled");
        //     stopButton.setAttribute("disabled", "");
        //     clearButton.setAttribute("disabled", "disabled");
        //     runningText.classList.remove("hidden");
        // }
        // else
        // {
        //     runButton.setAttribute("disabled", "");
        //     stopButton.setAttribute("disabled", "disabled");
        //     clearButton.setAttribute("disabled", "");
        //     runningText.classList.add("hidden");
        // }
        // clearAllCells();
        // // tslint:disable-next-line:forin
        // for (let cellKey in liveCells)
        // {
        //     let cell = document.getElementById(cellKey);
        //     if (!cell) { return; }

        //     if (!cell.classList.contains("live"))
        //     {
        //         cell.classList.add("live");
        //         cell.style.backgroundColor = liveCells[cellKey];
        //     }
        // }
    });

    /*let socket = io();
    let mouseIsDown = false;
    let running = false;
    const tds = document.getElementsByTagName("td");
    const runButton = document.getElementById("run-button");
    const stopButton = document.getElementById("stop-button");
    const clearButton = document.getElementById("clear-button");
    const runningText = document.getElementById("running-text");
    const generationNumberText = document.getElementById("generation-number");

    if (!tds) { throw ("table cells not found"); }
    if (!runButton) { throw ("run button not found"); }
    if (!stopButton) { throw ("stop button not found"); }
    if (!clearButton) { throw ("clear button not found"); }
    if (!runningText) { throw ("running text not found"); }
    if (!generationNumberText) { throw ("generation number not found"); }

    // tslint:disable-next-line:no-bitwise
    let userColor = "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16));

    let clearAllCells = function clearAllCellsHandler()
    {
        let liveOnes = document.getElementsByClassName("live");
        for (let i = 0; i < liveOnes.length; i++)
        {
            let liveOne = liveOnes[i] as HTMLElement;
            liveOne.style.backgroundColor = "#eeeeee";
            liveOne.classList.remove("live");
        }
    };

    document.addEventListener("mousedown", () =>
    {
        mouseIsDown = true;
    }, false);
    document.addEventListener("mousedown", () =>
    {
        mouseIsDown = false;
    }, false);

    for (let i = 0; i < tds.length; i++)
    {
        let td = tds[i];

        td.addEventListener("mousedown", (event: MouseEvent) =>
        {
            event.preventDefault();
            if (running)
            {
                return;
            }
            let cell = event.target as HTMLElement;
            if (cell.classList.contains("live"))
            {
                socket.emit("cell-deselected", cell.getAttribute("id"));
            }
            else
            {
                socket.emit("cell-selected", cell.getAttribute("id"), userColor);
            }
        }, false);
        td.addEventListener("mouseout", () =>
        {
            if (!event) { return; }
            if (running)
            {
                return;
            }
            let cell = event.target as HTMLElement;
            if (mouseIsDown && !cell.classList.contains("live"))
            {
                socket.emit("cell-selected", cell.getAttribute("id"), userColor);
            }
        }, false);
    }

    clearButton.addEventListener("click", () =>
    {
        if (!running)
        {
            socket.emit("clear");
        }
    }, false);

    runButton.addEventListener("click", () =>
    {
        socket.emit("running");
        runButton.setAttribute("disabled", "disabled");
        stopButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "disabled");
        runningText.classList.remove("hidden");
    }, false);

    stopButton.addEventListener("click", (event) =>
    {
        socket.emit("stopping");
        stopButton.setAttribute("disabled", "disabled");
        runButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "");
        runningText.classList.add("hidden");
    }, false);

    socket.on("join", function socketJoinHandler(liveCells: Array<any>, isRunning, generationNumber)
    {
        running = isRunning;
        generationNumberText.innerHTML = generationNumber;
        if (running)
        {
            runButton.setAttribute("disabled", "disabled");
            stopButton.setAttribute("disabled", "");
            clearButton.setAttribute("disabled", "disabled");
            runningText.classList.remove("hidden");
        }
        else
        {
            runButton.setAttribute("disabled", "");
            stopButton.setAttribute("disabled", "disabled");
            clearButton.setAttribute("disabled", "");
            runningText.classList.add("hidden");
        }
        clearAllCells();
        // tslint:disable-next-line:forin
        for (let cellKey in liveCells)
        {
            let cell = document.getElementById(cellKey);
            if (!cell) { return; }

            if (!cell.classList.contains("live"))
            {
                cell.classList.add("live");
                cell.style.backgroundColor = liveCells[cellKey];
            }
        }
    });

    socket.on("running", function socketGameRunningHandler()
    {
        running = true;
        runButton.setAttribute("disabled", "disabled");
        stopButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "disabled");
        runningText.classList.remove("hidden");
    });

    socket.on("nextGeneration", function socketNextGenerationHandler(generationNumber, cellsBorn: Array<any>, cellsDied: Array<any>)
    {
        generationNumberText.innerHTML = generationNumber;
        let cell: HTMLElement | null;
        // tslint:disable-next-line:forin
        for (let cellKey in cellsBorn)
        {
            cell = document.getElementById(cellKey);
            if (!cell) { return; }

            if (!cell.classList.contains("live"))
            {
                cell.classList.add("live");
                cell.style.backgroundColor = cellsBorn[cellKey];
            }
        }
        // tslint:disable-next-line:forin
        for (let cellKey in cellsDied)
        {
            cell = document.getElementById(cellKey);
            if (!cell) { return; }

            if (cell.classList.contains("live"))
            {
                cell.classList.remove("live");
                cell.style.backgroundColor = "#eeeeee";
            }
        }
    });

    socket.on("stopping", function socketGameStoppingHandler()
    {
        running = false;
        stopButton.setAttribute("disabled", "disabled");
        runButton.setAttribute("disabled", "");
        clearButton.setAttribute("disabled", "");
        runningText.classList.add("hidden");
    });

    socket.on("clear", function socketClearingHandler()
    {
        generationNumberText.innerHTML = "0";
        clearAllCells();
    });

    socket.on("life", function socketLifeHandler(id, color)
    {
        let cell = document.getElementById(id);
        if (!cell) { return; }

        if (!cell.classList.contains("live"))
        {
            cell.classList.add("live");
            cell.style.backgroundColor = color;
        }
    });

    socket.on("death", function socketDeathHandler(id)
    {
        let cell = document.getElementById(id);
        if (!cell) { return; }

        if (cell.classList.contains("live"))
        {
            cell.classList.remove("live");
            cell.style.backgroundColor = "#eeeeee";
        }
    });*/
};