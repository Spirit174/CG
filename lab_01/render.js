const path = require('path')
const url = require('url')
const { app } = require('electron')

const remote = require('@electron/remote');
const { parse } = require('path');
const { BrowserWindow } = remote

let statuses = []
let actual

// кнопки
const addBtn = document.getElementById('add')
const delBtn = document.getElementById('del')
const delAllBtn = document.getElementById('delete-all')
const execBtn = document.getElementById('execute')

const okBtn = document.getElementById('ok-button')

// координаты
const xLabel = document.getElementById('xinput')
const yLabel = document.getElementById('yinput')

// таблицы
global.allDots = document.getElementById('text-area-1')
const resultArea = document.getElementById('result')

const dotIndex = document.getElementById('dotinput')
const canvas = document.getElementById('myChart')

let tempData = []

function saveStatus(stack=1, eventMode=0) {
    if (!stack) {
        actual  = [{
            xLabel: xLabel.value,
            yLabel: yLabel.value,
            xPlaceholder: xLabel.placeholder,
            yPlaceholder: yLabel.placeholder,
            allDots: allDots.value,
            resultArea: resultArea.value,
            data: window.chartData.datasets.slice(),
            tempData: tempData,
            dotIndex: dotIndex.value
        }]
    } else {
        statuses.push({
            event: eventMode,
            xLabel: xLabel.value,
            yLabel: yLabel.value,
            xPlaceholder: xLabel.placeholder,
            yPlaceholder: yLabel.placeholder,
            allDots: allDots.value,
            resultArea: resultArea.value,
            data: window.chartData.datasets.slice(),
            tempData: tempData,
            dotIndex: dotIndex.value
        })
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str)
}

function setDefault() {
    xLabel.placeholder = 'пример: 123.123'
    yLabel.placeholder = 'пример: 123.123'
}

function clearDotLabels() {
    xLabel.value = ""
    yLabel.value = ""
}

function addDot() {
    resultArea.value = ''
    setDefault()

    let x = xLabel.value
    let y = yLabel.value
    if (!isNumeric(x) || !isNumeric(y) || !x || !y) {
        clearDotLabels()
        // createErrorWindow()
        alert('Ошибка ввода точки')
        return
    }

    saveStatus()

    x = parseFloat(x)
    y = parseFloat(y)
    let allData = window.chartData.datasets
    for (let i = 0; i < allData.length; i++) {
        if (allData[i].data.length == 1 && x == allData[i].data[0].x && y == allData[i].data[0].y) {
            clearDotLabels()
            // createErrorWindow()
            alert('Ошибка ввода точки')
            return
        }
    }
    window.chartData.datasets.push({
        label: 'Dot ' + window.nextDatasetId++,
        data: [{ x, y }],
        backgroundColor: `hsl(${window.nextDatasetId * 50}, 50%, 50%)`
    })
    window.chart.update()
    window.chart.resetZoom()
    clearDotLabels()

    x = x.toFixed(3)
    y = y.toFixed(3)

    if (!allDots.value) {
        allDots.value = `${window.nextDatasetId - 1}) ${x}, ${y}`
    } else {
        allDots.value = allDots.value + "\n" + `${window.nextDatasetId - 1}) ${x}, ${y}`
    }
    saveStatus(stack=0)
}

function deleteData()
{
    resultArea.value = ''
    let allData = window.chartData.datasets
    let index = dotIndex.value
    if (!isNumeric(index) || !index || !Number.isInteger(parseFloat(index))) {
        dotIndex.value = ""
        // createErrorWindow()
        alert('Ошибка удаления')
        return
    }
    index = parseInt(index)
    if (index < 0) {
        dotIndex.value = ""
        // createErrorWindow()
        alert('Ошибка удаления')
        return
    }
    saveStatus()
    for (let i = 0; i < allData.length; i++) {
        let dataIndex = allData[i].label.match(/\d+/g).map(Number)
        if (dataIndex.length != 0 && parseInt(dataIndex[0]) == index) {
            index = i
            allData.splice(index, 1)
            window.chart.update()
            updateLists(save=0)
            break
        }
    }
    dotIndex.value = ''
}

function updateLists(save=1) {
    let allData = window.chartData.datasets
    let result
    let data
    if (save) saveStatus()
    allDots.value = ""
    for (let i = 0; i < allData.length; i++) {
        let index = allData[i].label.match(/\d+/g).map(Number)[0]
        if (allData[i].label.includes('Dot')) {
            allDots.value = !allDots.value ? `${index}) ${allData[i].data[0].x.toFixed(3)}, ${allData[i].data[0].y.toFixed(3)}` : allDots.value + "\n" + `${index}) ${allData[i].data[0].x.toFixed(3)}, ${allData[i].data[0].y.toFixed(3)}`
        } else {
            data = []
            data.push(allData[i].data[0])
            data.push(allData[i].data[1])
            //result = getEquation(data)
        }
    }
}

function addLine(x ,y, x1, y1) {

    tempData.push({x, y})
    tempData.push({x1, y1})
    saveStatus()
    window.chartData.datasets.push({
        label: 'Line ' + window.nextDatasetId++,
        type: 'line',
        data: tempData,
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 1,
        showLine: true
    })
    window.chart.update()
    window.chart.resetZoom()
    tempData = []
}

function outputResult(res) {
    saveStatus()
    console.log(res[0].x)
    if (res.length == 0) {
        resultArea.value = 'Решение отсутствует'
    }
    else if (res[0].x == -1.0){
        resultArea.value = 'Количество точек должно быть кратно 3'
    }
    else if (res[0].x == -2.0){
        resultArea.value = 'Никакие три точки не должны лежать на одной прямой'
    }
    else {
        addLine(res[0].x, res[0].y, res[0].x1, res[0].y1)
        //resultArea.value = `x1 = ${res[0].x.toFixed(3)}, y1 = ${res[0].y.toFixed(3)}\nx2 = ${res[0].x.toFixed(3)}, y2 = ${res[0].y.toFixed(3)}`
    }
}
function compare_temp(x1, y1, x2, y2, x3, y3){
    cmp = (x2 - x1) * (y3 - y2) - (x3 - x2) * (y2 - y1)
    return cmp
}

function compareEntyTriangle(x, y, tr_2){
    cmp_1 = compare_temp(x, y, tr_2.x1, tr_2.y1, tr_2.x2, tr_2.y2)
    cmp_2 = compare_temp(x, y, tr_2.x1, tr_2.y1, tr_2.x3, tr_2.y3) 
    cmp_3 = compare_temp(x, y, tr_2.x2, tr_2.y2, tr_2.x3, tr_2.y3)
    if (((cmp_1 > 0) && (cmp_2 > 0) && (cmp_3 > 0)) || ((cmp_1 < 0) && (cmp_2 < 0) && (cmp_3 < 0)) || (cmp_1 == 0) || (cmp_2 == 0) || (cmp_3 == 0))
        return 0
    return 1
}

function compare_triangle_lines(x1, y1, x2, y2, x3, y3, x4, y4){
    if ((((x3-x1)*(y2-y1)-(y3-y1)*(x2-x1))*((x4-x1)*(y2-y1)-(y4-y1)*(x2-x1))<=0) && (((x1-x3)*(y4-y3)-(y1-y3)*(x4-x3))*((x2-x3)*(y4-y3)-(y2-y3)*(x4-x3))<=0)){
        return 0
    }
    return 1
}
function compareEntyTriangle_temp(tr_1, tr_2){
    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x2, tr_1.y2, tr_2.x1, tr_2.y1, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x2, tr_1.y2, tr_2.x3, tr_2.y3, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x2, tr_1.y2, tr_2.x1, tr_2.y1, tr_2.x3, tr_2.y3) == 0){return 0}

    if (compare_triangle_lines(tr_1.x3, tr_1.y3, tr_1.x2, tr_1.y2, tr_2.x1, tr_2.y1, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x3, tr_1.y3, tr_1.x2, tr_1.y2, tr_2.x3, tr_2.y3, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x3, tr_1.y3, tr_1.x2, tr_1.y2, tr_2.x1, tr_2.y1, tr_2.x3, tr_2.y3) == 0){return 0}

    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x3, tr_1.y3, tr_2.x1, tr_2.y1, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x3, tr_1.y3, tr_2.x3, tr_2.y3, tr_2.x2, tr_2.y2) == 0){return 0}
    if (compare_triangle_lines(tr_1.x1, tr_1.y1, tr_1.x3, tr_1.y3, tr_2.x1, tr_2.y1, tr_2.x3, tr_2.y3) == 0){return 0}
    return 1
}

function solution() {
    let allData = window.chartData.datasets
    let dots = []

    if ((allData.length % 3) == 1 || (allData.length % 3) == 2){
        outputResult([{'x': -1.0, 'y': -1.0}])
        return
    }

    for (let i = 0; i < allData.length; i++) {
        dots.push(allData[i].data[0])
    }
    // A = [{x: -10, y: -10}, {x: 10, y: 10}, {x: 10, y: 0}, {x: -10, y: 0}]
    
    for (let i = 0; i < dots.length; i++){
        for (let j = i + 1; j < dots.length; j++){
            for (let k = j + 1; k < dots.length; k++){
                if ((dots[k].x - dots[i].x) / (dots[j].x - dots[i].x) == (dots[k].y - dots[i].y) / (dots[j].y - dots[i].y)){
                    outputResult([{'x': -2.0, 'y': -2.0}])
                    return 
                }
            }
        }
    }
    //S = (1/2)*Math.abs(((x1*y2) + (x2 * y3) + (x3 * y1) - (x2 * y1) - (x3 * y2) - (x1 * y3))) // Формула Гаусса
    //S = ((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2 // Форумал половины векторного произведения
    //let S1 = (1/2) * Math.abs(((dots[0].x  * dots[1].y) + (dots[1].x * dots[2].y) + (dots[2].x * dots[0].y) - (dots[1].x * dots[0].y) - (dots[2].x * dots[1].y) - (dots[0].x * dots[2].y)))
    //let S2 = (1/2) * Math.abs((dots[1].x - dots[0].x) * (dots[2].y - dots[0].y) - (dots[2].x - dots[0].x) * (dots[1].y - dots[0].y))
    //console.log(S1)
    //console.log(S2)
    let S 
    let trianglesS = []
    let trianglesDots = []

    for (let i = 0; i < dots.length; i++){
        for (let j = i + 1; j < dots.length; j++){
            for (let k = j + 1; k < dots.length; k++){
                S = (1/2) * Math.abs((dots[j].x - dots[i].x) * (dots[k].y - dots[i].y) - (dots[k].x - dots[i].x) * (dots[j].y - dots[i].y))
                trianglesS.push(S)
                trianglesDots.push({'x1': dots[i].x, 'y1': dots[i].y, 'x2': dots[j].x, 'y2': dots[j].y, 'x3': dots[k].x, 'y3': dots[k].y, 'ind1' : i, 'ind2' : j, 'ind3' : k})
            }
        }
    }
    let saveindex = []
    let savetriangles = []
    for (let i = 0; i < trianglesS.length; i++){
        let S = 0
        let trianglesS_temp = []
        for (let j = i + 1; j < trianglesS.length; j++){
            if ((trianglesDots[i].ind1 == trianglesDots[j].ind1) || (trianglesDots[i].ind1 == trianglesDots[j].ind2) || (trianglesDots[i].ind1 == trianglesDots[j].ind3)){
                continue;
            }
            if ((trianglesDots[i].ind2 == trianglesDots[j].ind1) || (trianglesDots[i].ind2 == trianglesDots[j].ind2) || (trianglesDots[i].ind2 == trianglesDots[j].ind3)){
                continue;
            }
            if ((trianglesDots[i].ind3 == trianglesDots[j].ind1) || (trianglesDots[i].ind3 == trianglesDots[j].ind2) || (trianglesDots[i].ind3 == trianglesDots[j].ind3)){
                continue;
            }
            if (compareEntyTriangle(trianglesDots[i].x1, trianglesDots[i].y1, trianglesDots[j]) == 0){
                continue;
            }
            if (compareEntyTriangle(trianglesDots[i].x2, trianglesDots[i].y2, trianglesDots[j]) == 0){
                continue;
            }
            if (compareEntyTriangle(trianglesDots[i].x3, trianglesDots[i].y3, trianglesDots[j]) == 0){
                continue;
            }
            //S += trianglesS[i] + trianglesS[j]
            trianglesS_temp.push(j)
        }
        //if (S > maxS){
        saveindex.push(i)
        savetriangles.push(trianglesS_temp)
            //maxS = S
        //}
    }
    //console.log(saveindex)
    //console.log(savetriangles)

    let saveindex_temp = []
    let savetriangles_temp  = []
    for (let i = 0; i < saveindex.length; i++) {
        if (savetriangles[i].length != 0){
            if (compareEntyTriangle_temp(trianglesDots[saveindex[i]], trianglesDots[savetriangles[i][0]]) == 0){
                continue;
            }
            saveindex_temp.push(saveindex[i])
            savetriangles_temp.push(savetriangles[i][0])
            //console.log(trianglesDots[saveindex[i]])
            //console.log(trianglesDots[savetriangles[i][0]])
        }
    }
    //console.log(saveindex_temp)
    //console.log(savetriangles_temp)
    let S_temp = 0
    let S_max = 0
    let result_ind = 0
    let result_ind_1 = 0
    let save_res = []
    let save_res1 = []
    let data_len = allData.length
    while (data_len > 3){
        for (let i = 0; i < saveindex_temp.length; i++) {
            S_temp += trianglesS[saveindex_temp[i]] + trianglesS[savetriangles_temp[i]]
            if (S_temp > S_max){
                S_max = S_temp
                result_ind = saveindex_temp[i]
                result_ind_1 = savetriangles_temp[i]
            }
            S_temp = 0
        }
        if (save_res.indexOf(result_ind) == -1){ save_res.push(result_ind) }
        if (save_res1.indexOf(result_ind_1) == -1){ save_res1.push(result_ind_1) }
        for (let g = 0; g < saveindex_temp.length; g++) {
            let f = 0
            if ((trianglesDots[result_ind].ind1 == trianglesDots[saveindex_temp[g]].ind1) || (trianglesDots[result_ind].ind1 == trianglesDots[saveindex_temp[g]].ind2) || (trianglesDots[result_ind].ind1 == trianglesDots[saveindex_temp[g]].ind3)) {
                f = 1
            }
            if ((trianglesDots[result_ind].ind2 == trianglesDots[saveindex_temp[g]].ind1) || (trianglesDots[result_ind].ind2 == trianglesDots[saveindex_temp[g]].ind2) || (trianglesDots[result_ind].ind2 == trianglesDots[saveindex_temp[g]].ind3)) {
                f = 1
            }
            if ((trianglesDots[result_ind].ind3 == trianglesDots[saveindex_temp[g]].ind1) || (trianglesDots[result_ind].ind3 == trianglesDots[saveindex_temp[g]].ind2) || (trianglesDots[result_ind].ind3 == trianglesDots[saveindex_temp[g]].ind3)) {
                f = 1
            }
            if (f == 1){
                saveindex_temp.splice(g, 1)
                savetriangles_temp.splice(g, 1)
                g--
            }
        }
        //console.log(saveindex_temp)
        //console.log(savetriangles_temp)
        S_max = 0
        data_len -= 6
    }
    //console.log(save_res)
    //console.log(save_res1)
    for (let i = 0; i < save_res.length; i++) {
        console.log(trianglesDots[save_res[i]].x1.toFixed(3))
        outputResult([{'x': trianglesDots[save_res[i]].x1.toFixed(3), 'y': trianglesDots[save_res[i]].y1.toFixed(3), 'x1': trianglesDots[save_res[i]].x2.toFixed(3), 'y1': trianglesDots[save_res[i]].y2.toFixed(3)}])
        outputResult([{'x': trianglesDots[save_res[i]].x2.toFixed(3), 'y': trianglesDots[save_res[i]].y2.toFixed(3), 'x1': trianglesDots[save_res[i]].x3.toFixed(3), 'y1': trianglesDots[save_res[i]].y3.toFixed(3)}])
        
        //console.log(trianglesDots[save_res[i]])
        //console.log(trianglesDots[save_res1[i]])
    }
    //trianglesDots
    return
}

addBtn.addEventListener('click', () => {
    addDot()
})

delBtn.addEventListener('click', () => {
    deleteData()
})

execBtn.addEventListener('click', () => {
    resultArea.value = ''
    console.log('solution')
    solution()
    window.chart.update()
    window.chart.resetZoom()
    updateLists()
})

delAllBtn.addEventListener('click', () => {
    // createAlertWindow()
    saveStatus()
    window.nextDatasetId = 0
    window.chartData.datasets = []
    setDefault()
    clearDotLabels()
    allDots.value = ''
    resultArea.value = ''
    window.chart.update()
})


canvas.addEventListener('mousedown', (event) => {
    if (event.button == 0)
        saveStatus()
    setTimeout(() => {
        if (event.button == 2 && window.success) {
            saveStatus(eventMode=1)
            window.success = 0
            updateLists(save=0)
        } else if (event.button == 0) {
            updateLists(save=0)
            saveStatus(stack=0)
        }
    }, 100)
})

document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (statuses[statuses.length - 1].eventMode) {
            statuses.push(actual[0])
        }
        if (statuses.length == 0)
            return
        let status = statuses[statuses.length - 1]

        xLabel.value = status.xLabel
        yLabel.value = status.yLabel
        xLabel.placeholder = status.xPlaceholder
        yLabel.placeholder = status.yPlaceholder
        allDots.value = status.allDots
        resultArea.value = status.resultArea
        window.chartData.datasets = status.data
        tempData = status.tempData
        dotIndex.value = status.dotIndex

        window.chart.update()
        window.chart.resetZoom()
        updateLists()
        statuses.pop()
        statuses.pop()
    }
})
