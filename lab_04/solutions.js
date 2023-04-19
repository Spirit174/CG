import { Pixel } from "./pixel.js"

export function drawCircleLib(circle, context) {
	context.beginPath()
	context.strokeStyle = circle.color
	context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2*Math.PI)
	context.stroke()
}

export function drawCircleCanon(circle) {
	let px = []
	console.log("Canon")
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
	console.log("Param")
	let step = 1 / circle.radius
	for (let i = 0; i <= Math.Pi / 4 + step; i += step){
		let x = circle.center.x + Math.round(circle.radius * Math.cos(i))
		let y = circle.center.y + Math.round(circle.radius * Math.sin(i))
		px.push(new Pixel(x, y, circle.color))
	}
	return px
}