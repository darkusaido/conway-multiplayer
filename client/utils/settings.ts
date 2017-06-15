import { RGBColor } from "webgl-renderer";

const cellWidth: number = 50;
const cellHeight: number = 50;
const cellSpacing: number = 10;
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