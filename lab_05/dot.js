import { FigColor } from "./figcolor.js";

let defaultDotConfig = {
    radius: 5,
    fill: FigColor.value,
    draggable: true,
};

export var Dot = function(args) {
    let dot = new Konva.Circle(Object.assign({
        id: 'dot-' + args.idNum,
        x: args.curCoords.x,
        y: args.curCoords.y,
    }, defaultDotConfig));
    return dot;
};