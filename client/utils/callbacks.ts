import { IWebGLRenderer } from "webgl-renderer";
import { settings } from "./settings";
import { Grid } from "../grid/grid";

export class Callbacks
{
    public static resizeCanvas (window: Window, renderer: IWebGLRenderer, canvas: HTMLCanvasElement): void
    {
        renderer.setViewPortDimensions(window.innerWidth, window.innerHeight);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - settings.buttonBarHeight;
        let grid = new Grid(canvas, renderer.gl);
        renderer.addShapesToScene(grid.squares);
        console.log("resizing");
    }

    public static renderLoop (renderer: IWebGLRenderer, window: Window): void
    {
        renderer.draw();
        window.requestAnimationFrame(() => { Callbacks.renderLoop(renderer, window); });
    };
}