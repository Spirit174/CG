export class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export function readPoint(x , y){
    let x_temp = x;
    let y_temp = y;

    if (isNaN(x_temp) || isNaN(y_temp) || x_temp.length == 0 || y_temp.length == 0){
        throw new Error("Ошибка ввода точек, повторите пожайлуста ввод");
    }
    return new Point(Number(x_temp), Number(y_temp));
}