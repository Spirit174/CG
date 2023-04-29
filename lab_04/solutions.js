import { Pixel } from "./pixel.js"

export function drawCircleLib(circle, context) {
	context.beginPath()
	context.strokeStyle = circle.color
	context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2*Math.PI)
	context.stroke()
}

export function drawCircleCanon(circle) {
	let px = []
	// console.log("Canon")
	let RadiusSqr = circle.radius ** 2
	let br = Math.round(circle.center.x + circle.radius / Math.sqrt(2))
	for (let x = circle.center.x; x < br + 1; x++){
		let y = circle.center.y + Math.sqrt(RadiusSqr - (x - circle.center.x) ** 2)
		px.push(new Pixel(x, y, circle.color))
	}
	return px
}

export function drawCircleParam(circle){
	let px = []
	// console.log("Param")
	let step = 1 / circle.radius
	for (let i = 0; i <= Math.PI / 4 + step; i += step){
		let x = circle.center.x + Math.round(circle.radius * Math.cos(i))
		let y = circle.center.y + Math.round(circle.radius * Math.sin(i))
		px.push(new Pixel(x, y, circle.color))
	}
	// console.log(px)
	return px
}

export function drawBresenhamCircle(circle) {
	let px = []
	let x = 0 
	let y = circle.radius
	// console.log("Bresenham")
	px.push(new Pixel(circle.center.x, y + circle.center.y, circle.color))	
	let diff = 2 * (1 - circle.radius)
	while (x < y){
		let dif = 2 * (diff + y) - 1
		x++

		if (dif >= 0){
			y--
			diff += 2 * (x - y + 1)
		}
		else {
			diff += x + x + 1
		}
		px.push(new Pixel(x + circle.center.x, y + circle.center.y, circle.color))
	}
	return px
}

export function drawMidpointCircle(circle){
	let px = []
	let x = circle.radius
	let y = 0
	// console.log("mid point")
	px.push(new Pixel(x + circle.center.x, circle.center.y, circle.color))
	let diff = 1 - circle.radius
	while (y <= x){
		if (diff >= 0){
			x--
			diff -= x + x
		}
		y++
		diff += y + y + 1
		px.push(new Pixel(x + circle.center.x, y + circle.center.y, circle.color))
	}
	return px
}



export function drawEllipseLib(ellipse, context) {
	context.beginPath()
	context.strokeStyle = ellipse.color
	context.ellipse(ellipse.center.x, ellipse.center.y, ellipse.Rx, ellipse.Ry, 0, 0, 2*Math.PI)
	context.stroke()
}

export function drawEllipseCanon(ellipse) {
    let px = []
    let sqrRa = ellipse.Rx * ellipse.Rx
    let sqrRb = ellipse.Ry * ellipse.Ry

    let borderX = Math.round(ellipse.center.x + ellipse.Rx / Math.sqrt(1 + sqrRb / sqrRa))
    let borderY = Math.round(ellipse.center.y + ellipse.Ry / Math.sqrt(1 + sqrRa / sqrRb))
    for (let x = ellipse.center.x; x < borderX + 1; x++) {
        let y = ellipse.center.y + Math.sqrt(sqrRa * sqrRb - (x - ellipse.center.x) ** 2 * sqrRb) / ellipse.Rx
        px.push(new Pixel(x, y, ellipse.color))
    }
    
    for (let y = ellipse.center.y; y < borderY + 1; y++) {
        let x = ellipse.center.x + Math.sqrt(sqrRa * sqrRb - (y - ellipse.center.y) ** 2 * sqrRa) / ellipse.Ry
        px.push(new Pixel(x, y, ellipse.color))
    }
    return px;
}

export function drawEllipseParam(ellipse) {
    let px = []
    if (ellipse.Rx > ellipse.Ry) {
        var step = 1 / ellipse.Rx
    } else {
        var step = 1 / ellipse.Ry
    }
    for (let i = 0; i <= Math.PI / 2 + step; i += step) {
        let x = ellipse.center.x + Math.round(ellipse.Rx * Math.cos(i))
        let y = ellipse.center.y + Math.round(ellipse.Ry * Math.sin(i))
        px.push(new Pixel(x, y, ellipse.color))
    }
    return px
}

export function drawBresenhamEllipse(ellipse) {
	let px = []
    let x = 0
    let y = ellipse.Ry
	px.push(new Pixel(ellipse.center.x, y + ellipse.center.y, ellipse.color))

    let sqrRx = ellipse.Rx * ellipse.Rx
    let sqrRy = ellipse.Ry * ellipse.Ry
    let diff = sqrRy - sqrRx * (ellipse.Ry + ellipse.Ry + 1)

	while (y >= 0) {
		if (diff <= 0) {
			let d = 2 * diff + sqrRx * (y + y + 2)
			x++
			diff += sqrRy * (x + x + 1)

			if (d >= 0) {
				y--
				diff += sqrRx * (-y - y + 1)
			}
		} else {
			let d = 2 * diff + sqrRy * (-x - x + 2)
			y--
			diff += sqrRx * (-y - y + 1)

			if (d <= 0) {
				x++
				diff += sqrRy * (x + x + 1)
			}
		}
		px.push(new Pixel(x + ellipse.center.x, y + ellipse.center.y, ellipse.color))
	}
	return px
}

export function drawMidpointEllipse(ellipse) {
    let px = []
    let sqrRx = ellipse.Rx * ellipse.Rx
    let sqrRy = ellipse.Ry * ellipse.Ry

    let x = 0
    let y = ellipse.Ry
    px.push(new Pixel(ellipse.center.x, y + ellipse.center.y, ellipse.color))

    let border = Math.round(ellipse.Rx / Math.sqrt(1 + sqrRy / sqrRx))
    let diff = sqrRy - Math.round(sqrRx * (ellipse.Ry - 1 / 4))
    while (x <= border) {
        if (diff > 0) {
            y--
            diff -= sqrRx * y * 2
        }
        x++
        diff += sqrRy * (x + x + 1)
        px.push(new Pixel(x + ellipse.center.x, y + ellipse.center.y, ellipse.color))
    }
        
    x = ellipse.Rx
    y = 0
    px.push(new Pixel(x + ellipse.center.x, y + ellipse.center.y, ellipse.color))

    border = Math.round(ellipse.Ry / Math.sqrt(1 + sqrRx / sqrRy))
    diff = sqrRx - Math.round(sqrRy * (x - 1 / 4))
    while (y <= border) {
        if (diff > 0) {
            x--
            diff -= 2 * sqrRy * x
        }
        y++
        diff += sqrRx * (y + y + 1)
        px.push(new Pixel(x + ellipse.center.x, y + ellipse.center.y, ellipse.color))
    }
    return px
}