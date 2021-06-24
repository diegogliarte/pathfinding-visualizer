// var width = window.innerWidth
//     || document.documentElement.clientWidth
//     || document.body.clientWidth;
//
// var height = window.innerHeight
//     || document.documentElement.clientHeight
//     || document.body.clientHeight;


var cells = []
var toggle = false
var COLUMNS = 50
var ROWS = 20
var contextState

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var Context = function () {
    var currentState = new Default(this);

    this.change = function (state) {
        console.log(currentState.toString(), " -> ", state.toString())
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
        mazes = document.getElementsByClassName("create-maze")
        for (i = 0; i < mazes.length; i++) {
            mazes[i].addEventListener("click", function (event) {
                currentState.handleCreateMaze(event)
            })
        }
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

    this.handleCreateMaze = function (event) {
        state.change(new CreatingMaze(state, event.target.id))
    }


}

var Dragging = function (state, previousEvent = null, firstTarget = null, previousTarget = null) {
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
        drawWalls(previousTarget)
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
            drawWalls(event.target)
        }
    }

    this.handleRunAlgorithm = function (event) {

    }


    async function drawWalls(target) {
        // await sleep(0)
        if (target !== this.previousTarget && (isEmpty(target) || (toggle && isWall(target)))) {
            this.previousTarget = target
            target.classList.toggle("wall")
            target.classList.toggle("empty")
        }

    }

    this.movingDraggable = function movingDraggable(target) {
        if (this.previousTarget !== target && (isWall(target) || isEmpty(target))) {
            target.className = this.firstTarget.className
            this.previousTarget.className = "cell empty"
            this.previousTarget = target
        }
    }
}

var Pathfinding = function (state) {
    this.state = state
    this.cells = cells

    Pathfinding.prototype.toString = function toString() {
        return "Pathfinding"
    }

    this.go = function () {
        document.getElementById("run-algorithm").innerText = "Stop Algorithm"
        dijkstra().then(path => shortestPath(path)).then(shortest => drawPath(shortest)).then(function (e) {
            document.getElementById("run-algorithm").innerText = "Run Algorithm"
            state.change(new Recalculating(state))
        })
    }

    this.handleMousedown = function (event) {

    }

    this.handleMouseup = function (event) {

    }

    this.handleMousemove = function (event) {

    }

    this.handleRunAlgorithm = function (event) {
        console.log("stop")
    }

    async function dijkstra() {
        this.distances = new Array(cells.length * cells[0].length).fill(Infinity)
        this.visiteds = new Array(cells.length * cells[0].length).fill(false)
        var path = new Array(cells.length * cells[0].length).fill(false)
        this.s = getSource()
        this.distances[s] = 0
        while (!visiteds.every(Boolean)) {
            minDistance = Math.min(...this.distances.filter(function (elem, i) { // Only gets min from unvisited
                return !this.visiteds[i]
            }))
            for (i = 0; i < distances.length; i++) { // Find the min
                if (distances[i] == minDistance && !this.visiteds[i]) {
                    var u = i
                    break
                }
            }


            this.visiteds[u] = true
            neighbors = getNeighbors(u)
            for (i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i]
                pos = singleToDoubleIndex(neighbor)
                if (isEnd(cells[pos.y][pos.x])) {
                    path[neighbor] = u
                    return path
                }

                if (distances[neighbor] > distances[u] + 1) {
                    distances[neighbor] = distances[u] + 1
                    path[neighbor] = u
                    cells[pos.y][pos.x].classList.add("visited")
                    await sleep(1);
                }
            }
        }
        return path
    }

    function shortestPath(path) {
        var S = []
        var u = getTarget()
        if (path[u] || u == this.source) {
            while (path[u] !== false) {
                S.unshift(u)
                u = path[u]
            }
        }
        return S
    }

    function drawPath(path) {
        for (i = 0; i < path.length - 1; i++) {
            pos = singleToDoubleIndex(path[i])
            cells[pos.y][pos.x].classList.add("path")
        }
    }

    function findFirstFromClass(func) {
        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLUMNS; j++) {
                if (func(cells[i][j])) {
                    return doubleToSingleDigit(i, j)
                }
            }

        }
    }

    function getSource() {
        return findFirstFromClass(isStart);
    }

    function getTarget(fuc) {
        return findFirstFromClass(isEnd);
    }


    function doubleToSingleDigit(i, j) {
        return i * COLUMNS + j
    }

    function singleToDoubleIndex(i) {
        return {x: i % COLUMNS, y: Math.trunc(i / COLUMNS)}
    }

    function getNeighbors(node) {
        var north = node - COLUMNS
        var south = node + COLUMNS
        pos = singleToDoubleIndex(node)
        var east = pos.x != cells[0].length - 1 ? node + 1 : node
        var west = pos.x != 0 ? node - 1 : node
        return getValidNeighbors([north, south, east, west])
    }

    function getValidNeighbors(neighbors) {
        valids = []
        for (i = 0; i < neighbors.length; i++) {
            pos = singleToDoubleIndex(neighbors[i])
            if (isInside(pos.x, pos.y) && !this.visiteds[neighbors[i]] && !isVisited(cells[pos.y][pos.x]) && !isWall(cells[pos.y][pos.x])) {
                valids.push(neighbors[i])
            }
        }
        return valids
    }

}

var Recalculating = function (state) {
    this.state = state

    Recalculating.prototype.toString = function toString() {
        return "Recalculating"
    }

    this.go = function () {

    }


    this.handleMouseup = function () {

    }

    this.handleMousedown = function (event) {
        target = event.target
        if (isDraggable(target)) {
            console.log("recalculating")
        } else if (isCell(target)) {
            resetVisited()
            state.change(new Dragging(state, event, event.target, event.target))
        } else {
            state.change(new Default(state))
        }
    }

    function resetVisited() {
        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLUMNS; j++) {
                cell = cells[i][j]
                if (isVisited(cell)) {
                    cell.className = "cell empty"
                }
            }
        }
    }

    this.handleMousemove = function (event) {

    }

    this.handleRunAlgorithm = function (event) {

    }
}

var CreatingMaze = function (state, maze) {
    this.state = state


    CreatingMaze.prototype.toString = function toString() {
        return "CreatingMaze"
    }

    this.go = function () {
        resetBoard()
        createMaze().then(e => contextState.change(new Default(contextState)))

    }

    this.handleMouseup = function () {
    }

    this.handleMousedown = function () {

    }

    this.handleMousemove = function (event) {

    }

    this.handleRunAlgorithm = function (event) {

    }

    async function createMaze() {
        if (maze == "create-random") {
            await createRandom()
        } else if (maze == "create-recursive") {
            await createRecursive(1, COLUMNS - 1, 1, ROWS - 1, true)
        }
    }

    async function createRandom() {
        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLUMNS; j++) {
                if (randomRange(0, 4) == 0) {
                    await sleep(2.5)
                    target = cells[i][j]
                    target.classList.toggle("wall")
                    target.classList.toggle("empty")
                }
            }
        }
    }

    async function createRecursive(minWidth, maxWidth, minHeight, maxHeight, isHorizontal) {
        if (isHorizontal && maxHeight - minHeight > 3) {
            var wallIdx = randomRange(minHeight, maxHeight)
            holeIdx = randomRange(minWidth, maxWidth)
            for (i = minWidth - 1; i <= maxWidth; i++) {
                if (i != holeIdx && isEmpty(cells[wallIdx][i])) {
                    await sleep(10)
                    target = cells[wallIdx][i]
                    target.classList.toggle("wall")
                    target.classList.toggle("empty")
                }
            }
            await createMaze(minWidth, maxWidth, minHeight, wallIdx - 1, !isHorizontal)
            await createMaze(minWidth, maxWidth, wallIdx + 2, maxHeight, !isHorizontal)

        } else if (maxWidth - minWidth > 3) {
            wallIdx = randomRange(minWidth, maxWidth)
            holeIdx = randomRange(minHeight, maxHeight)
            for (i = minHeight - 1; i <= maxHeight; i++) {
                if (i != holeIdx && isEmpty(cells[i][wallIdx])) {
                    await sleep(10)
                    target = cells[i][wallIdx]
                    target.classList.toggle("wall")
                    target.classList.toggle("empty")
                }
            }
            await createMaze(minWidth, wallIdx - 1, minHeight, maxHeight, !isHorizontal)
            await createMaze(wallIdx + 2, maxWidth, minHeight, maxHeight, !isHorizontal)
        }
        // if (Math.random() * 2 < 1) { // Horizontal cut
        // if (true) {
        //     var wallIdx = Math.round(Math.random() * height);
        //     var holeIdx = Math.round(Math.random() * width);
        //     for (i = 0; i < COLUMNS; i++) {
        //         if (i != holeIdx && isEmpty(cells[wallIdx][i])) {
        //
        //         }
        //     }
        //     console.log(width, wallIdx - 1, offset)
        //     await createMaze(width, wallIdx, offset)
        //     await createMaze(width, wallIdx, {x: offset.x, y: offset.y + wallIdx + 1})
        // }
        // } else { // Vertical cut
        //     var wallIdx = Math.round(Math.random() * COLUMNS);
        //     var holeIdx = Math.round(Math.random() * ROWS);
        //     for (i = 0; i < ROWS; i++) {
        //         if (i != holeIdx && isEmpty(cells[i][wallIdx])) {
        //             await sleep(25)
        //             target = cells[i][wallIdx]
        //             target.classList.toggle("wall")
        //             target.classList.toggle("empty")
        //         }
        //     }
        // }

    }

    function randomRange(min, max) {
        return Math.trunc(Math.random() * (max - min) + min)
    }

}


function initializeStartingPoints() {
    start = cells[cells.length / 2][Math.round(cells[0].length * 1 / 3)]
    start.className = "cell start_point draggable"

    end = cells[cells.length / 2][Math.round(cells[0].length * 2 / 3)]
    end.className = "cell end_point draggable"

}

function initializeBoard() {

    var board = document.getElementById("board")
    for (i = 0; i < ROWS; i++) {
        row = board.insertRow()
        rows = []
        for (j = 0; j < COLUMNS; j++) {
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


document.addEventListener("keypress", function (e) {
    if (e.key === 't') {
        toggle = !toggle
    }
    if (e.key === 'r') {
        resetBoard()
        contextState.change(new Default(contextState))

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

function isStart(target) {
    return target.classList.contains("start_point")
}

function isEnd(target) {
    return target.classList.contains("end_point")
}

function isVisited(target) {
    return target.classList.contains("visited")
}

function isInside(x, y) {
    return 0 <= x && x < COLUMNS && 0 <= y && y < ROWS
}

function resetBoard() {
    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLUMNS; j++) {
            cell = cells[i][j]
            if (!isDraggable(cell)) {
                cell.className = "cell empty"
            }
        }
    }

}

window.onload = function () {
    initializeBoard()
    contextState = new Context()
    contextState.start()
}
