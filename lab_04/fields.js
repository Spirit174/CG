export const FigureSelect = document.getElementById("Fig")
FigureSelect.addEventListener('change', selectFigureContainer)

const CircleContainer = document.getElementById("CircleContainer")
export const CircleVariableParamsFields = {
	"StartRadius": {"unavailable": document.getElementById("btn-check-CircleStart"), "value": document.getElementById("CircleStartRadius")},
	"EndRadius": {"unavailable": document.getElementById("btn-check-CircleEnd"), "value": document.getElementById("CircleEndRadius")},
	"Step": {"unavailable": document.getElementById("btn-check-CircleStep"), "value": document.getElementById("CircleStep")},
	"Count": {"unavailable": document.getElementById("btn-check-CircleCount"), "value": document.getElementById("CircleCount")}
}
disableParamFields(Object.values(getUnavailableFields(CircleVariableParamsFields)))
document.CircleParams.CircleParamsRadios.forEach(radio => {
    radio.addEventListener('change', () => updateFields(CircleVariableParamsFields))
})

const EllipseContainer = document.getElementById("EllipseContainer")
export const EllipseVariableParamsFields = {
    "RxStep": {"unavailable": document.getElementById("btn-check-EllipseStepX"), "value": document.getElementById("EllipseStepX")},
    "RyStep": {"unavailable": document.getElementById("btn-check-EllipseStepY"), "value": document.getElementById("EllipseStepY")}
}
disableParamFields(Object.values(getUnavailableFields(EllipseVariableParamsFields)))
document.EllipseParams.EllipseParamsRadios.forEach(radio => {
    radio.addEventListener('change', () => {updateFields(EllipseVariableParamsFields)})
})

function selectFigureContainer() {
    let figure = FigureSelect.value
    if (figure == "Circle") {
        showContainer(CircleContainer)
        hideContainer(EllipseContainer)
    } else if (figure == "Ellipse") {
        showContainer(EllipseContainer)
        hideContainer(CircleContainer)
    } else {
        throw new Error("Undefined figure.")
    }
}

function showContainer(container) {
    container.style.display = 'block';
}

function hideContainer(container) {
    container.style.display = 'none';
}

function updateFields(paramFields) {
    disableParamFields(Object.values(getUnavailableFields(paramFields)))
    enableParamFields(Object.values(getAvailableFields(paramFields)))
}

function getUnavailableFields(paramsFields) {
    let unavailable = Object.fromEntries(Object.entries(paramsFields).filter(([name, params]) => params["unavailable"].checked))
    return unavailable;
}

export function getAvailableFields(paramsFields) {
    let unavailable = Object.fromEntries(Object.entries(paramsFields).filter(([name, params]) => !params["unavailable"].checked))
    return unavailable;
}

function disableParamFields(params) {
    params.forEach(param => {
        param["value"].setAttribute("disabled", "")
        param["value"].style.textDecoration = 'line-through'
    });
}

function enableParamFields(params) {
    params.forEach(param => {        
        param["value"].removeAttribute("disabled")
        param["value"].style.textDecoration = 'none'
    });
}
