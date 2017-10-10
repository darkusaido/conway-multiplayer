import * as io from "socket.io-client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WebGL3dRenderer, RenderingOptions, RGBColor } from "webgl-renderer";
import * as Combokeys from "combokeys";

import { ButtonBar } from "./components/buttonBar";
import { Grid } from "./grid/grid";
import { settings } from "./utils/settings";

declare var WebGLDebugUtils: any;

class App extends React.Component<{}, {}>
{
    private renderer: WebGL3dRenderer;
    private keyHandlers: Combokeys.Combokeys;

    constructor()
    {
        super();

        let canvas = document.getElementById("mycanvas") as HTMLCanvasElement;

        this.keyHandlers = new Combokeys(document.documentElement);
        this.bindArrowKeys();

        const calcHeight = (newHeight: number) => newHeight - settings.buttonBarHeight;
        let options: RenderingOptions =
        {
            backgroundColor: new RGBColor(0.8, 0.8, 0.8),
            fullscreen: true,
            calcHeight: calcHeight
        };

        this.renderer = new WebGL3dRenderer(canvas, options);

        let grid = new Grid(canvas, this.renderer.gl);
        this.renderer.addHomogenoeusShapesArrayToScene(grid.squares);

        this.renderer.start();
    }

    public render()
    {
        return (
            <ButtonBar/>
        );
    }

    private bindArrowKeys()
    {
        this.keyHandlers.bind("pageup", () =>
        {
            const leCamera = this.renderer.camera;
            leCamera.zoomIn();
        });
        this.keyHandlers.bind("pagedown", () =>
        {
            const leCamera = this.renderer.camera;
            leCamera.zoomOut();
        });
        this.keyHandlers.bind("down", () =>
        {
            const leCamera = this.renderer.camera;
            leCamera.panY(-0.02);
        });
        this.keyHandlers.bind("up", () => {
            const leCamera = this.renderer.camera;
            leCamera.panY(0.02);
        });
        this.keyHandlers.bind("left", () => {
            const leCamera = this.renderer.camera;
            leCamera.panX(-0.02);
        });
        this.keyHandlers.bind("right", () => {
            const leCamera = this.renderer.camera;
            leCamera.panX(0.02);
        });
    }
}

document.addEventListener("DOMContentLoaded", () =>
{
    domReady();
    ReactDOM.render(<App/>, document.getElementById("main"));
});

export function domReady()
{
    // let socket = io();

    // socket.on("join", function socketJoinHandler(liveCells: Array<any>, isRunning, generationNumber)
    // {
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
    // });

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