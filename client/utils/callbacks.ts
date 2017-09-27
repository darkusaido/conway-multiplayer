import { WebGLRenderer } from "webgl-renderer";
import { settings } from "./settings";

export class Callbacks
{
    public static resizeCanvas (canvas: HTMLCanvasElement, window: Window, renderer: WebGLRenderer): void
    {
        renderer.setViewPortDimensions(window.innerWidth, window.innerHeight);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - settings.buttonBarHeight;
        console.log("resizing");
    }
}

