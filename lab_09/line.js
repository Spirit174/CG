import { mSDelay, sleep } from "./filler.js"
import { Point } from "./dot.js"

const defaultLineConfig = {
    stroke: 'black',
    lineCap: 'round',
    lineJoin: 'round',
    listening: false
}

export function initLine(pointsArr, color='black') {
    console.log(pointsArr)
    let line = new Konva.Line(Object.assign(defaultLineConfig, {
        points: pointsArr,
        stroke: color
    }))
    return line
}

export function getDotCoords(dot) {
    return [dot.x(), dot.y()]
}

export function addPoints(line, points) {
    line.points([].concat(line.points(), points))
}

export function getConnectPoints(layer, id) {
    let points = []
    const dots = layer.find('.circle-' + id)

    dots.forEach(dot => {
        let coords = getDotCoords(dot)
        points.push(coords[0], coords[1])
    })
    return points
}

export function getConnectCutterPoints(layer, id) {
    let points = []
    const dots = layer.find('.circle-cutter-' + id)

    dots.forEach(dot => {
        let coords = getDotCoords(dot)
        points.push(coords[0], coords[1])
    })
    return points
}

// export async function drawShapes(layer, shapes, delay=false) {
//     for (let i = 0; i < shapes.length; i++) {
//         layer.add(shapes[i])
//         if (delay) {
//             await sleep(mSDelay)
//         }
//     }
// }