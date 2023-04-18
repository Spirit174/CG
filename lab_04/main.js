import { readCircle } from "./circle.js";
import { FigureSelect } from "./fields.js";
import { aboutProgram, aboutAthor } from './info.js'

const canvas = document.getElementById("Canvas")

const canvasWidth = 640
const canvasHeight = 448
canvas.width = canvasWidth;
canvas.height = canvasHeight;


const aboutProgramButton = document.getElementById("ProgramBtn");
const aboutAthorButton = document.getElementById("AuthorBtn");
const undoButton = document.getElementById("UndoBtn");
const resetButton = document.getElementById("ResetBtn");

aboutAthorButton.addEventListener('click', aboutAthor);
aboutProgramButton.addEventListener('click', aboutProgram);
// resetButton.addEventListener('click', reset);
// undoButton.addEventListener('click', undo);

const drawCircleBtn = document.getElementById('DrawCircleBtn')
drawCircleBtn.addEventListener('click', drawCircle)
export const FigColor = document.getElementById('ColorSelect')

function drawCircle(){
    console.log("Draw circle");
    try{
        let circle = readCircle();
    } catch (error) {
        alert("Ошибка ввода круга");
        return
    }
    
}



