import { FigColor } from "./figcolor.js";

export let defaultDotConfig = {
    radius: 7,
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

export function getID(dot) {
    let result = dot.id
    return Number(result)
}