// var width = window.innerWidth
//     || document.documentElement.clientWidth
//     || document.body.clientWidth;
//
// var height = window.innerHeight
//     || document.documentElement.clientHeight
//     || document.body.clientHeight;



var cells = []
var toggle = false


var Context = function () {
    var currentState = new Default(this);

    this.change = function (state) {
        console.log(currentState.toString() + " -> " + state.toString())
        currentState = state;
        currentState.go();
    };

    this.start = function () {
        document.addEventListener("mouseup", function (event) {
            clearSelection()
            currentState.handleMouseup(event)
        })
        document.addEventListener("mousedown", function (event) {
            clearSelection()
            currentState.handleMousedown(event)
        })
        document.addEventListener("mousemove", function (event) {
            currentState.handleMousemove(event)
        })
        document.getElementById("run-algorithm").addEventListener("click", function (event) {
            currentState.handleRunAlgorithm(event)
        })

        currentState.go();
    };
}

var Default = function (state) {
    this.state = state

    Default.prototype.toString = function toString() {
        return "Default"
    }

    this.go = function () {

    }


    this.handleMousedown = function (event) {
        state.change(new Dragging(state, event))
    }

    this.handleMouseup = function (event) {

    }

    this.handleMousemove = function (event) {

    }

    this.handleRunAlgorithm = function (event) {
        state.change(new Pathfinding(state))
    }

}

var Dragging = function (state, previousEvent=null, firstTarget=null, previousTarget=null) {
    this.state = state
    this.firstTarget = firstTarget
    this.previousTarget = previousTarget

    Dragging.prototype.toString = function toString() {
        return "Dragging"
    }

    this.go = function () {
        if (previousEvent) { // In case we call from Default
            this.firstTarget = previousEvent.target.cloneNode()
            this.previousTarget = previousEvent.target
        }
    }

    this.handleMouseup = function () {
        state.change(new Default(state))
    }

    this.handleMousedown = function () {

    }

    this.handleMousemove = function (event) {
        if (isCell(event.target)) {
            state.change(new Drawing(state, this.firstTarget, this.previousTarget))
        }
    }

    this.handleRunAlgorithm = function (event) {

    }

}

var Drawing = function (state, firstTarget, previousTarget) {
    this.state = state
    this.firstTarget = firstTarget
    this.previousTarget = previousTarget

    Drawing.prototype.toString = function toString() {
        return "Drawing"
    }

    this.go = function () {
        this.draw(previousTarget)
    }


    this.handleMouseup = function () {
        state.change(new Default(state))
    }

    this.handleMousedown = function () {

    }

    this.handleMousemove = function (event) {
        if (!isCell(event.target)) {
            state.change(new Dragging(state, null, this.firstTarget, this.previousTarget))
        }

        if (isDraggable(this.firstTarget)) {
            this.movingDraggable(event.target)
        } else {
            this.draw(event.target)
        }
    }

    this.handleRunAlgorithm = function (event) {

    }


    this.draw = function (target) {
        if (target !== this.previousTarget && (isEmpty(target) || (toggle && isWall(target)))) {
            this.previousTarget = target
            target.classList.toggle("wall")
            target.classList.toggle("empty")
        }

    }
    this.movingDraggable = function (target) {
        if (this.previousTarget !== target && (isWall(target) || isEmpty(target))) {
            target.className = this.firstTarget.className
            this.previousTarget.className = "cell empty"
            this.previousTarget = target
        }
    }

}

var Pathfinding = function (state) {
    this.state = state

    Pathfinding.prototype.toString = function toString() {
        return "Pathfinding"
    }

    this.go = function () {
        state.change(new Default(state))
    }

    this.handleMousedown = function (event) {

    }

    this.handleMouseup = function (event) {

    }

    this.handleMousemove = function (event) {

    }

    this.handleRunAlgorithm = function (event) {

    }

}

function initializeStartingPoints() {
    start = cells[cells.length / 2][Math.round(cells[0].length * 1/3)]
    start.className = "cell start_point draggable"


    end = cells[cells.length / 2][Math.round(cells[0].length * 2/3)]
    end.className = "cell end_point draggable"

}

function initializeBoard() {

    var board = document.getElementById("board")
    for (i = 0; i < 30; i++) {
        row = board.insertRow()
        rows = []
        for (j = 0; j < 70; j++) {
            cell = row.insertCell()
            cell.classList.add("cell")
            cell.classList.add("empty")
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


// document.addEventListener("mousedown", function (e) {
//     clearSelection()
//     draw(e.target)
//     if (isDraggable(e.target)) {
//         draggableClass = e.target.className
//     }
//    previousTarget = e.target
//
// })
// document.addEventListener("mouseup", function (e) {
//
//     draggableClass = null
//     previousTarget = null
// })

// document.addEventListener("mousemove", function (e) {


//     if (draggableClass) {
//      movingDraggable();
//
//     } else {
//         draw(e.target);
//     }
// })


document.addEventListener("keypress", function (e) {
    if (e.key === 't') {
        toggle = !toggle
    }
    if (e.key === 'r') {
        resetBoard()
    }
})

function isCell(target) {
    return target.classList.contains("cell")
}

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
    var contextState = new Context()
    contextState.start()
}
