import { settings } from "../utils/settings";
import { Shape2d, ShapeFactory, Vec3 } from "webgl-renderer";

export interface IGrid
{
    squares: Array<Shape2d>;
}

export class Grid
{
    private rows: number;
    private columns: number;
    private rowHeight: number;
    private columnWidth: number;
    private cellWidthDecimal: number;
    private cellHeightDecimal: number;
    private squaresArray: Array<Shape2d>;
    private gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext)
    {
        this.rows = Math.floor(canvas.height / settings.totalCellHeight);
        this.columns = Math.floor(canvas.width / settings.totalCellWidth);
        this.rowHeight = settings.totalCellHeight / (canvas.height / 2);
        this.columnWidth = settings.totalCellWidth / (canvas.width / 2);
        this.cellHeightDecimal = settings.cellHeight / (canvas.height / 2);
        this.cellWidthDecimal = settings.cellWidth / (canvas.width / 2);

        this.squaresArray = new Array<Shape2d>();
        this.gl = gl;

        this.populateSquares();
    }

    private populateSquares()
    {
        let currentY = 1.0;
        for (let i = 0; i < this.rows; i++)
        {
            let currentX = -1.0;
            for (let j = 0; j < this.columns; j++)
            {
                let startPoint = new Vec3(currentX, currentY);
                let endPoint = new Vec3((currentX + this.cellWidthDecimal),(currentY - this.cellHeightDecimal));

                this.squaresArray.push(ShapeFactory.createShape(startPoint, endPoint, "rectangles",
                    this.gl, settings.deadColor));

                currentX += this.columnWidth;
            }
            currentY -= this.rowHeight;
        }
    }

    public get squares(): Array<Shape2d>
    {
        return this.squaresArray;
    }
}