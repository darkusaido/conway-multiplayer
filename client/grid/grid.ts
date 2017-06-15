import { settings } from "../utils/settings";
import { Rectangle, ShapeFactory } from "webgl-renderer";

export interface IGrid
{
    squares: Array<Rectangle>;
}

export class Grid
{
    private rows: number;
    private columns: number;
    private squaresArray: Array<Rectangle>;
    private gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext)
    {
        this.rows = Math.floor(canvas.height / settings.totalCellHeight);
        this.columns = Math.floor(canvas.width / settings.totalCellWidth);
        this.squaresArray = new Array<Rectangle>();
        this.gl = gl;

        this.populateSquares();
    }

    private populateSquares()
    {
        let cellWidthDecimal = (settings.cellWidth / 1000) * 10;
        let cellHeightDecimal = (settings.cellHeight / 1000) * 10;

        let xIncrement = (settings.totalCellWidth / 1000) * 10;
        let yIncrement = (settings.totalCellHeight / 1000) * 10;

        let currentY = 1.0;
        for (let i = 0; i < this.rows; i++)
        {
            for (let j = 0; j < this.columns; j++)
            {
                let currentX = -1.0;

                let startPoint = {x: currentX, y: currentY};
                let endPoint = {x: currentX + cellWidthDecimal, y: currentY - cellHeightDecimal};

                this.squaresArray.push(ShapeFactory.createShape(startPoint, endPoint, "rectangles",
                    settings.deadColor, this.gl));

                currentX += xIncrement;
            }
            currentY -= yIncrement;
        }
    }

    public get squares(): Array<Rectangle>
    {
        return this.squaresArray;
    }
}