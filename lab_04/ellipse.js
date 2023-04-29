import { FigColor } from "./main.js";
import { Point } from "./point.js";
import { EllipseVariableParamsFields, getAvailableFields } from "./fields.js";

const EllipseParamsFields = {
    "centerX": document.getElementById("EllipseCenterX"),
    "centerY": document.getElementById("EllipseCenterY"),
    "Rx": document.getElementById("EllipseRadiusX"),
    "Ry": document.getElementById("EllipseRadiusY")
}


export class Ellipse {
	constructor(center, Rx, Ry, angle, color) {
		this.center = center
		this.Rx = Rx
		this.Ry = Ry
        this.angle = angle
		this.color = color
	}
}

export function readEllipse() {
    let x = EllipseParamsFields["centerX"].value
    let y = EllipseParamsFields["centerY"].value
    let Rx = EllipseParamsFields["Rx"].value
    let Ry = EllipseParamsFields["Ry"].value
    // console.log("2")
    if (isNaN(x) || isNaN(y) || isNaN(Rx) || isNaN(Ry)) {
        throw new Error("Не нормальный ввод")
    }
    // console.log("3")
    return new Ellipse(new Point(Number(x), Number(y)), Number(Rx), Number(Ry), 0, FigColor.value)
}

const ellipseSpectrumPermanentParams = {
    "startRx": document.getElementById("EllipseStartRadiusX"),
    "startRy": document.getElementById("EllipseStartRadiusY"),
    "count": document.getElementById("EllipseCount")
}

export class EllipseSpectrum {
	constructor(center, startRx, startRy, stepRx, stepRy, count, color) {
		this.center = center
		this.startRx = startRx
        this.startRy = startRy
        this.stepRx = stepRx
        this.stepRy = stepRy
        this.count = count
		this.color = color
	}
}


export function readEllipseSpectrum() {
    let x = EllipseParamsFields["centerX"].value
    let y = EllipseParamsFields["centerY"].value

    let startRx = ellipseSpectrumPermanentParams["startRx"].value
    let startRy = ellipseSpectrumPermanentParams["startRy"].value
    let count = ellipseSpectrumPermanentParams["count"].value
    if (isNaN(x) || Number(x) <= 0 || isNaN(y) || Number(y) <= 0 ||
        isNaN(startRx) || Number(startRx) <= 0 || isNaN(startRy) || Number(startRy) <= 0 ||
        isNaN(count) || Number(count) <= 0) {
        throw new Error("Чаго пишешь то")
    }
    startRx = Number(startRx)
    startRy = Number(startRy)

    let params = {}
    for (let param in EllipseVariableParamsFields) {
        params[param] = undefined
    }
    let availableParams = getAvailableFields(EllipseVariableParamsFields)
    for (let param in availableParams) {
        if (isNaN(availableParams[param]["value"].value) || Number(availableParams[param]["value"].value) <= 0) {
            throw new Error("Ниче не понятно тут")
        }
        params[param] = Number(availableParams[param]["value"].value)
    }
    console.log(params)
    let ratio = startRx / startRy
    if (!params["RxStep"]) {
        params["RxStep"] = Math.round(ratio * params["RyStep"])
    } else if (!params["RyStep"]) {
        params["RyStep"] = Math.round(params["RxStep"] / ratio)
    }
    console.log(params)
    return new EllipseSpectrum(new Point(Number(x), Number(y)), startRx, startRy, params["RxStep"], params["RyStep"], Number(count), FigColor.value)
}