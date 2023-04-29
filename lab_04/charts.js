import { Point } from "./point.js"
import { Circle } from "./circle.js"
import { handler } from "./main.js"
import { Ellipse } from "./ellipse.js";

var circleTimeChart = new Chart(document.getElementById("circleTimeChart"), {
	type: 'line',
	data: {
		labels : [],
		datasets: [],
	},

	options: {
		plugins: {
			title: {
				display: true,
				text: 'Время построения окружности в зависимости от радиуса',
				align: 'center',
			  },
		},

	  	scales: {
			y: {
		  		title: {
					display: true,
					text: 'Время построения, мсек.',
				}
			},
			
			x: {
				title: {
					display: true,
					text: "Радиус, пикс.",
				}
			}
		}
	}
})

var ellipseTimeChart = new Chart(document.getElementById("ellipseTimeChart"), {
	type: 'line',
	data: {
		labels : [],
		datasets: [],
	},

	options: {
		plugins: {
			title: {
				display: true,
				text: 'Время построения эллипса в зависимости от радиуса',
				align: 'center',
			  },
		},

	  	scales: {
			y: {
		  		title: {
					display: true,
					text: 'Время построения, мсек.',
				}
			},
			
			x: {
				title: {
					display: true,
					text: "Радиус (Rx = Ry), пикс.",
				}
			}
		}
	}
})

function addDataset(chart, dataset) {
	chart.data.datasets.push(dataset)
    chart.update()
}

function createLineDataset(data, label, borderColor, fill) {
	let dataset = {}
	dataset["data"] = data
	dataset["label"] = label
	dataset["borderColor"] = borderColor
	dataset["fill"] = fill
	return dataset
}

export function measureCalculatingTime() {
    const measuresCountPerRadius = 5

    const radii = []
    const start = 100000
    const end = 1000000
    const step = 100000
    for (let radius = start; radius <= end; radius += step) {
        radii.push(radius)        
    }

    circleTimeChart.data.labels = radii
    circleTimeChart.data.datasets = []
    for (let algorithmName in handler.circleAlg) {
        let time = []
        let circle = new Circle(new Point(100, 100), 0, handler.properties.bgColor)
        radii.forEach(radius => {
            circle.radius = radius
            let currTime = []
            for (let i = 0; i < measuresCountPerRadius; i++) {
                let elapsedTime = performance.now()
                handler.circleAlg[algorithmName](circle, handler.context)
                elapsedTime = performance.now() - elapsedTime
                currTime.push(elapsedTime)
            }
            time.push(Number(median(currTime).toFixed(4)))
        })
    
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16)
        let dataset = createLineDataset(time, algorithmName, randomColor, false)
        addDataset(circleTimeChart, dataset)
    }


    ellipseTimeChart.data.labels = radii
    ellipseTimeChart.data.datasets = []
    for (let algorithmName in handler.ellipseAlg) {
        let time = []
        let ellipse = new Ellipse(new Point(100, 100), 0, 0, 0, handler.properties.bgColor)
        radii.forEach(radius => {
            ellipse.Rx = radius
            ellipse.Ry = radius
            let currTime = []
            for (let i = 0; i < measuresCountPerRadius; i++) {
                let elapsedTime = performance.now()
                handler.ellipseAlg[algorithmName](ellipse, handler.context)
                elapsedTime = performance.now() - elapsedTime
                currTime.push(elapsedTime)
            }
            time.push(Number(median(currTime).toFixed(4)))
        })

        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16)
        let dataset = createLineDataset(time, algorithmName, randomColor, false)
        addDataset(ellipseTimeChart, dataset)
    }

    handler.redraw()
}

function median(sequence) {
    sequence.sort()
    return sequence[Math.ceil(sequence.length / 2)]
}