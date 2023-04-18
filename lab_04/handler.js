
class DrawCircleCmd{
    constructor(circle, alg){
        this.circle = circle
        this.alg = alg
    }

    execute(Handler){
        if (!(this.alg in Handler.circleAlg)){
            throw new Error("Че за алгос");
        }
        // draw
    }
}


export class Handler{
    constructor(canvas, properties){
        this.canvas = canvas 
        this.context = canvas.getContext("2d")
        this.circleAlg = {
            "Lib": drawCircleLib
        }
        this.commands = [];
    }
    drawCircle(circle, alg){
        const command = new DrawCircleCmd(circle, alg);
        this.commands.push(command)
        command.execute(this)
    }

}