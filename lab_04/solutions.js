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
	console.log(px)
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
	console.log("mid point")
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