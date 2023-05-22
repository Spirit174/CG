const defaultDotConfig = {
    radius: 5,
    fill: 'green',
    draggable: true,
    opacity: 0.5
}

export class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export function initDot(coords) {
    let dot = new Konva.Circle(Object.assign({
        x: coords.x,
        y: coords.y
    }, defaultDotConfig))
    dot.on('mouseover', function() {
        document.body.style.cursor = 'pointer'
    })
    dot.on('mouseout', function () {
        document.body.style.cursor = 'default'
    })
    return dot
}

export function getID(circle) {
    let result = circle.name().replace(/[^0-9]/g,"")
    return Number(result)
}

export function getPoint(dot) {
    return new Point(dot.x(), dot.y())
}

export function hideShapes(shapes) {
    shapes.forEach(shape => {
        shape.hide()
    })
}

export function showShapes(shapes) {
    shapes.forEach(shape => {
        shape.show()
    })
}