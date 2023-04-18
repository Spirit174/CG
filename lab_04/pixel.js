export class Pixel{
    constructor (x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
function drawPixel(context, pixel){
    context.beginPath();
    context.fillStyle = pixel.color;
    context.fillRect(pixel.x, pixel.y, 1, 1)
}

// function drawSPixel(context, pixel, center, isCircle=True){
//     if (isCircle){
//         drawPixel(context, new Pixel(pixel.y - ce))
//     }
// }