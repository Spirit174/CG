import { initLine } from "./line.js"

export const mSDelay = 0.00001

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const border = [0, 0, 0, 255]
const filler = [50, 205, 50, 255]

export function createPixel(context, rgba) {
    let pixel = context.createImageData(1, 1)
    var d = pixel.data
    for (let i = 0; i < d.length; i+=4) {
        d[i] = rgba[i % filler.length]
        d[i+1] = rgba[(i+1) % filler.length]
        d[i+2] = rgba[(i+2) % filler.length]
        d[i+3] = rgba[(i+3) % filler.length]
    }
    return pixel
}

export function seedFilling(context, seed, color, maxCanvasSizes) {
    let stack = [{x: seed.x(), y: seed.y()}]
    let pixel = createPixel(context, filler)

    let lines = []
    while (stack.length) {
        let seed = stack.pop()
        let seedX = seed.x
        let seedY = seed.y
        context.putImageData(pixel, seedX, seedY)

        let x = seedX + 1
        while (x <= maxCanvasSizes.x && !isBorder(context, x, seedY)) {
            context.putImageData(pixel, x, seedY)
            x++
        }
        let xRight = x - 1

        x = seedX - 1
        while (x >= 0 && !isBorder(context, x, seedY)) {
            context.putImageData(pixel, x, seedY)
            x--
        }
        let xLeft = x + 1
        let line = initLine([xLeft, seedY, xRight, seedY], color)
        line.name('line-fill')
        lines.push(line)

        if (seedY < maxCanvasSizes.y - 1) {
            getNewSeeds(context, stack, xLeft, xRight, seedY + 1)
        }
        if (seedY > 0) {
            getNewSeeds(context, stack, xLeft, xRight, seedY - 1)
        }
    }
    return lines
}

function getNewSeeds(context, stack, left, right, y) {
    let tmpX = left

    while (tmpX <= right) {
        let flag = false
        while (tmpX <= right && !isBorder(context, tmpX, y) && !isFiller(context, tmpX, y)) {
            flag = true
            tmpX += 1
        }

        if (flag) {
            if (tmpX <= right && !isBorder(context, tmpX, y) && !isFiller(context, tmpX, y)) {
                stack.push({x: tmpX, y: y})
            } else {
                stack.push({x: tmpX - 1, y: y})
            }
            flag = false
        }
        let beginX = tmpX
        while (tmpX <= right && (isBorder(context, tmpX, y) || isFiller(context, tmpX, y))) {
            tmpX++
        }
        if (tmpX == beginX) {
            tmpX++
        }
    }
}

export function getAbsolutePosition(relativePos, scale) {
    return {x: relativePos.x * scale.x, y: relativePos.y * scale.y}
}

function isBorder(context, x, y) {
    let rgba = context.getImageData(x, y, 1, 1).data
    return rgba[0] == border[0] && rgba[1] == border[1] && rgba[2] == border[2] && rgba[3] == border[3]
}

function isFiller(context, x, y) {
    let rgba = context.getImageData(x, y, 1, 1).data
    return rgba[0] == filler[0] && rgba[1] == filler[1] && rgba[2] == filler[2] && rgba[3] == filler[3]
}

function setPixel(context, imgData, pixel) {
    context.putImageData(imgData, pixel.x, pixel.y)
}

export function setPixels(context, imgData, pixels) {
    pixels.forEach(pixel => {
        setPixel(context, imgData, pixel)  
    })
}