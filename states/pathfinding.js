import {Default} from "./default.js"
import {Recalculating} from "./recalculating.js"
import {isStart, isEnd, isVisited, isWall, resetVisited, sleep, isInside} from "../utils.js"


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
        let distances = new Array(this.context.cells.length * this.context.cells[0].length).fill(Infinity)
        let visiteds = new Array(this.context.cells.length * this.context.cells[0].length).fill(false)
        let path = new Array(this.context.cells.length * this.context.cells[0].length).fill(false)
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
                if (isEnd(this.context.cells[pos.y][pos.x])) {
                    path[neighbor] = u
                    return path
                }

                if (distances[neighbor] > distances[u] + 1) {
                    distances[neighbor] = distances[u] + 1
                    path[neighbor] = u
                    this.context.cells[pos.y][pos.x].classList.add("visited")
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
            this.context.cells[pos.y][pos.x].classList.add("path")
        }
    }

    findFirstFromClass(func) {
        for (let i = 0; i < this.context.ROWS; i++) {
            for (let j = 0; j < this.context.COLUMNS; j++) {
                if (func(this.context.cells[i][j])) {
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
        return i * this.context.COLUMNS + j
    }


    singleToDoubleIndex(i) {
        return {x: i % this.context.COLUMNS, y: Math.trunc(i / this.context.COLUMNS)}
    }


    getNeighbors(node, visiteds) {
        let north = node - this.context.COLUMNS
        let south = node + this.context.COLUMNS
        let pos = this.singleToDoubleIndex(node)
        let east = pos.x !== this.context.cells[0].length - 1 ? node + 1 : node
        let west = pos.x !== 0 ? node - 1 : node
        return this.getValidNeighbors([north, south, east, west], visiteds)
    }


    getValidNeighbors(neighbors, visiteds) {
        let valids = []
        for (let i = 0; i < neighbors.length; i++) {
            let pos = this.singleToDoubleIndex(neighbors[i])
            if (isInside(pos.x, pos.y, this.context.COLUMNS, this.context.ROWS) && !visiteds[neighbors[i]] && !isVisited(this.context.cells[pos.y][pos.x]) && !isWall(this.context.cells[pos.y][pos.x])) {
                valids.push(neighbors[i])
            }
        }
        return valids
    }
}

export {Pathfinding}