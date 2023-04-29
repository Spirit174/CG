import { drawCircleLib, drawCircleCanon, drawCircleParam, drawBresenhamCircle, drawMidpointCircle, drawEllipseLib, drawEllipseCanon, drawEllipseParam, drawBresenhamEllipse, drawMidpointEllipse } from "./solutions.js"
import { drawSPixels } from "./pixel.js"
import { Point } from "./point.js"
import { Ellipse } from "./ellipse.js"
import { Circle } from "./circle.js"



class DrawCircleCmd{
    constructor(circle, alg){
        this.circle = circle
        this.alg = alg
    }

    type() {
		return "drawing"
	}

    execute(Handler){
        if (!(this.alg in Handler.circleAlg)){
            throw new Error("Че за алгос");
        }
        // console.log(this.alg)
		console.log(this.circle)
        let pixels = Handler.circleAlg[this.alg](this.circle, Handler.context)
		console.log(pixels)
        if (pixels){
            drawSPixels(Handler.context, pixels, this.circle.center, true)
        }
    }

	undo() {
		throw new Error("Произошла отмена__redraw")
	}
}

class DrawEllipseCmd{
	constructor(ellipse, alg) {
		this.ellipse = ellipse
		this.alg = alg
	}
	type() {
		return "drawing"
	}
	execute(Handler) {
		if (!(this.alg in Handler.ellipseAlg)) {
			throw new Error("Че за алгос")
		}
		let pixels = Handler.ellipseAlg[this.alg](this.ellipse, Handler.context)
		if (pixels) {
			drawSPixels(Handler.context, pixels, this.ellipse.center, false)
		}
	}
	undo() {
		throw new Error("Произошла отмена__redraw")
	}
}

class DrawCircleSpecCmd {
	constructor (circleSpectrum, alg) {
		this.circleSpectrum = circleSpectrum
		this.alg = alg
	}

	type() {
		return "drawing"
	}

	execute(Handler) {
		if (!(this.alg in Handler.circleAlg)) {
			throw new Error("Че за алгос")
		}
		console.log("in cmd")
		console.log(this.circleSpectrum)
		for (let radius = this.circleSpectrum.startRadius; radius <= this.circleSpectrum.endRadius; radius += this.circleSpectrum.step) {
			let pixels = Handler.circleAlg[this.alg](new Circle(this.circleSpectrum.center, radius, this.circleSpectrum.color), Handler.context)
			console.log(pixels)
			if (pixels) {
				drawSPixels(Handler.context, pixels, this.circleSpectrum.center, true)
			}
		}
	}
	undo() {
		throw new Error("Произошла отмена__redraw")
	}
}

class DrawEllipseSpecCmd {
	constructor (ellipseSpectrum, alg) {
		this.ellipseSpectrum = ellipseSpectrum
		this.alg = alg
	}

	type() {
		return "drawing"
	}

	execute(Handler) {
		if (!(this.alg in Handler.ellipseAlg)) {
			throw new Error("Че за алгос")
		}
		console.log(this.ellipseSpectrum.startRx)
		console.log(this.ellipseSpectrum.startRy)
		console.log(this.ellipseSpectrum.count)
		console.log(this.ellipseSpectrum.stepRx)
		console.log(this.ellipseSpectrum.stepRy)
		for (let i = 0, Rx = this.ellipseSpectrum.startRx, Ry = this.ellipseSpectrum.startRy; i < this.ellipseSpectrum.count;
			 i++, Rx += this.ellipseSpectrum.stepRx, Ry += this.ellipseSpectrum.stepRy) {
			let pixels = Handler.ellipseAlg[this.alg](new Ellipse(this.ellipseSpectrum.center, Rx, Ry, 0, this.ellipseSpectrum.color), Handler.context)
			console.log(pixels)
			if (pixels) {
				drawSPixels(Handler.context, pixels, this.ellipseSpectrum.center, false)
			}
		}
	}
	undo() {
		throw new Error("Произошла отмена__redraw")
	}

}

class ChangeBGColorCmd {
	constructor(color) {
		this.color = color
	}

	type() {
		return "changeBG"
	}

	execute(Handler) {
		Handler.context.fillStyle = this.color
		Handler.context.fillRect(Handler.properties.canvasStartX, Handler.properties.canvasStartY,
									   Handler.canvas.width, Handler.canvas.height)
	}
	undo() {
		throw new Error("Произошла отмена__redraw")
	}
}


export class CanvasProperties {
	constructor(defaultWidth, defaultHeight, backgroundColor, padding, aspectRatio) {
		this.width = defaultWidth
		this.height = defaultHeight
        this.backgroundColor = backgroundColor
		this.canvasStartX = 0
        this.canvasStartY = 0
		this.padding = padding
		this.aspectRatio = aspectRatio
	}
}

export class Handler{
    constructor(canvas, properties){
        this.canvas = canvas 
        this.context = canvas.getContext("2d")
        this.circleAlg = {
            "Lib": drawCircleLib,
            "Canon": drawCircleCanon,
            "Param": drawCircleParam,
            "Bresenham": drawBresenhamCircle,
			"Midpoint": drawMidpointCircle
        }
		this.ellipseAlg = {
			"Lib": drawEllipseLib,
            "Canon": drawEllipseCanon,
            "Param": drawEllipseParam,
            "Bresenham": drawBresenhamEllipse,
			"Midpoint": drawMidpointEllipse
		}
        this.commands = [];
        this.defaultProperties = properties
		this.properties = JSON.parse(JSON.stringify(properties))
		let BG = new ChangeBGColorCmd(properties.backgroundColor)
		BG.execute(this)
    }

    clear_screen() {
		this.context.clearRect(this.properties.canvasStartX, this.properties.canvasStartY, this.canvas.width, this.canvas.height)
		this.context.fillStyle = this.defaultProperties.backgroundColor
		this.properties.backgroundColor = this.defaultProperties.backgroundColor
		this.context.fillRect(this.properties.canvasStartX, this.properties.canvasStartY, this.canvas.width, this.canvas.height)
	}

    drawCircle(circle, alg){
        // console.log("In Handler check")
		let temp_redraw = this.fitToCircle(circle)
        const command = new DrawCircleCmd(circle, alg);
        this.commands.push(command)
		if (temp_redraw) {
			this.redraw()
		} else {
			command.execute(this)
		}
    }

	drawEllipse(ellipse, alg){
		let temp_redraw = this.fitToEllipse(ellipse)
		const command = new DrawEllipseCmd(ellipse, alg)
		this.commands.push(command)
		console.log("1")
		if (temp_redraw) {
			this.redraw()
		} else {
			command.execute(this)
		}
	}

    
	CmdLog() {
		console.log(this.commands)
	}

    updateColorBG(HexColor) {
		this.properties.bgColor = HexColor
		const command = new ChangeBGColorCmd(HexColor)
		this.commands.push(command)
		this.redraw()
	}

    redraw() {
		this.clear_screen()
		this.drawAxis()
		let BG = undefined
		let drawing = []
		this.commands.forEach(command => {
			const type = command.type()
			if (type == "changeBG") {
				BG = command
			} else if (type == "drawing") {
				drawing.push(command)
			}
		})

		if (BG) {
			BG.execute(this)
		}
		
		drawing.forEach(command => {
			console.log(command)
			command.execute(this)
		})
	}

	reset_all() {
		this.commands = []
		this.clear_screen()
		this.context.translate(this.properties.canvasStartX, this.properties.canvasStartY)
		this.canvas.width = this.defaultProperties.width
		this.canvas.height = this.defaultProperties.height
		this.properties = JSON.parse(JSON.stringify(this.defaultProperties))
		this.redraw()
	}

	fitToEllipse(ellipse) {
		let temp_redraw = false
		temp_redraw += this.fitToPoint(new Point(ellipse.center.x + ellipse.Rx, ellipse.center.y))
		temp_redraw += this.fitToPoint(new Point(ellipse.center.x - ellipse.Rx, ellipse.center.y))
		temp_redraw += this.fitToPoint(new Point(ellipse.center.x, ellipse.center.y + ellipse.Ry))
		temp_redraw += this.fitToPoint(new Point(ellipse.center.x, ellipse.center.y - ellipse.Ry))
		return Boolean(temp_redraw)
	}
	fitToCircle(circle) {
		let temp_redraw = false
		temp_redraw += this.fitToPoint(new Point(circle.center.x + circle.radius, circle.center.y))
		temp_redraw += this.fitToPoint(new Point(circle.center.x - circle.radius, circle.center.y))
		temp_redraw += this.fitToPoint(new Point(circle.center.x, circle.center.y + circle.radius))
		temp_redraw += this.fitToPoint(new Point(circle.center.x, circle.center.y - circle.radius))
		return Boolean(temp_redraw)
	}
	fitToPoint(point) {
		let bottomRightIsChanged = false
		if (point.x > this.canvas.width + this.properties.canvasStartX) {
			bottomRightIsChanged = true
			this.canvas.width = point.x + this.properties.padding
			this.canvas.height = Math.round(this.canvas.width / this.properties.aspectRatio)
		}
		if (point.y > this.canvas.height + this.properties.canvasStartY) {
			bottomRightIsChanged = true
			this.canvas.height = point.y + this.properties.padding
			this.canvas.width = Math.round(this.canvas.height * this.properties.aspectRatio)
		}

		let upperLeftIsChanged = false
		if (point.x < this.properties.canvasStartX) {
			upperLeftIsChanged = true
			this.properties.canvasStartX = point.x - this.properties.padding
			this.properties.canvasStartY = Math.round(this.properties.canvasStartX / this.properties.aspectRatio)
		}
		if (point.y < this.properties.canvasStartY) {
			upperLeftIsChanged = true
			this.properties.canvasStartY = point.y - this.properties.padding
			this.properties.canvasStartX = Math.round(this.properties.canvasStartY * this.properties.aspectRatio)
		}

		if (bottomRightIsChanged || upperLeftIsChanged) {
			this.canvas.width += Math.abs(this.properties.canvasStartX)
			this.canvas.height += Math.abs(this.properties.canvasStartY)
			this.context.translate(Math.abs(this.properties.canvasStartX), Math.abs(this.properties.canvasStartY))
		}
		return bottomRightIsChanged || upperLeftIsChanged
	}


	drawCircleSpectrum(circleSpectrum, alg) {
		this.fitToCircle(new Circle(circleSpectrum.center, circleSpectrum.endRadius))
		this.redraw()
		console.log("handler ")
		console.log(circleSpectrum)
		const command = new DrawCircleSpecCmd(circleSpectrum, alg)
		this.commands.push(command)
		command.execute(this)
	}

	drawEllipseSpectrum(ellipseSpectrum, alg) {
		this.fitToEllipse(new Ellipse(ellipseSpectrum.center,
			ellipseSpectrum.startRx + ellipseSpectrum.stepRx * (ellipseSpectrum.count - 1),
			ellipseSpectrum.startRy + ellipseSpectrum.stepRy * (ellipseSpectrum.count - 1)))
		this.redraw()
		console.log("handler ")
		console.log(ellipseSpectrum)
		const command = new DrawEllipseSpecCmd(ellipseSpectrum, alg)
		this.commands.push(command)
		command.execute(this)
	}

	undo() {
		if (this.commands.length == 0) {
			alert("Нет действий для отмены.");
			console.warn("хех мда");
			return;
		}
		const command = this.commands.pop()

		try {
			command.undo()
		} catch (error) {
			if (error.message.includes("__redraw")) {
				this.redraw()
			}
		}
	}

	drawAxis() {
		this.context.strokeStyle = "#000000"

		this.context.beginPath()
		this.context.moveTo(0, this.properties.canvasStartY)
		this.context.lineTo(0, this.canvas.height)
		this.context.stroke()

		this.context.beginPath()
		this.context.moveTo(this.properties.canvasStartX, 0)
		this.context.lineTo(this.canvas.width, 0)
		this.context.stroke()
	}
}