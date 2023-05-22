import { seedFilling, border, createPixel, setPixels } from "./filler.js"
import { hideShapes, showShapes, Point } from "./dot.js"
import { addPoints, getConnectPoints, initLine, getConnectCutterPoints } from "./line.js"
import { BresenhamInt, Line } from "./bresenham.js"
import { check_polygons, cut } from "./cutter.js"


export const openFlag = 'opened'
export const closeFlag = 'closed'

export class DrawCircleCommand {
	constructor(layer, circle) {
		this.layer = layer
		this.circle = circle
		// this.name = "DrawCircleCommand"
	}

	execute(canvasHandler) {
		this.layer.add(this.circle)
		if (!canvasHandler.dotscutter[canvasHandler.dotscutter.length - 1][1]) {
			canvasHandler.dotscutter[canvasHandler.dotscutter.length - 1][1] = []
		}
		canvasHandler.dotscutter[canvasHandler.dotscutter.length - 1][1].push(this.circle)
	}

	undo(canvasHandler) {
		this.circle.destroy()
		canvasHandler.dotscutter[canvasHandler.dotscutter.length - 1][1].pop()
	}

}



export class DrawCircleFigCommand {
	constructor(layer, circle) {
		this.layer = layer
		this.circle = circle
		// this.name = "DrawCircleFigCommand"
	}

	execute(canvasHandler) {
		this.layer.add(this.circle)
		if (!canvasHandler.dots[canvasHandler.dots.length - 1][1]) {
			canvasHandler.dots[canvasHandler.dots.length - 1][1] = []
		}
		canvasHandler.dots[canvasHandler.dots.length - 1][1].push(this.circle)
	}

	undo(canvasHandler) {
		this.circle.destroy()
		canvasHandler.dots[canvasHandler.dots.length - 1][1].pop()
	}
}

class CloseFigureCommand {
	constructor(id) {
		this.id = id
		// this.name = "CloseFigureCommand"
	}

	execute(canvasHandler) {
		var line = canvasHandler.mainLayer.findOne('#line-border-' + this.id)
		const firstDot = canvasHandler.dots[this.id][1][0]
		addPoints(line, [firstDot.x(), firstDot.y()])
		line.addName('connected')
	}

	undo(canvasHandler) {
		var line = canvasHandler.mainLayer.findOne('#line-border-' + this.id)
		line.points(line.points().slice(0, -2))
		line.name(line.name().replace(' connected', ''))
		canvasHandler.dots[this.id][0] = openFlag
		canvasHandler.dots.pop()
	}
}

class CloseFigureCutCommand {
	constructor(id) {
		this.id = id
		// this.name = "CloseFigureCutCommand"
	}

	execute(canvasHandler) {
		var line = canvasHandler.mainLayer.findOne('#line-cutter-border-' + this.id)
		const firstDot = canvasHandler.dotscutter[this.id][1][0]
		console.log(firstDot)
		addPoints(line, [firstDot.x(), firstDot.y()])
		line.addName('connected')
	}

	undo(canvasHandler) {
		var line = canvasHandler.mainLayer.findOne('#line-cutter-border-' + this.id)
		line.points(line.points().slice(0, -2))
		line.name(line.name().replace(' connected', ''))
		canvasHandler.dotscutter[this.id][0] = openFlag
		canvasHandler.dotscutter.pop()
	}
}

export class OnDragShapeCommand {
	constructor(shape, prevCoords=undefined) {
		// this.name = "OnDragShapeCommand"
		this.shape = shape
		if (!prevCoords) {
			this.prevCoords = {x: shape.x(), y: shape.y()}
		} else {
			this.prevCoords = prevCoords
		}
	}
	
	execute(canvasHandler) {
		canvasHandler.lineFillersGroup.find('Line').forEach(line => {
			line.destroy()
		})
	}

	undo() {
		this.shape.x(this.prevCoords.x)
		this.shape.y(this.prevCoords.y)
	}
}

class ChangeBGColor {
	constructor(color) {
		this.color = color
		// this.name = "ChangeBGColor"
	}

	execute(canvasHandler) {
		this.prevColor = canvasHandler.properties.bgColor
		canvasHandler.properties.bgColor = this.color
		canvasHandler.stage.container().style.backgroundColor = this.color
	}

	undo(canvasHandler) {
		canvasHandler.properties.bgColor = this.prevColor
		canvasHandler.stage.container().style.backgroundColor = this.prevColor
	}
}

class ChangeBorderColor {
	constructor(color) {
		this.color = color
		// this.name = "ChangeBorderColor"
	}

	execute(canvasHandler) {
		this.prevColor = canvasHandler.properties.borderColor
		canvasHandler.properties.borderColor = this.color
		canvasHandler.mainLayer.find('.line-border').forEach(line => {
			line.stroke(this.color)
		})
	}

	undo(canvasHandler) {
		canvasHandler.mainLayer.find('.line-border').forEach(line => {
			line.stroke(this.prevColor)
		})
		canvasHandler.properties.borderColor = this.prevColor
	}
}


class ChangeCutterBordColor {
	constructor(color) {
		this.color = color
		// this.name = "ChangeCutterBordColor"
	}
	
	execute(canvasHandler) {
		this.prevColor = canvasHandler.properties.CutterBordColor
		canvasHandler.properties.CutterBordColor = this.color
		canvasHandler.mainLayer.find('.line-cutter-border-').forEach(line => {
			line.stroke(this.color)
		})
	}

	undo(canvasHandler) {
		canvasHandler.mainLayer.find('.line-cutter-border-').forEach(line => {
			line.stroke(this.prevColor)
		})
		canvasHandler.properties.CutterBordColor = this.prevColor
	}
}


// class CutCommand {
// 	constructor(cuttingColor, layer) {
// 		this.cuttingColor = cuttingColor
// 		this.layer = layer
// 		// this.name = "CutCommand"
// 	}

// 	execute(canvasHandler) {
// 		this.lines = []
// 		let cutters = canvasHandler.dots.filter(arr => arr[0] == closeFlag).map(arr => arr[1])
// 		if (cutters.length == 0) {
// 			return Error
// 		}

// 		let lines = canvasHandler.lines.filter(arr => arr[1].length == 2).map(arr => arr[1])
// 		if (lines.length == 0) {
// 			return Error
// 		}
// 		cutters.forEach(cutter => {
// 			lines.forEach(line => {
// 				let dots = cyrus_beck_alg(cutter, line)
// 				console.log(cutter)
// 				if (dots && dots[0]) {
// 					let points = dots[0].concat(dots[1])
// 					let cuttedLine = initLine(points, this.cuttingColor)
// 					cuttedLine.id("cutted")
// 					console.log(cuttedLine)
// 					this.lines.push(cuttedLine)
// 					this.layer.add(cuttedLine)
// 				}
// 			})
// 		})

// 	}

// 	undo(canvasHandler) {
// 		this.lines.forEach(line => {
// 			line.destroy()
// 		})
// 	}
// }


class CutCommand{
	constructor(cuttingColor, layer) {
		this.cuttingColor = cuttingColor
		this.layer = layer
		// this.name = "CutCommand"
	}
		execute(canvasHandler) {
		this.lines = []
		let fig = canvasHandler.dots.filter(arr => arr[0] == closeFlag).map(arr => arr[1])
		if (fig.length == 0) {
			return Error
		}

		let cutters = canvasHandler.dotscutter.filter(arr => arr[0] == closeFlag).map(arr => arr[1])
		if (cutters.length == 0) {
			return Error
		}

		if (!check_polygons(cutters)){
			console.log("not Выпуклый")
			return Error
		}

		if (!check_polygons(fig)){
			console.log("not Выпуклый")
			return Error
		}
		let res = cut(cutters, fig)
		for (let i = 0; i < res.length; i++){
			res[i][0] = Math.round(res[i][0])
			res[i][1] = Math.round(res[i][1])
		}
		for (let i = 0; i < res.length - 1; i++){
			let linedots = [res[i], res[i + 1]]
			console.log(linedots)
			let cuttedLine = initLine(linedots, this.cuttingColor)
			cuttedLine.id("cutted")
			this.lines.push(cuttedLine)
			this.layer.add(cuttedLine)
		}
		console.log(res.length)
		let linedots = [res[res.length - 1], res[0]]
		console.log(linedots)
		let cuttedLine = initLine(linedots, this.cuttingColor)
		console.log(cuttedLine)
		cuttedLine.id("cutted")
		this.lines.push(cuttedLine)
		this.layer.add(cuttedLine)


		// for (let i = 0; i < res.length; i++){
		// 	let linedots = res[i]
		// 	console.log(linedots)
		// 	let cuttedLine = initLine(linedots, this.cuttingColor)
		// 	cuttedLine.id("cutted")
		// 	this.lines.push(cuttedLine)
		// 	this.layer.add(cuttedLine)
		// }



		// console.log(fig, cutters)
		// cutters.forEach(cutter => {
		// 	lines.forEach(line => {
		// 		let dots = cyrus_beck_alg(cutter, line)
		// 		console.log(cutter)
		// 		if (dots && dots[0]) {
		// 			let points = dots[0].concat(dots[1])
		// 			let cuttedLine = initLine(points, this.cuttingColor)
		// 			cuttedLine.id("cutted")
		// 			console.log(cuttedLine)
		// 			this.lines.push(cuttedLine)
		// 			this.layer.add(cuttedLine)
		// 		}
		// 	})
		// })

	}

	undo(canvasHandler) {
		this.lines.forEach(line => {
			line.destroy()
		})
	}
}






export class CanvasProperties {
	constructor(bgColor, borderColor, CutterBordColor) {
		this.bgColor = bgColor
		this.borderColor = borderColor
		this.CutterBordColor = CutterBordColor
	}
}

export class CanvasHandler {
	constructor(stage, properties) {
		this.stage = stage
		this.mainLayer = new Konva.Layer()
		stage.add(this.mainLayer)

		this.lineFillersGroup = new Konva.Group()
		this.lineBordersGroup = new Konva.Group()
		this.lineBordersCutterGroup = new Konva.Group()
		this.dotsGroup = new Konva.Group()
		this.mainLayer.add(this.lineBordersGroup, this.dotsGroup, this.lineBordersCutterGroup, this.lineFillersGroup)

		this.defaultProperties = properties
		this.properties = JSON.parse(JSON.stringify(properties))

		this.dots = [[openFlag, []]]
		this.dotscutter = [[openFlag, []]]
		this.lines = [[openFlag, []]]
		this.maxPolygonsCount = 100

		this.commands = []
		let initBG = new ChangeBGColor(properties.bgColor)
		initBG.execute(this)
	}

	addDot(dot, borderColor) {
		// var actionmanager = true
		// var actionmanager2 = false
		// if (this.dotscutter[0][0] == "closed"){
		// 	var actionmanager = confirm("Уже задан отсекатель\n" +
		// 								"Вы хотите задать новый?")
		// 	actionmanager2 = true
		// }
		// if (actionmanager){
		// 	if(actionmanager2){
		// 		console.log(this.commands.length)
		// 		let idt = 1
		// 		for (let i = this.commands.length - 1; i > 0; i--) {
		// 			console.log(this.commands[i].name)
		// 			if (this.commands[i].name == "DrawCircleCommand" || this.commands[i].name == "CloseFigureCutCommand"){
		// 				if(this.commands[i].name == "DrawCircleCommand"){
		// 					console.log(this.dotscutter[0][idt])
		// 					this.dotscutter.pop(this.dotscutter[0][idt])
		// 					idt++
		// 				}
		// 				this.undo(this.commands[i])
		// 			}
		// 		}
		// 		this.dotscutter = [[openFlag, []]]
		// 	}
			const command = new DrawCircleCommand(this.lineBordersCutterGroup, dot)
			this.commands.push(command)
			command.execute(this)
			let id = this.dotscutter.length - 1
			dot.name('circle-cutter-' + id)
			this.updateConnectionCutter(id, borderColor)
		// }
	}

	addDotfig(dot, borderColor) {
		// var actionmanager = true
		// var actionmanager2 = false
		// if (this.dots[0][0] == closeFlag){
		// 	var actionmanager = confirm("Фигура уже задана\n" +
		// 								"Вы хотите задать новую?");
		// 	actionmanager2 = true
		// }
		// if (actionmanager){
		// 	if(actionmanager2){
		// 		console.log(this.commands.length)
		// 		let idt = 1
		// 		for (let i = this.commands.length - 1; i > 0; i--) {
		// 			console.log(this.commands[i].name)
		// 			if (this.commands[i].name == "DrawCircleFigCommand" || this.commands[i].name == "CloseFigureCommand"){
		// 				if(this.commands[i].name == "DrawCircleFigCommand"){
		// 					console.log(this.dots[0][idt])
		// 					this.dots.pop(this.dots[0][idt])
		// 					idt++
		// 				}
		// 				this.undo(this.commands[i])
		// 				i--
		// 			}
		// 		}
		// 		this.dots = [[openFlag, []]]
		// 	}
			const command = new DrawCircleFigCommand(this.dotsGroup, dot)
			this.commands.push(command)
			command.execute(this)
			let id = this.dots.length - 1
			dot.name('circle-' + id)
			this.updateConnection(id, borderColor)
		// }
	}

	closeFigure(id) {
		if (this.dots[id][1].length < 3) {
			alert("Недостаточно точек для фигуры.")
			console.warn('Not enough dots to close figure.')
			return
		}
		const command = new CloseFigureCommand(id)
		this.commands.push(command)
		command.execute(this)
		this.dots[id][0] = closeFlag
		this.dots.push([openFlag, []])
	}

	closeFigureCut(id) {
		if (this.dotscutter[id][1].length < 3) {
			alert("Недостаточно точек для фигуры.")
			console.warn('Not enough dots to close figure.')
			return
		}
		const command = new CloseFigureCutCommand(id)
		this.commands.push(command)
		command.execute(this)
		this.dotscutter[id][0] = closeFlag
		this.dotscutter.push([openFlag, []])
	}

	onStartDragging(shape, prevCoords) {
		const command = new OnDragShapeCommand(shape, prevCoords)
		this.commands.push(command)
		command.execute(this)
	}

	updateConnection(id, borderColor) {
		let points = getConnectPoints(this.mainLayer, id)
		let line = this.mainLayer.findOne('#line-border-' + id)
		if (line) {
			line.points(points)
		} else {
			line = initLine(points, borderColor)
			this.lineBordersGroup.add(line)
			line.name('line-border')
			line.id('line-border-' + id)
		}
		
		if (line.name().includes('connected')) {
			const command = new CloseFigureCommand(id)
			command.execute(this)
		}
	}

	updateConnectionCutter(id, borderColor) {
		let points = getConnectCutterPoints(this.mainLayer, id)
		let line = this.mainLayer.findOne('#line-cutter-border-' + id)
		if (line) {
			line.points(points)
		} else {
			line = initLine(points, borderColor)
			this.lineBordersCutterGroup.add(line)
			line.name('line-cutter-border')
			line.id('line-cutter-border-' + id)
		}

		if (line.name().includes('connected')) {
			const command = new CloseFigureCutCommand(id)
			command.execute(this)
		}
	}

	updateBG(bgColor) {
		const command = new ChangeBGColor(bgColor)
		this.commands.push(command)
		command.execute(this)
	}

	updateBordersColor(borderColor) {
		const command = new ChangeBorderColor(borderColor)
		this.commands.push(command)
		command.execute(this)
	}

	updateCutterBordColor(CutterBordColor){
		const command = new ChangeCutterBordColor(CutterBordColor)
		this.commands.push(command)
		command.execute(this)
	}

	cut(color) {
		console.log(this.dotscutter, this.dots)
		if (this.dotscutter.length > 2 || this.dots.length > 2){
			alert("Не может больше одной фигуры или отсекателя, чтобы продолжить очистите холст")
			return
		}
		const command = new CutCommand(color, this.lineFillersGroup)
		this.commands.push(command)
		command.execute(this)
	}

	undo() {
		if (this.commands.length == 0) {
			alert("Нет действий для отмены.");
			console.warn("Nothing to undo.");
			return;
		}
		const command = this.commands.pop()
		command.undo(this)
		console.log(this.dots.length, this.dotscutter.length)
		for (let i = 0; i < this.dots.length; i++) {
			this.updateConnection(i)
		}
		for (let i = 0; i < this.dotscutter.length; i++) {
			this.updateConnectionCutter(i)
		}
		return command
	}

	

	clear() {
		this.properties.bgColor = this.defaultProperties.bgColor
		this.stage.container().style.backgroundColor = this.defaultProperties.bgColor
		this.mainLayer.destroy()
		this.mainLayer = new Konva.Layer()
    }


	setDefault() {
		this.clear()

		this.stage.add(this.mainLayer)
		this.lineFillersGroup = new Konva.Group()
		this.lineBordersGroup = new Konva.Group()
		this.lineBordersCutterGroup = new Konva.Group()
		this.dotsGroup = new Konva.Group()
		this.mainLayer.add(this.lineBordersGroup, this.dotsGroup, this.lineBordersCutterGroup, this.lineFillersGroup)

		this.commands = []
		this.dots = [[openFlag, []]]
		this.dotscutter = [[openFlag, []]]
		this.properties = JSON.parse(JSON.stringify(this.defaultProperties))
	}
}
