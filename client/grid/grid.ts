import { settings } from "../utils/settings";
import { ShapeFactory, Vec3, Rectangle } from "webgl-renderer";

export interface IGrid
{
    squares: Array<Rectangle>;
}

export class Grid
{
    private rows: number;
    private columns: number;
    private rowHeight: number;
    private columnWidth: number;
    private cellWidth: number;
    private cellHeight: number;
    private squaresArray: Array<Rectangle>;
    private gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext)
    {
        this.rows = 200;
        this.columns = 200;
        this.rowHeight = 0.005;
        this.columnWidth = 0.005;
        this.cellHeight = 0.004;
        this.cellWidth = 0.004;

        this.squaresArray = new Array<Rectangle>();
        this.gl = gl;

        this.populateSquares();
    }

    private populateSquares()
    {
        let currentY = 0.5;
        for (let i = 0; i < this.rows; i++)
        {
            let currentX = -0.5;
            for (let j = 0; j < this.columns; j++)
            {
                let startPoint = new Vec3(currentX, currentY);
                let endPoint = new Vec3((currentX + this.cellWidth), (currentY - this.cellHeight));

                this.squaresArray.push(ShapeFactory.createShape(startPoint, endPoint, "rectangles",
                    this.gl, settings.deadColor) as Rectangle);

                currentX += this.columnWidth;
            }
            currentY -= this.rowHeight;
        }
    }

    public get squares(): Array<Rectangle>
    {
        return this.squaresArray;
    }
}