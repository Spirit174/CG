import { FigColor } from "./figcolor.js";
import { layer } from "./main.js";



export let defaultEdgeConfig = {
    stroke: FigColor.value,
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
};

export var Edge = function(args) {
    var from = layer.findOne('#dot-' + (args.idNum - 1));
    var to = layer.findOne('#dot-' + args.idNum);
    let edge = new Konva.Line(Object.assign({
        id: 'edge-' + (args.idNum - 1),
        points: [from.attrs.x, from.attrs.y, to.attrs.x, to.attrs.y],
    }, defaultEdgeConfig));
    return edge;
};

export var Outline = function(args) {
    let outline = new Konva.Line(Object.assign({
        id: 'edge',
        points: args.dots,
    }, defaultEdgeConfig));
    return outline;
};