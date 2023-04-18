import { FigColor } from "./main";
import { Point } from "./point";

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