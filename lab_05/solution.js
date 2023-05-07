let defaultLineConfig = {
    id: 'line',
    lineCap: 'round',
    lineJoin: 'round',
};

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

function lineInit(x1, y1, x2, y2, fillColor, id) {
    return new Konva.Line(Object.assign(defaultLineConfig, {
        points: [x1, y1, x2, y2],
        stroke: fillColor,
        id: 'line-' + id,
    }))
};

function makeLines(intersections, y, minX, maxX) {
    let lines = [];
    for (let i = 0; i < intersections.length; i += 2) {
        const x1 = Math.max(minX, Math.ceil(intersections[i]));
        const x2 = Math.min(maxX, Math.floor(intersections[i + 1]));
        if (x1 <= x2) {
            lines.push({
                x1: x1,
                x2: x2,
                y: y,
            });
        }
    }
    return lines;
}

export function fillPolygons(polygons) {
    // Найдите минимальные и максимальные координаты x и y всех многоугольников
    var neginf = -Infinity
    var [mincoordX, maxcoordX, mincoordY, maxcoordY] = [Infinity, neginf, Infinity, neginf]
    // console.log(polygons)
    polygons.forEach((polygon) => {
        polygon.forEach((point) => {
            const coordx = point.x()
            const coordy = point.y()
            if(coordx < mincoordX) {mincoordX = coordx}
            if(coordy < mincoordY) {mincoordY = coordy}
            if(coordx > maxcoordX) {maxcoordX = coordx}
            if(coordy > maxcoordY) {maxcoordY = coordy}
        });
    });
    console.log(mincoordX, maxcoordX, mincoordY, maxcoordY)


    let lines = [];
    for (let y = mincoordY; y <= maxcoordY; y++) {
        let intersections = [];

        // Итерация по каждому полигону
        polygons.forEach((polygon) => {
        // Итерация по каждому краю многоугольника
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x();
            const yi = polygon[i].y();
            const xj = polygon[j].x();
            const yj = polygon[j].y();

            // Проверка пересекает ли край линию сканирования
            if ((yi <= y && y < yj) || (yj <= y && y < yi)) {
                const x = ((y - yi) * (xj - xi)) / (yj - yi) + xi;
                intersections.push(x);
            }
        }
        });

        // Сортировка пересечений по координате x
        intersections.sort((a, b) => a - b);

        lines = [...lines, ...makeLines(intersections, y, mincoordX, maxcoordX)]
    }

    return lines;
}


export async function drawLines(layer, lines, fillColor, id, delay=false) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        layer.add(lineInit(line.x1, line.y, line.x2, line.y, fillColor, id));
        if (delay) {
            await sleep(1e-6);
        }
        layer.batchDraw();
    }
}