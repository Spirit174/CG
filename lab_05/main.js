import { Handler, CanvasProperties, ChoseObj } from "./handler.js";
import { aboutProgram, aboutAthor } from './info.js';

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

const canvasWidth = 640
const canvasHeight = 448

var stage = new Konva.Stage({
    container: "Canvas",
    width: canvasWidth,
    height: canvasHeight
});

export var layer = new Konva.Layer()
stage.add(layer)

const defaultCanvasProperties = new CanvasProperties(canvasBackgroundColor.value)
export const handler = new Handler(stage, defaultCanvasProperties, layer)


export let counter = {
    value: 0,
}

export let figCounter = {
    value: 0,
}

stage.on('click', onMouseDown)
function onMouseDown(event){
    if (event.target == stage) {
        let choseObj = new ChoseObj();
        let coords = {
            x: Math.round(stage.getRelativePointerPosition().x),
            y: Math.round(stage.getRelativePointerPosition().y),
        };
        let dot = choseObj.createObject("dot", {idNum: counter.value, curCoords: coords});
        handler.DrawDot(dot);
        counter.value++;
        if (counter.value > 1) {
            let edge = choseObj.createObject("edge", {idNum: counter.value - 1});
            layer.add(edge);
        }

        let prevCoords = undefined;
        dot.on("dragstart", function() {
            document.body.style.cursor = 'pointer';
            prevCoords = {
                x: Math.round(stage.getRelativePointerPosition().x),
                y: Math.round(stage.getRelativePointerPosition().y),
            };
            handler.MoveFig(dot, prevCoords);
        });
        dot.on("dragend", function() {
            document.body.style.cursor = 'default';
        });
        dot.on("dragmove", function() {
            updateEdge(this);
        })
    }
}

export function updateEdge(dot){
    let choseObj = new ChoseObj();
    let cur = Number(dot.attrs.id.split("dot-")[1]); 
    if (cur < counter.value) {
        let edge;
        if (cur < counter.value - 1) {
            if (layer.findOne("#edge-" + cur)) {
                layer.findOne("#edge-" + cur).destroy();
                edge = choseObj.createObject("edge", {idNum: cur + 1});
                layer.add(edge);
            }
        }
        if (layer.findOne("#edge-" + (cur - 1))) {
            layer.findOne("#edge-" + (cur - 1)).destroy();
            edge = choseObj.createObject("edge", {idNum: cur});
            layer.add(edge);
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