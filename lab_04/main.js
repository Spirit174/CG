import { readCircle } from "./circle.js";
import { FigureSelect } from "./fields.js";
import { Handler, CanvasProperties } from "./handler.js";
import { aboutProgram, aboutAthor } from './info.js';

const canvas = document.getElementById("Canvas")
const canvasBackgroundColor = document.getElementById("ColorBg");
canvasBackgroundColor.addEventListener("change", updateColorBG);

const canvasWidth = 640
const canvasHeight = 448
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const defaultCanvasProperties = new CanvasProperties(canvasWidth, canvasHeight, canvasBackgroundColor.value)
export const handler = new Handler(canvas, defaultCanvasProperties)

const aboutProgramButton = document.getElementById("ProgramBtn");
const aboutAthorButton = document.getElementById("AuthorBtn");
const undoButton = document.getElementById("UndoBtn");
const resetButton = document.getElementById("ResetBtn");

aboutAthorButton.addEventListener('click', aboutAthor);
aboutProgramButton.addEventListener('click', aboutProgram);
resetButton.addEventListener('click', reset);
// undoButton.addEventListener('click', undo);

const drawCircleBtn = document.getElementById('DrawCircleBtn')
drawCircleBtn.addEventListener('click', maindrawCircle)
export const FigColor = document.getElementById('ColorSelect')
const DrawAlg =  document.getElementById('Alg')

function maindrawCircle(){
    console.log("Draw circle")
    try{
        var circle = readCircle()
        // console.log(circle)
    } catch (error) {
        alert("Ошибка ввода круга")
        return
    }
    // console.log(DrawAlg.value)
    handler.drawCircle(circle, DrawAlg.value)
    // handler.CmdLog()
}

function reset() {
	handler.reset_all();
}

// function undo() {
// 	handler.undo();
// }

function updateColorBG() {
	handler.updateColorBG(canvasBackgroundColor.value);
    handler.CmdLog()
}
