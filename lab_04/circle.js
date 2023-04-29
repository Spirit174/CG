import { FigColor } from "./main.js";
import { Point } from "./point.js";
import { CircleVariableParamsFields, getAvailableFields } from './fields.js';

const CircleProp = {
    "centerX": document.getElementById("CircleCenterX"),
    "centerY": document.getElementById("CircleCenterY"),
    "radius": document.getElementById("CircleRadius")
}

export class Circle{
    constructor(center, radius, color){
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
}

export function readCircle(){
    let x = CircleProp["centerX"].value 
    let y = CircleProp["centerY"].value 
    let radius = CircleProp["radius"].value

    if (isNaN(x) || isNaN(y) || isNaN(radius) || radius.lenght == 0){
        throw new Error("Ошибка ввода точки или радиуса, повторите пожайлуста ввод");
    }
    return new Circle (new Point (Number(x), Number(y)), Number(radius), FigColor.value)
}

export class CircleSpectrum {
	constructor(center, startRadius, endRadius, step, color) {
		this.center = center
		this.startRadius = startRadius
		this.endRadius = endRadius
        this.step = step
		this.color = color
	}
}

export function readCircleSpectrum() {
    let x = CircleProp["centerX"].value
    let y = CircleProp["centerY"].value
    if (isNaN(x) || Number(x) <= 0 || isNaN(y) || Number(y) <= 0) {
        throw new Error("Inavlid circle center coords.")
    }

    let params = {}
    for (let param in CircleVariableParamsFields) {
        params[param] = undefined
    }
    let availableParams = getAvailableFields(CircleVariableParamsFields)
    console.log(availableParams)
    for (let param in availableParams) {
        if (isNaN(availableParams[param]["value"].value) || Number(availableParams[param]["value"].value) <= 0) {
            throw new Error("не то епта")
        }
        params[param] = Number(availableParams[param]["value"].value)
    }
    // console.log(typeof(params["StartRadius"]))
    // console.log(typeof(params["EndRadius"]))
    // console.log(typeof(params["Count"]))
    // console.log(params)
    if (!params["StartRadius"]) {
        params["StartRadius"] = params["EndRadius"] - params["Step"] * params["Сount"]
    } else if (!params["EndRadius"]) {
        params["EndRadius"] = params["StartRadius"] + params["Step"] * params["Сount"]
    } else if (!params["Step"]) {
        var temp_1 = params["EndRadius"] - params["StartRadius"]
        // console.log(temp_1)
        var temp_2 = params["Count"] - 1
        // console.log(temp_2)
        var temp_3 = temp_1 / temp_2
        // console.log(temp_3)
        params["Step"] = temp_3
        // console.log(params["Step"])
        // params["Step"] = (params["EndRadius"] - params["StartRadius"]) / (params["Сount"] - 1)
    }
    if (params["StartRadius"] > params["EndRadius"]) {
        [params["StartRadius"], params["EndRadius"]] = [params["EndRadius"], params["StartRadius"]]
    }
    console.log(params)
    return new CircleSpectrum(new Point(Number(x), Number(y)), params["StartRadius"], params["EndRadius"], params["Step"], FigColor.value)
}