const COLUMNS = 50
const ROWS = 20
const cells = []
let toggle = false;
var contextState

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Context {
    constructor(cells) {
        this.cells = cells
        this.states = [new Default(this), new Dragging(this), new Drawing(this), new Pathfinding(this), new Recalculating(this), new CreatingMaze(this)]
        this.current = this.states[0]
    }


    change(state, event, firstTarget = null, previousTarget = null) {
        let newState = this.getState(state)
        console.log(this.current.toString(), " -> ", newState.toString())
        this.current = newState
        this.current.start(event, firstTarget, previousTarget);
    };

    getState(state) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i] instanceof state) {
                return this.states[i]
            }
        }
        return this.states[0]
    }

    start() {
        let _this = this
        document.addEventListener("mouseup", function (event) {
            clearSelection()
            _this.current.handleMouseup(event)
        })
        document.addEventListener("mousedown", function (event) {
            clearSelection()
            _this.current.handleMousedown(event)
        })
        document.addEventListener("mousemove", function (event) {
            _this.current.handleMousemove(event)
        })
        document.getElementById("run-algorithm").addEventListener("click", function (event) {
            _this.current.handleRunAlgorithm(event)
        })
        let mazes = document.getElementsByClassName("create-maze")
        for (let i = 0; i < mazes.length; i++) {
            mazes[i].addEventListener("click", function (event) {
                _this.current.handleCreateMaze(event)
            })
        }
        _this.current.start();
    };
}

class Default {
    constructor(context) {
        this.context = context
    }

    start(event) {

    }


    toString() {
        return "Default"
    }


    handleMousedown(event) {
        this.context.change(Dragging, event, event.target.cloneNode())
    }

    handleMouseup(event) {

    }

    handleMousemove(event) {

    }

    handleRunAlgorithm(event) {
        this.context.change(Pathfinding)
    }

    handleCreateMaze(event) {
        this.context.change(CreatingMaze, event.target.id)
    }
}

class Dragging {
    constructor(context) {
        this.context = context
        this.previousTarget = null

    }


    toString() {
        return "Dragging"
    }

    start(event, firstTarget, previousTarget) {
        this.previousTarget = previousTarget
        if (event && isCell(event.target)) {
            this.context.change(Drawing, event, firstTarget)
        }
    }

    handleMouseup = function () {
        this.context.change(Default)
    }

    handleMousedown(event) {
    }

    handleMousemove(event) {
        if (isCell(event.target)) {
            event = this.previousTarget ? null : event
            this.context.change(Drawing, event, this.previousTarget)
        }
    }

    handleRunAlgorithm = function (event) {

    }

}

class Drawing {
    constructor(context) {
        this.context = context
        this.firstTarget = null
        this.previousTarget = null
        this.previousClassName = "cell empty"

    }

    toString() {
        return "Drawing"
    }

    start(event, firstTarget) {
        if (event) {
            this.drawWalls(event.target)
            this.previousTarget = event.target

        }


        this.firstTarget = firstTarget ? firstTarget : event.target

    }


    handleMouseup = function () {
        this.context.change(Default)

    }

    handleMousedown = function () {

    }

    handleMousemove(event) {
        if (!isCell(event.target) && event.target.id !== "board") {
            this.context.change(Dragging, null, this.firstTarget, this.previousTarget.cloneNode())
        }

        if (isDraggable(this.firstTarget)) {
            let _this = this
            this.movingDraggable(event.target).then(function (target) {
                if (target !== undefined) {
                    target.className = _this.firstTarget.className
                }
            })
        } else {
            this.drawWalls(event.target)
        }


    }

    handleRunAlgorithm = function (event) {

    }


    async drawWalls(target) {
        if (target !== this.previousTarget && (isEmpty(target) || (toggle && isWall(target)))) {
            this.previousTarget = target
            this.previousTarget.classList.toggle("wall")
            this.previousTarget.classList.toggle("empty")
        }

    }

    async movingDraggable(target) {
        if (this.previousTarget !== target && (isWall(target) || isEmpty(target))) {
            this.previousTarget.className = this.previousClassName
            this.previousTarget = target
            this.previousClassName = this.previousTarget.className
            return target
        }
    }
}

class Pathfinding {
    constructor(context) {
        this.context = context
        this.stopped = false
    }


    toString = function toString() {
        return "Pathfinding"
    }

    start() {
        document.getElementById("run-algorithm").innerText = "Stop Algorithm"
        let _this = this
        this.dijkstra().then(path => this.shortestPath(path)).then(shortest => this.drawPath(shortest)).then(function (e) {
            document.getElementById("run-algorithm").innerText = "Run Algorithm"
            if (!_this.stopped) {
                _this.context.change(Recalculating)
            } else {
                resetVisited()
                _this.stopped = false
                _this.context.change(Default)
            }
        })
    }

    handleMousedown(event) {

    }

    handleMouseup(event) {

    }

    handleMousemove(event) {

    }

    handleRunAlgorithm(event) {
        this.stopped = true
    }


    async dijkstra() {
        let distances = new Array(cells.length * cells[0].length).fill(Infinity)
        let visiteds = new Array(cells.length * cells[0].length).fill(false)
        let path = new Array(cells.length * cells[0].length).fill(false)
        const source = this.getSource()
        distances[source] = 0
        while (!visiteds.every(Boolean)) {
            if (this.stopped) {
                return []
            }
            let minDistance = Math.min(...distances.filter(function (elem, i) { // Only gets min from unvisited
                return !visiteds[i]
            }))
            for (let i = 0; i < distances.length; i++) { // Find the min
                if (distances[i] === minDistance && !visiteds[i]) {
                    var u = i
                    break
                }
            }


            visiteds[u] = true
            let neighbors = this.getNeighbors(u, visiteds)
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i]
                let pos = this.singleToDoubleIndex(neighbor)
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

    shortestPath(path) {
        let S = []
        let u = this.getTarget()
        let source = this.getSource()
        if (path[u] || u === source) {
            while (path[u] !== false) {
                S.unshift(u)
                u = path[u]
            }
        }
        return S
    }

    drawPath(path) {
        for (let i = 0; i < path.length - 1; i++) {
            let pos = this.singleToDoubleIndex(path[i])
            cells[pos.y][pos.x].classList.add("path")
        }
    }

    findFirstFromClass(func) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (func(cells[i][j])) {
                    return this.doubleToSingleDigit(i, j)
                }
            }

        }
    }


    getSource() {
        return this.findFirstFromClass(isStart);
    }


    getTarget() {
        return this.findFirstFromClass(isEnd);
    }


    doubleToSingleDigit(i, j) {
        return i * COLUMNS + j
    }


    singleToDoubleIndex(i) {
        return {x: i % COLUMNS, y: Math.trunc(i / COLUMNS)}
    }


    getNeighbors(node, visiteds) {
        let north = node - COLUMNS
        let south = node + COLUMNS
        let pos = this.singleToDoubleIndex(node)
        let east = pos.x !== cells[0].length - 1 ? node + 1 : node
        let west = pos.x !== 0 ? node - 1 : node
        return this.getValidNeighbors([north, south, east, west], visiteds)
    }


    getValidNeighbors(neighbors, visiteds) {
        let valids = []
        for (let i = 0; i < neighbors.length; i++) {
            let pos = this.singleToDoubleIndex(neighbors[i])
            if (isInside(pos.x, pos.y) && !visiteds[neighbors[i]] && !isVisited(cells[pos.y][pos.x]) && !isWall(cells[pos.y][pos.x])) {
                valids.push(neighbors[i])
            }
        }
        return valids
    }

}

class Recalculating {
    constructor(context) {
        this.context = context
    }

    toString() {
        return "Recalculating"
    }

    start() {

    }


    handleMouseup() {

    }

    handleMousedown(event) {
        let target = event.target
        if (isDraggable(target)) {

        } else if (isCell(target)) {
            resetVisited()
            this.context.change(Dragging, event, event.target, event.target)
        } else {
            this.context.change(Default)
        }
    }

    handleMousemove(event) {

    }

    handleRunAlgorithm(event) {

    }
}


class CreatingMaze {
    constructor(context) {
        this.context = context
        this.maze = null
    }


    toString() {
        return "CreatingMaze"
    }

    start(maze) {
        resetBoard()
        this.maze = maze
        this.createMaze().then(e => this.context.change(Default))

    }

    handleMouseup = function () {
    }

    handleMousedown = function () {

    }

    handleMousemove = function (event) {

    }

    handleRunAlgorithm = function (event) {

    }

    async createMaze() {
        if (this.maze === "create-random") {
            await this.createRandom()
        } else if (this.maze === "create-recursion") {
            await this.createRecursive(true, 0, COLUMNS - 1, 0, ROWS - 1)
        }
    }

    async createRandom() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                if (Math.trunc(this.randomRange(0, 4)) === 0) {
                    await sleep(2.5)
                    let target = cells[i][j]
                    target.classList.toggle("wall")
                    target.classList.toggle("empty")
                }
            }
        }
    }


    async createRecursive(h, minX, maxX, minY, maxY) { // TODO Fix it? It generates impossible mazes many times
        if (h && maxX - minX >= 1) {
            let y = Math.floor(this.randomRange(minY, maxY) / 2) * 2

            await this.addHWall(minX, maxX, y)
            await this.createRecursive(!h, minX, maxX, minY, y - 1)
            await this.createRecursive(!h, minX, maxX, y + 1, maxY)
        } else if (!h && maxY - minY >= 1) {
            let x = Math.floor(this.randomRange(minX, maxX) / 2) * 2

            await this.addVWall(minY, maxY, x)
            await this.createRecursive(!h, minX, x - 1, minY, maxY)
            await this.createRecursive(!h, x + 1, maxX, minY, maxY)
        }

    }

    async addHWall(minX, maxX, y) {
        let hole = this.getHole(minX, maxX)
        for (let i = minX; i <= maxX; i++) {
            if (i !== hole) {
                await sleep(5)
                let target = cells[y][i]
                if (!isDraggable(target)) {
                    target.className = "cell wall"
                }

            }
        }
    }

    async addVWall(minY, maxY, x) {
        let hole = this.getHole(minY, maxY);
        for (let i = minY; i <= maxY; i++) {
            if (i !== hole) {
                await sleep(5)
                let target = cells[i][x]
                if (!isDraggable(target)) {
                    target.className = "cell wall"
                }
            }
        }
    }

    getHole(min, max) {
        return Math.floor(this.randomRange(min, max) / 2) * 2 + 1
    }


    randomRange(min, max) {
        return Math.random() * (max - min + 1) + min
    }

}


function initializeStartingPoints() {
    let start = cells[cells.length / 2][Math.round(cells[0].length * 1 / 3)]
    start.className = "cell start_point draggable"

    let end = cells[cells.length / 2][Math.round(cells[0].length * 2 / 3)]
    end.className = "cell end_point draggable"

}

function initializeBoard() {
    let board = document.getElementById("board")
    for (let i = 0; i < ROWS; i++) {
        let row = board.insertRow()
        let rows = []
        for (let j = 0; j < COLUMNS; j++) {
            let cell = row.insertCell()
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
        contextState.change(Default)

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

function reset(func, bool) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            let cell = cells[i][j]
            if (func(cell) === bool) {
                cell.className = "cell empty"
            }
        }
    }
}

function resetBoard() {
    reset(isDraggable, false)

}

function resetVisited() {
    reset(isVisited, true)
}

window.onload = function () {
    initializeBoard()
    contextState = new Context(cells)
    contextState.start()

}
