import { readCircle, readCircleSpectrum } from "./circle.js";
import { FigureSelect } from "./fields.js";
import { Handler, CanvasProperties } from "./handler.js";
import { aboutProgram, aboutAthor } from './info.js';
import { readEllipse, readEllipseSpectrum } from "./ellipse.js";
import { measureCalculatingTime } from './charts.js';

const canvas = document.getElementById("Canvas")
const canvasBackgroundColor = document.getElementById("ColorBg");
canvasBackgroundColor.addEventListener("change", updateColorBG);
const canvasStartYLabelRow = document.getElementById("canvasStartYLabelRow")
const canvasStartXLabelColumn = document.getElementById("canvasStartXLabelColumn")
const canvasStartYLabel = document.getElementById("canvasStartYLabel")
const canvasStartXLabel = document.getElementById("canvasStartXLabel")
const bottomRightYLabelRow = document.getElementById("bottomRightYLabelRow")
const bottomRightXLabelColumn = document.getElementById("bottomRightXLabelColumn")
const bottomRightYLabel = document.getElementById("bottomRightYLabel")
const bottomRightXLabel = document.getElementById("bottomRightXLabel")

const canvasWidth = 640
const canvasHeight = 448
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const aspectRatio = canvasWidth / canvasHeight

const defaultCanvasProperties = new CanvasProperties(canvasWidth, canvasHeight, canvasBackgroundColor.value, 5, aspectRatio)
export const handler = new Handler(canvas, defaultCanvasProperties)
updAxis()

const aboutProgramButton = document.getElementById("ProgramBtn");
const aboutAthorButton = document.getElementById("AuthorBtn");
const undoButton = document.getElementById("UndoBtn");
const resetButton = document.getElementById("ResetBtn");

aboutAthorButton.addEventListener('click', aboutAthor);
aboutProgramButton.addEventListener('click', aboutProgram);
resetButton.addEventListener('click', reset);
undoButton.addEventListener('click', undo);

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
		// console.log(error)
        alert("Ошибка ввода круга")
        return
    }
    // console.log(DrawAlg.value)
    handler.drawCircle(circle, DrawAlg.value)
    // handler.CmdLog()
	updAxis()
}

const drawEllipseBtn = document.getElementById('DrawEllipseBtn')
drawEllipseBtn.addEventListener('click', maindrawEllipse)

function maindrawEllipse(){
    console.log("Draw Ellipse")
    try {
		var ellipse = readEllipse()
        // console.log(ellipse)
	} catch (error) {
        // console.log(error)
		alert("Ошибка ввода эллипса")
		return
	}
	handler.drawEllipse(ellipse, DrawAlg.value)
	updAxis()
}

function reset() {
	handler.reset_all();
	updAxis()
}

function undo() {
	handler.undo();
}

function updateColorBG() {
	handler.updateColorBG(canvasBackgroundColor.value);
    handler.CmdLog()
}

const drawSpecBtn = document.getElementById('DrawSpecBtn')
drawSpecBtn.addEventListener('click', drawSpec)
const drawSpeccBtn = document.getElementById('DrawSpeccBtn')
drawSpeccBtn.addEventListener('click', drawSpec)


function drawSpec() {
	const figure = FigureSelect.value
    console.log(figure)
	if (figure == "Circle") {
		try {
			let circleSpectrum = readCircleSpectrum()
			handler.drawCircleSpectrum(circleSpectrum, DrawAlg.value)
		} catch (error) {
            console.log(error)
			alert("Некорректные данные.")
			return
		}
	} else if (figure == "Ellipse") {
		try {
			let ellipseSpectrum = readEllipseSpectrum()
            console.log("ellipse")
			handler.drawEllipseSpectrum(ellipseSpectrum, DrawAlg.value)
		} catch (error) {
            console.log(error)
			alert("Некорректные данные.")
			return
		}
	}
	updAxis()
}

function updAxis() {
	const xAxis = Math.abs(handler.properties.canvasStartX)
	const yAxis = Math.abs(handler.properties.canvasStartY)
	console.log(xAxis)
	console.log(yAxis)
	
	canvasStartXLabelColumn.style.textIndent = (Math.round(100 * yAxis / handler.canvas.height)).toString()+"%"
	canvasStartXLabel.innerText = handler.properties.canvasStartX

	canvasStartYLabelRow.style.textIndent = (Math.round(100 * xAxis / handler.canvas.width)).toString()+"%"
	canvasStartYLabel.innerText = handler.properties.canvasStartY

	bottomRightXLabelColumn.style.textIndent = (Math.round(100 * yAxis / handler.canvas.height)).toString()+"%"
	bottomRightXLabel.innerText = (handler.canvas.width + handler.properties.canvasStartX).toString()

	bottomRightYLabelRow.style.textIndent = (Math.round(100 * xAxis / handler.canvas.width)).toString()+"%"
	bottomRightYLabel.innerText = (handler.canvas.height + handler.properties.canvasStartY).toString()	
}

const calcSpectrumStatsButton = document.getElementById("Calcstat")
calcSpectrumStatsButton.addEventListener('click', measureCalculatingTime)