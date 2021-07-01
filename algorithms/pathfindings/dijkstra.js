import {isEnd, isInside, isStart, isVisited, isWall, sleep} from "../../utils.js";

class Dijkstra {
    constructor(context, eightWay = false) {
        this.context = context
        this.stopped = false
        this.eigthWay = eightWay
        this.distances = new Array(this.context.COLUMNS * this.context.ROWS).fill(Infinity)
        this.visiteds = new Array(this.context.COLUMNS * this.context.ROWS).fill(false)

    }

    stop() {
        this.stopped = true
    }

    async solve() {
        let path = new Array(this.context.cells.length * this.context.cells[0].length).fill(false)
        const source = this.getSource()
        this.distances[source] = 0
        let u
        const _this = this
        while (!this.visiteds.every(Boolean)) {
            if (this.stopped) {
                return []
            }
            let minDistance = Math.min(...this.distances.filter(function (elem, i) { // Only gets min from unvisited
                return !_this.visiteds[i]
            }))
            for (let i = 0; i < this.distances.length; i++) { // Find the min
                if (this.distances[i] === minDistance && !this.visiteds[i]) {
                    u = i
                    break
                }
            }


            this.visiteds[u] = true
            let neighbors = this.eigthWay ? this.getNeighborsEightWay(u, this.visiteds) : this.getNeighbors(u, this.visiteds)
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i]
                let pos = this.singleToDoubleIndex(neighbor[0])
                if (isEnd(this.context.cells[pos.y][pos.x])) {
                    path[neighbor[0]] = u
                    return path
                }

                if (this.distances[neighbor[0]] > this.distances[u] + 1) {
                    this.distances[neighbor[0]] = this.distances[u] + neighbor[1]
                    path[neighbor[0]] = u
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
        return this.getValidNeighbors([[north, 1], [south, 1], [east, 1], [west, 1]], visiteds)
    }

    getNeighborsEightWay(node, visiteds) {
        let north = node - this.context.COLUMNS
        let south = node + this.context.COLUMNS
        let pos = this.singleToDoubleIndex(node)
        let east = pos.x !== this.context.cells[0].length - 1 ? node + 1 : node
        let west = pos.x !== 0 ? node - 1 : node
        let posNorth = this.singleToDoubleIndex(north)
        let northeast = posNorth.x !== this.context.cells[0].length - 1 && north >= 0 ? north + 1 : node
        let northwest = posNorth.x !== 0 ? north - 1 : node
        let posSouth = this.singleToDoubleIndex(south)
        let southeast = posSouth.x !== this.context.cells[0].length - 1 ? south + 1 : node
        let southwest = posSouth.x !== 0 ? south - 1 : node
        return this.getValidNeighbors([[north, 1], [south, 1], [east, 1], [west, 1], [northeast, 1.41], [northwest, 1.41], [southeast, 1.41], [southwest, 1.41]], visiteds)
    }


    getValidNeighbors(neighbors, visiteds) {
        let valids = []
        for (let i = 0; i < neighbors.length; i++) {
            let pos = this.singleToDoubleIndex(neighbors[i][0])
            if (isInside(pos.x, pos.y, this.context.COLUMNS, this.context.ROWS) && !visiteds[neighbors[i]] && !isVisited(this.context.cells[pos.y][pos.x]) && !isWall(this.context.cells[pos.y][pos.x])) {
                valids.push(neighbors[i])
            }
        }
        return valids
    }
}

export {Dijkstra}

