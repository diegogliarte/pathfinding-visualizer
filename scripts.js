// var width = window.innerWidth
//     || document.documentElement.clientWidth
//     || document.body.clientWidth;
//
// var height = window.innerHeight
//     || document.documentElement.clientHeight
//     || document.body.clientHeight;

var dragging = false
var previousTarget = null
var cells = []
var toggle = false
var draggableClass = false

function initializeStartingPoints() {
    cells[0][0].className = "cell start_point draggable"
    cells[cells.length - 1][cells[0].length - 1].className = "cell end_point draggable"
}

function initializeBoard() {

    var board = document.getElementById("board")
    var size = 25
    for (i = 0; i < 30; i++) {
        row = board.insertRow()
        rows = []
        for (j = 0; j < 50; j++) {
            cell = row.insertCell()
            cell.classList.add("cell")
            cell.classList.add("empty")
            cell.width = size + "px"
            cell.height = size + "px"
            rows.push(cell)
        }
        cells.push(rows)
    }
    initializeStartingPoints();

}

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

function draw(target) {
    if (dragging && target !== previousTarget && (isEmpty(target) || (toggle && isWall(target)))) {
        previousTarget = target
        target.classList.toggle("wall")
        target.classList.toggle("empty")
    }
}

document.addEventListener("mousedown", function (e) {
    clearSelection()
    dragging = true
    draw(e.target)
    if (isDraggable(e.target)) {
        draggableClass = e.target.className
    }
    previousTarget = e.target

})
document.addEventListener("mouseup", function (e) {
    clearSelection()
    dragging = false
    draggableClass = null
    previousTarget = null
})

document.addEventListener("mousemove", function (e) {
    if (draggableClass) {
        if (previousTarget !== e.target) {
            e.target.className = draggableClass
            previousTarget.className = "cell empty"
            previousTarget = e.target
        }

    } else {
        draw(e.target);
    }
})

document.addEventListener("keypress", function (e) {
    if (e.key === 't') {
        toggle = !toggle
    }
    if (e.key === 'r') {
        resetBoard()
    }
})

function isEmpty(target) {
    return target.classList.contains("empty") && !target.classList.contains("start_point") && !target.classList.contains("end_point")
}

function isWall(target) {
    return target.classList.contains("wall") && !target.classList.contains("start_point") && !target.classList.contains("end_point")
}

function isDraggable(target) {
    return target.classList.contains("draggable")
}

function resetBoard() {
    for (i = 0; i < cells.length; i++) {
        for (j = 0; j < cells[0].length; j++) {
            cell = cells[i][j]
            if (!isDraggable(cell)) {
                cell.className = "cell empty"
            }
        }
    }

}

window.onload = function () {
    initializeBoard()
}
