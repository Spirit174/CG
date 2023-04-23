import { drawCircleLib, drawCircleCanon, drawCircleParam, drawBresenhamCircle, drawMidpointCircle } from "./solutions.js"
import { drawSPixels } from "./pixel.js"

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
        let pixels = Handler.circleAlg[this.alg](this.circle, Handler.context)
		console.log(pixels)
        if (pixels){
            drawSPixels(Handler.context, pixels, this.circle.center, true)
        }
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

}


export class CanvasProperties {
	constructor(defaultWidth, defaultHeight, backgroundColor) {
		this.width = defaultWidth
		this.height = defaultHeight
        this.backgroundColor = backgroundColor
		this.canvasStartX = 0
        this.canvasStartY = 0
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
        const command = new DrawCircleCmd(circle, alg);
        this.commands.push(command)
        command.execute(this)
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

}