import { Handler, CanvasProperties, ChoseObj } from "./handler.js";
import { aboutProgram, aboutAthor } from './info.js';
import { FigColor } from "./figcolor.js";

const aboutProgramButton = document.getElementById("ProgramBtn");
const aboutAthorButton = document.getElementById("AuthorBtn");
const undoButton = document.getElementById("UndoBtn");
const resetButton = document.getElementById("ResetBtn");

aboutAthorButton.addEventListener('click', aboutAthor);
aboutProgramButton.addEventListener('click', aboutProgram);
undoButton.addEventListener('click', undo);
resetButton.addEventListener('click', reset)

const canvasBackgroundColor = document.getElementById("ColorBg");
canvasBackgroundColor.addEventListener("change", updateColorBG);

const canvasWidth = 640;
const canvasHeight = 448;

var stage = new Konva.Stage({
    container: "Canvas",
    width: canvasWidth,
    height: canvasHeight
});

export var layer = new Konva.Layer();
stage.add(layer);

const defaultCanvasProperties = new CanvasProperties(canvasBackgroundColor.value);
export const handler = new Handler(stage, defaultCanvasProperties, layer);


export let counter = {
    value: 0,
}

export let figCounter = {
    value: 0,
}

stage.on('click', onMouseDown)
function onMouseDown(event){
    if (event.target == stage) {
        let choseObj = new ChoseObj()
        let coords = {
            x: Math.round(stage.getRelativePointerPosition().x),
            y: Math.round(stage.getRelativePointerPosition().y),
        };
        let dot = choseObj.createObject("dot", {idNum: counter.value, curCoords: coords})
        handler.DrawDot(dot)
        counter.value++
        if (counter.value > 1) {
            let edge = choseObj.createObject("edge", {idNum: counter.value - 1})
            layer.add(edge)
        }

        let prevCoords = undefined;
        dot.on("dragstart", function() {
            document.body.style.cursor = 'pointer'
            prevCoords = {
                x: Math.round(stage.getRelativePointerPosition().x),
                y: Math.round(stage.getRelativePointerPosition().y),
            };
            handler.MoveFig(dot, prevCoords)
        });
        dot.on("dragend", function() {
            document.body.style.cursor = 'default'
        });
        dot.on("dragmove", function() {
            updateEdge(this)
        })
    }
}

export function updateEdge(dot){
    let choseObj = new ChoseObj()
    let cur = Number(dot.attrs.id.split("dot-")[1]) 
    if (cur < counter.value) {
        let edge;
        if (cur < counter.value - 1) {
            if (layer.findOne("#edge-" + cur)) {
                layer.findOne("#edge-" + cur).destroy()
                edge = choseObj.createObject("edge", {idNum: cur + 1})
                layer.add(edge)
            }
        }
        if (layer.findOne("#edge-" + (cur - 1))) {
            layer.findOne("#edge-" + (cur - 1)).destroy()
            edge = choseObj.createObject("edge", {idNum: cur})
            layer.add(edge)
        }
    }
}

function updateColorBG(){
	handler.updateBGcolor(canvasBackgroundColor.value);
}

function undo(){
    handler.undo()
}

function reset(){
    handler.reset()
}


FigColor.addEventListener('change', changeFigColor);

function changeFigColor(){
    handler.changeFigColor(this)
}

const CloseFigButton = document.getElementById("CloseFigBtn");
CloseFigButton.addEventListener('click', CloseFig);
export const MeasureTime = document.getElementById("timeMeasure")

function CloseFig(){
    let dots = []
    let edges = []
    if (counter.value > 2) {
        for (let i = 0; i < counter.value - 1; i++) {
            dots.push(layer.findOne('#dot-' + i))
            edges.push(layer.findOne('#edge-' + i))
        }
        dots.push(layer.findOne('#dot-' + (counter.value - 1)))
        handler.closeFig(dots, edges)
    } else {
        alert("Нельзя построить фигуру меньше чем на 3 точках")
    }
}

export function isDelayed() {
    return document.getElementById("delaySwitch").checked
}

const fillButton = document.getElementById("FillFigBtn");
fillButton.addEventListener('click', FillFig);

function FillFig(){
    let polygons = []
    for (let i = 0; i < figCounter.value; i++) {
        if (layer.find("#dot-figure-" + i).length) {
            polygons.push(layer.find("#dot-figure-" + i));
        }
    }
    handler.fillFig(polygons, FigColor)
}


const addDotBtn = document.getElementById("AddDotBtn");
const DotX = document.getElementById("dotXInput");
const DotY = document.getElementById("dotYInput");

addDotBtn.addEventListener('click', AddDot)
function AddDot() {
    let [x, y] = [DotX.value, DotY.value]
    if (!isFinite(x) || !isFinite(y)) {
        alert("Введены не корректные точки")
        return
    }
    let Coords = {
        x: Number(x),
        y: Number(y),
    }
    let choseObj = new ChoseObj()
    let dot = choseObj.createObject("dot", {idNum: counter.value, curCoords: Coords})
    handler.DrawDot(dot)
    counter.value++
    if (counter.value > 1) {
        let edge = choseObj.createObject("edge", {idNum: counter.value - 1})
        layer.add(edge)
    }
}