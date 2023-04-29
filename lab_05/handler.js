import { Dot, defaultDotConfig } from "./dot.js"
import { Edge, Outline, defaultEdgeConfig } from "./edges.js"
import { layer, figCounter, counter, updateEdge, handler, isDelayed, MeasureTime } from "./main.js";
import { fillPolygons, drawLines } from "./solution.js";
import { gridOptions, undoDotTable } from "./table.js";


class ChangeBGColorCmd {
	constructor(color) {
		this.color = color
	}

	execute(Handler) {
		Handler.stage.container().style.backgroundColor = this.color
	}
	undo(Handler) {
	    return -1
	}
}

export class DrawDotCmd {
    constructor (dot, layer) {
        this.dot = dot
        this.layer = layer
    };

    execute() {
        this.layer.add(this.dot);
        let rowData = [{
            "x": this.dot.x(),
            "y": this.dot.y(),
            "ID": figCounter.value,
        }]
        gridOptions.api.applyTransaction({add: rowData})

    };

    undo() {
        counter.value--
        updateEdge(this.dot)
        if (layer.findOne("#edge-" + (counter.value - 1))) {
            layer.findOne("#edge-" + (counter.value - 1)).destroy()
        };
        let rowData = [{
            "x": this.dot.x(),
            "y": this.dot.y(),
            "ID": figCounter.value,
        }]
        undoDotTable()

        this.dot.destroy()
    }
}

export class MovefigCmd{
    constructor(figure, prevCoords) {
        this.figure = figure
        this.prevCoords = prevCoords
    };

    execute () {
    };

    undo () {
        this.figure.x(this.prevCoords.x)
        this.figure.y(this.prevCoords.y)
        updateEdge(this.figure)
    };
}

export class DrawFigureCmd{
    constructor (dots, edges){
        this.dots = dots
        this.edges = edges
    };

    execute(){
        this.edges.forEach(edge => edge.destroy());
        this.dots.forEach(dot => {
            dot.attrs.id = 'dot-figure-' + figCounter.value
            dot.attrs.radius = 0
        });
        figCounter.value++
        let coords = getCoords(this.dots)
        let choseObj = new ChoseObj()
        let outline = choseObj.createObject("outline", {dots: coords})
        handler.clearTempCommands()
        layer.add(outline)
        counter.value = 0
        this.edges = outline
        // StatusFlag = closeFlag
    };

    undo (){
        this.dots.forEach(dot => dot.destroy());
        this.edges.destroy();

        figCounter.value--;
    };
}

export class FillFigComd{
    constructor (polygons, color) {
        this.layer = layer;
        this.polygons = polygons;
        this.color = color;
        this.ids = [];
    };

    execute () {
        let start = performance.now();
        let lines = fillPolygons(this.polygons);
        for (let i = 0; i < this.polygons.length; i++) {
            let id = this.polygons[i][0].attrs.id.split("-")[2];
            this.ids.push(id);
            for (let j = 0; j < this.polygons[i].length; j++) {
                this.polygons[i][j].attrs.id = "#dot-figure-" + id + "-filled";
            }
        }
        let end = performance.now();
        drawLines(this.layer, lines, this.color, this.ids[0], isDelayed());
        MeasureTime.innerHTML = "Время зарисовки: " + (end - start)
        // StatusFlag = fillFlag
    };

    undo () {
        let pixels = [];
        for (let i = 0; i < this.ids.length; i++) {
            pixels.push(this.layer.find("#line-" + this.ids[i]));
        }
        pixels.forEach(group => {
            group.forEach(pixel => pixel.destroy());
        })
        this.polygons.forEach(polygon => {
            polygon.forEach(dot => {
                dot.attrs.id = dot.attrs.id.slice(1, dot.attrs.id.length - 7);
            })
        })
    };
}


export class CanvasProperties {
	constructor(backgroundColor) {
		this.backgroundColor = backgroundColor
	}
}

export class Handler {
	constructor(stage, properties, mainLayer) {
		this.stage = stage
		this.mainLayer = mainLayer
		
		this.defaultProperties = properties
		this.properties = JSON.parse(JSON.stringify(properties))

		this.commands = []
		let initBG = new ChangeBGColorCmd(properties.backgroundColor)
		initBG.execute(this)

        this.dotid = 1
	};

    DrawDot(dot){
		const command = new DrawDotCmd(dot, this.mainLayer)
		this.commands.push(command)
		command.execute(this)
        console.log(this.dotid, dot.attrs.x, dot.attrs.y)
        // tableHandler.addData(this.dotid, dot.attrs.x, dot.attrs.y)
        this.dotid++
    };

    MoveFig(figure, prevCoords){
        const command = new MovefigCmd(figure, prevCoords)
        this.commands.push(command)
		command.execute(this)
    };

    closeFig(dots, edges){
        const command = new DrawFigureCmd(dots, edges)
		this.commands.push(command)
		command.execute(this)
    };

    fillFig(polygons, color){
        const command = new FillFigComd(polygons, color)
		this.commands.push(command)
		command.execute(this)
    }


    updateBGcolor(HexColor){
		this.properties.bgColor = HexColor
		const command = new ChangeBGColorCmd(HexColor)
		this.commands.push(command)
		command.execute(this)
	};

    undo(){
		if (this.commands.length != 0) {
            const command = this.commands.pop();
            let rc = command.undo(this);
            if (rc == -1) {
                this.updateCanvas();
            }
        } else {
            alert("Команд для отмены больше нет.");
        }
	};

    updateCanvas(){
        this.clearScreen();
        let flagBG = undefined;
        this.history.forEach(command => {
            if (command instanceof ChangeBGColorCmd) {
                flagBG = command;
            } else {
                command.execute(this);
            }
        })
        
        if (flagBG) { 
            flagBG.execute(this);
            this.color = flagBG.color;
        }
    };

    clearScreen() {
        this.stage.container().style.backgroundColor = "#ffffff";
    };

    reset(){
        this.commands.forEach(cmd => {
            cmd.undo();
        });
        this.commands = [];
        this.clearScreen();
    };

    clearTempCommands(){
        this.commands = this.commands.filter(value => !(value instanceof DrawDotCmd));
    };

    changeFigColor(figcolor){
        defaultEdgeConfig.stroke = figcolor.value;
        defaultDotConfig.fill = figcolor.value;
    }
}

export let ChoseObj = function() {
    this.createObject = function(type, args) {
        var object;

        if (type == 'dot') {
            object = new Dot(args);
        } else if (type == 'edge') {
            object = new Edge(args);
        } else if (type == 'outline') {
            object = new Outline(args);
        }

        object.type = type;

        return object;
    }
}

function getCoords(dots) {
    let coords = [];
    dots.forEach(dot => {
        coords.push(dot.attrs.x);
        coords.push(dot.attrs.y);
    });
    coords.push(dots[0].attrs.x);
    coords.push(dots[0].attrs.y);
    return coords;
}