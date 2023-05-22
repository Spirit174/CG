import { CanvasHandler, CanvasProperties } from './canvasHandler.js'
import { getID, initDot } from './dot.js'
import { aboutAuthor, aboutProgram } from './about.js'

const aboutProgramButton = document.getElementById("ProgramBtn")
aboutProgramButton.addEventListener('click', aboutProgram)
const aboutAuthorButton = document.getElementById("AuthorBtn")
aboutAuthorButton.addEventListener('click', aboutAuthor)

const bgColor = document.getElementById("ColorBg")
bgColor.addEventListener('change', updateBG)

const borderColor = document.getElementById("ColorSelect")
borderColor.addEventListener('change', updateBorderColor)

const figureColor = document.getElementById("ColorFillSelect")

const CutterBordColor = document.getElementById("ColorCutterSelect")

const undoButton = document.getElementById("UndoBtn")
undoButton.addEventListener('click', undo)

const resetButton = document.getElementById("ResetBtn")
resetButton.addEventListener('click', reset)

const closeFigureButton = document.getElementById("CloseFigBtn")
closeFigureButton.addEventListener('click', closeFigure)

const closeCutterButton = document.getElementById("CloseCutterBtn")
closeCutterButton.addEventListener('click', closeCutterFigure)

const CutBtn = document.getElementById("CutBtn")
CutBtn.addEventListener('click', cutFig)

const dotXInput = document.getElementById("dotXInput")
const dotYInput = document.getElementById("dotYInput")
const addDotButton = document.getElementById("AddDotBtn")
addDotButton.addEventListener('click', addDot)
// const AddDotcutButton = document.getElementById("AddDotcut")
// AddDotcutButton.addEventListener('click', addSeed)

var sceneWidth = 640
var sceneHeight = 480
var stage = new Konva.Stage({
	container: 'Canvas',
	width: sceneWidth,
	height: sceneHeight,
})
const defaultCanvasProperties = new CanvasProperties(bgColor.value, borderColor.value, CutterBordColor.value)
export const canvasHandler = new CanvasHandler(stage, defaultCanvasProperties)

stage.on('click', onMouseDown)
function onMouseDown(event) {
	if (event.target == stage && event.evt.button == 0) {
		let mousePos = stage.getRelativePointerPosition()
		mousePos.x = Math.round(mousePos.x)
		mousePos.y = Math.round(mousePos.y)
		let dot = initDot(mousePos)
		addDefaultFuncs(dot)
		if (enterSelect()) {
			addDefaultFuncs(dot)
			canvasHandler.addDotfig(dot, borderColor.value)
		} else {
			addDefaultFuncsCutter(dot)
			canvasHandler.addDot(dot, CutterBordColor.value)
		}
	}
}

export function enterSelect() {
    return document.getElementById("delaySwitch").checked
}

stage.on('contextmenu', function(event) {
	event.evt.preventDefault();
	let id = canvasHandler.dots.length - 1
	canvasHandler.closeFigure(id)
})

function cutFig() {
	canvasHandler.cut(figureColor.value)
}

function fitStageIntoParentContainer() {
	var container = document.querySelector('#stage-parent')
	var containerWidth = container.offsetWidth
	var scale = containerWidth / sceneWidth
	stage.width(sceneWidth * scale)
	stage.height(sceneHeight * scale)
	stage.scale({ x: scale, y: scale })
}
fitStageIntoParentContainer()
window.addEventListener('resize', fitStageIntoParentContainer)

function closeFigure() {
	let id = canvasHandler.dots.length - 1
	canvasHandler.closeFigure(id)
}

function closeCutterFigure() {
	let id = canvasHandler.dotscutter.length - 1
	canvasHandler.closeFigureCut(id)
}


function undo() {
	canvasHandler.undo()
	bgColor.value = canvasHandler.properties.bgColor
	borderColor.value = canvasHandler.properties.borderColor
}

function reset() {
	canvasHandler.setDefault()
	bgColor.value = canvasHandler.properties.bgColor
}

function updateBG() {
	canvasHandler.updateBG(bgColor.value)
}

function roundCoords(shape) {
	shape.x(Math.round(shape.x()))
	shape.y(Math.round(shape.y()))
}

function addDot() {
	readPoint(dotXInput, dotYInput).then(
		result => {
			let dot = initDot(result)
			addDefaultFuncs(dot)
			canvasHandler.addDot(dot, borderColor.value)
		},
		
		error => {
			alert(error)
			console.warn(error)
		}
	)
}

// function addSeed() {
// 	readPoint(dotXInput, dotYInput).then(
// 		result => {
// 			let seed = initDot(result)
// 			addDefaultFuncs(seed)
// 			addSeedParams(seed)
// 			canvasHandler.addSeed(seed)
// 			tableHandler.addSeed(getDotParams(seed))
// 		},
		
// 		error => {
// 			alert(error)
// 			console.warn(error)
// 		}
// 	)
// }

function addDefaultFuncs(dot) {
	dot.on('dragstart', function () {
        canvasHandler.onStartDragging(dot)
    })
    dot.on('dragmove', function() {
        canvasHandler.updateConnection(getID(dot))
        roundCoords(dot)
    })
    dot.on('dragend', function() {
        roundCoords(dot)
    })
}
function addDefaultFuncsCutter(dot) {
	dot.on('dragstart', function () {
        canvasHandler.onStartDragging(dot)
    })
    dot.on('dragmove', function() {
        canvasHandler.updateConnectionCutter(getID(dot))
        roundCoords(dot)
    })
    dot.on('dragend', function() {
        roundCoords(dot)
    })
}


// function addSeedParams(seed) {
// 	seed.radius(2)
// 	seed.fill("red")
// 	seed.opacity(1)
// }

function updateBorderColor() {
	canvasHandler.updateBordersColor(borderColor.value)
}

function readPoint(xField, yField) {
	let x = xField.value
	let y = yField.value
	
	return new Promise((resolve, reject) => {
		if (x.length == 0 || y.length == 0) {
			reject("Пустой ввод.")
		}
		if (isNaN(x) || isNaN(y)) {
			reject("Введено не число.")
		}
		resolve({x: Number(x), y: Number(y)})
	})
}
