import { Point } from "./dot.js"

export class Line {
	constructor(point1, point2, color) {
		this.point1 = point1;
		this.point2 = point2;
		this.color = color;
	}
}

function isEqual(point1, point2) {
    return (point1.x == point2.x && point1.y == point2.y)
}

export function BresenhamInt(line) {
	let pixels = [];

	if (isEqual(line.point1, line.point2)) {
		pixels.push(new Point(line.point1.x, line.point1.y))
	} else {
		let dx = line.point2.x - line.point1.x
		let dy = line.point2.y - line.point1.y
		let sx = Math.sign(dx)
		let sy = Math.sign(dy)
		dx = Math.abs(dx)
		dy = Math.abs(dy)
		let m = dy / dx
		let exchanged = false
		if (m > 1) {
			[dx, dy] = [dy, dx]
			m = 1 / m
			exchanged = true
		}
		let f = 2 * dy - dx
		let x = line.point1.x
		let y = line.point1.y

		let tmpX = x
		let tmpY = y

		let twoDx = 2 * dx
		let twoDy = 2 * dy
		for (let i = 0; i <= dx; i++) {
			pixels.push(new Point(x, y))
			if (f >= 0) {
				if (exchanged) {
					x += sx
				} else {
					y += sy
				}
				f -= twoDx
			}

			if (exchanged) {
				y += sy
			} else {
				x += sx
			}
			f += twoDy
			tmpX = x
			tmpY = y
		}
	}
	return pixels;
}