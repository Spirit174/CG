import { drawCircleLib, drawCircleCanon, drawCircleParam } from "./solutions.js"
import { drawSPixels } from "./pixel.js"

class DrawCircleCmd{
    constructor(circle, alg){
        this.circle = circle
        this.alg = alg
    }

    execute(Handler){
        if (!(this.alg in Handler.circleAlg)){
            throw new Error("Че за алгос");
        }
        console.log(this.alg)
        let pixels = Handler.circleAlg[this.alg](this.circle, Handler.context)
        if (pixels){
            drawSPixels(Handler.context, pixels, this.circle.center, true)
        }
    }
}


export class CanvasProperties {
	constructor(defaultWidth, defaultHeight) {
		this.width = defaultWidth
		this.height = defaultHeight
	}
}

export class Handler{
    constructor(canvas, properties){
        this.canvas = canvas 
        this.context = canvas.getContext("2d")
        this.circleAlg = {
            "Lib": drawCircleLib,
            "Canon": drawCircleCanon,
            "Param": drawCircleParam
        }
        this.commands = [];
        this.defaultProperties = properties
		this.properties = JSON.parse(JSON.stringify(properties))
    }

    drawCircle(circle, alg){
        console.log("In Handler check")
        const command = new DrawCircleCmd(circle, alg);
        this.commands.push(command)
        command.execute(this)
    }

    
	CmdLog() {
		console.log(this.commands)
	}


}