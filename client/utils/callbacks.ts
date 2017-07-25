import { WebGLRenderer, Vec3 } from "webgl-renderer";
import { settings } from "./settings";
import { Grid } from "../grid/grid";

export class Callbacks
{
    public static resizeCanvas (window: Window, renderer: WebGLRenderer, canvas: HTMLCanvasElement): void
    {
        renderer.setViewPortDimensions(window.innerWidth, window.innerHeight);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - settings.buttonBarHeight;
        let grid = new Grid(canvas, renderer.gl);
        renderer.removeAllVeriticies();
        renderer.addShapesToScene(grid.squares);
        console.log("resizing");
    }

    public static renderLoop (renderer: WebGLRenderer, window: Window): void
    {
        // const currentEyePosition = renderer.camera.eyePosition;
        // const nextX = currentEyePosition.x - 0.01;
        // let newEyePosition = new Vec3(nextX, currentEyePosition.y, currentEyePosition.z);
        // renderer.camera.setCameraView(newEyePosition, renderer.camera.lookAtPoint, renderer.camera.upPosition);
        renderer.draw();
        window.requestAnimationFrame(() => { Callbacks.renderLoop(renderer, window); });
    };
}