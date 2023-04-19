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


function drawSPixel(context, pixel, center, isCircle=true) {
    if (isCircle) {
        drawPixel(context, new Pixel(pixel.y - center.y + center.x,  pixel.x - center.x + center.y, pixel.color))
        drawPixel(context, new Pixel(-pixel.y + center.y + center.x,  pixel.x - center.x + center.y, pixel.color))
        drawPixel(context, new Pixel(pixel.y - center.y + center.x, -pixel.x + center.x + center.y, pixel.color))
        drawPixel(context, new Pixel(-pixel.y + center.y + center.x, -pixel.x + center.x + center.y, pixel.color))
    }

    drawPixel(context,  pixel)
    drawPixel(context, new Pixel(-pixel.x + 2 * center.x, pixel.y, pixel.color))
    drawPixel(context, new Pixel(pixel.x, -pixel.y + 2 * center.y, pixel.color))
    drawPixel(context, new Pixel(-pixel.x + 2 * center.x, -pixel.y + 2 * center.y, pixel.color))
}

export function drawSPixels(context, pixels, center, isCircle=true, antialliasing) {
    if (antialliasing) {
        pixels.forEach(pixel => {
            drawSPixel(context, pixel, center, isCircle)
        });
    } else {
        pixels.forEach(pixel => {
            drawSPixel(context, new Pixel(Math.round(pixel.x), Math.round(pixel.y), pixel.color), center, isCircle)
        });
    }
}