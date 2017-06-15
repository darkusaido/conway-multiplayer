import { RGBColor } from "webgl-renderer";

const cellWidth: number = 10;
const cellHeight: number = 10;
const cellSpacing: number = 1;
const totalCellWidth: number = cellWidth + cellSpacing;
const totalCellHeight: number = cellHeight + cellSpacing;
const deadColor = new RGBColor(0.9, 0.9, 0.9);

export let settings = {
    buttonBarHeight: 50,
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellSpacing: cellSpacing,
    totalCellWidth: totalCellWidth,
    totalCellHeight: totalCellHeight,
    deadColor: deadColor
};