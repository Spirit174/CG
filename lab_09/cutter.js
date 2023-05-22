function get_vect(dot_start, dot_end) {
    return [dot_end.x() - dot_start.x(), dot_end.y() - dot_start.y()]
}

function scalar_mul(fvector, svector) {
    return fvector[0] * svector[0] + fvector[1] * svector[1]
}

function get_vect_mul(fvector, svector) {
    return fvector[0] * svector[1] - fvector[1] * svector[0]
}

function get_vect_check(dot_start, dot_end) {
    return [dot_end.attrs.x - dot_start.attrs.x, dot_end.attrs.y - dot_start.attrs.y]
}
            
            
export function check_polygons(cutter) {
    if (cutter[0].length < 3) {
        return false
    }
    let vect1 = get_vect_check(cutter[0][0], cutter[0][1])
    let vect2 = get_vect_check(cutter[0][1], cutter[0][2])
            
    let sign = undefined
    if (get_vect_mul(vect1, vect2) > 0) {
        sign = 1
    } else {
        sign = -1
    }
            
    for (let i = 2; i < cutter[0].length; i++) {
        let vecti = get_vect_check(cutter[0][i-2], cutter[0][i-1])
        let vectj = get_vect_check(cutter[0][i-1], cutter[0][i])
            
        if (sign * get_vect_mul(vecti, vectj) < 0) {
            return false
            }
        }
        let vecti = get_vect_check(cutter[0][cutter[0].length - 2], cutter[0][cutter[0].length - 1])
        let vectj = get_vect_check(cutter[0][cutter[0].length - 1], cutter[0][0])
        if (sign * get_vect_mul(vecti, vectj) < 0) {
            return false
        }
            
        if (sign < 0) {
            cutter[0].reverse()
        }
            
        return true
}

// Функция получения внутренней нормали к грани
// p1, p2 - вершины грани, cp - одна из точек многоугольника для проверки
// внутренняя нормаль или внешняя нашлась
function getNormalList(cutter){
    let normalList = []
    let lenght = cutter.length
    for (let i = 0; i < cutter.length; i++) {
        normalList.push(getNormal(cutter[i], cutter[(i + 1) % lenght], cutter[(i + 2) % lenght]))
    }
    return normalList
}

function getNormal(p1, p2, cp){
    let vect = get_vect_check(p1, p2)
    let norm
    if (vect[0] == 0){
        norm = [1, 0]
    } else{
        norm = [-vect[1] / vect[0], 1]
    }
    if (get_vect_mul(get_vect(p2, cp), norm) < 0){
        for (let i = 0; i < norm.length; i++) {
            norm[i] = -norm[i]
        }
    }
    return norm
}


export function cut(cutter, fig){
    // console.log(cutter[0], cutter[0].length)
    let normalsList = getNormalList(cutter[0])
    let result = cutFigure(fig[0], cutter[0], normalsList)
    return result
}

//  Функция отсечения фигуры

function cutFigure(fig, cutter, normalsList){
    let resFig = [ ]
    let resCutter = []
    for (let i = 0; i < fig.length; i++){
        resFig.push([fig[i].attrs.x, fig[i].attrs.y])
    }
    for (let i = 0; i < cutter.length; i++){
        resCutter.push([cutter[i].attrs.x, cutter[i].attrs.y])
    }
    for (let i = 0; i < resCutter.length; i++) {
        let curEdge = [resCutter[i], resCutter[(i + 1) % (resCutter.length)]]
        resFig = edgecutFigure(resFig, curEdge, normalsList[i])
        if (resFig.length < 3){
            return []
        }
    }
    return resFig
}

function get_vect_check_point(dot_start, dot_end) {
    return [dot_end[0] - dot_start[0], dot_end[1] - dot_start[1]]
}

// Функция проверки принадлежности точки point отсекателю относительно
//грани [p1, p2]
function check_point(point, p1, p2){
    if (get_vect_mul(get_vect_check_point(p1, p2), get_vect_check_point(p1, point)) <= 0){
        return true
    }
    return false
}


function edgecutFigure(figure, edge, normal){
    let resFig = []
    if (figure.length < 3){
        return []
    }
    let prevCheck = check_point(figure[0], edge[0], edge[1])
    for (let i = 1; i < figure.length + 1; i++) {
        let curCheck = check_point(figure[i % (figure.length)], edge[0], edge[1])
        if (prevCheck){
            if(curCheck){
                resFig.push(figure[i % (figure.length)])
            }else {
                resFig.push(findInter([figure[i - 1], figure[i % (figure.length)]], edge, normal))
            }
        } else{
            if(curCheck){
                resFig.push(findInter([figure[i - 1], figure[i % (figure.length)]], edge, normal))
            }else {
                resFig.push(figure[i % (figure.length)])
            }
        }
        prevCheck = curCheck
    }
    return resFig
}

function findInter(section, edge, normal){
    let wi = get_vect_check_point(edge[0], section[0])
    let d = get_vect_check_point(section[0], section[1])
    let Wck = scalar_mul(wi, normal)
    let Dck = scalar_mul(d, normal)

    let diff = [section[1][0] - section[0][0], section[1][1] - section[0][1]]
    let t = -Wck / Dck

    return [section[0][0] + diff[0] * t, section[0][1] + diff[1] * t]
}


// # Функция, которая удаляет ложные ребра
// def make_uniq(sections):
//     for section in sections:
//         section.sort()
//     return list(filter(lambda x: (sections.count(x) % 2) == 1, sections))


// # Функция проверки, принадлежит ли точка point отрезку section
// def point_in_section(point, section):
//     if abs(vect_mul(get_vect(point, section[0]), get_vect(*section))) <= 1e-6:
//         if (section[0] < point < section[1] or section[1] < point < section[0]):
//             return True
//     return False


// # Функция получения "элементарных" отрезков многоугольника
// def get_sections(section, rest_points):
//     points_list = [section[0], section[1]]
//     for p in rest_points:
//         if point_in_section(p, section):
//             points_list.append(p)

//     points_list.sort()

//     sections_list = list()
//     for i in range(len(points_list) - 1):
//         sections_list.append([points_list[i], points_list[i + 1]])

//     return sections_list


// # Функция выброса ложных ребер из результирующего многоугольника
// def get_uniq_sections(figure):
//     all_sections = list()
//     rest_points = figure[2:]
//     for i in range(len(figure)):
//         cur_section = [figure[i], figure[(i + 1) % len(figure)]]

//         all_sections.extend(get_sections(cur_section, rest_points))

//         rest_points.pop(0)
//         rest_points.append(figure[i])

//     return make_uniq(all_sections)


