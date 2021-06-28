import {isEnd, isInside, isStart, isVisited, isWall, sleep} from "../../utils.js";

class AStar {
    constructor(context, eightWay = false) {
        this.context = context
        this.stopped = false
        this.eigthWay = false
    }

    stop() {
        this.stopped = true
    }

    async solve() {
        let visiteds = new Array(this.context.cells.length * this.context.cells[0].length).fill(false)
        let path = new Array(this.context.cells.length * this.context.cells[0].length).fill(false)
        let f = new Array(this.context.cells.length * this.context.cells[0].length).fill(Infinity)
        let g = new Array(this.context.cells.length * this.context.cells[0].length).fill(Infinity)
        let h = new Array(this.context.cells.length * this.context.cells[0].length).fill(Infinity)
        const source = this.getSource()
        const target = this.getTarget()
        f[source] = 0
        let u
        while (!visiteds.every(Boolean)) {
            if (this.stopped) {
                return []
            }
            let minDistance = Math.min(...f.filter(function (elem, i) { // Only gets min from unvisited
                return !visiteds[i]
            }))
            for (let i = 0; i < f.length; i++) { // Find the min
                if (f[i] === minDistance && !visiteds[i]) {
                    u = i
                    break
                }
            }


            visiteds[u] = true
            let neighbors = this.eigthWay ? this.getNeighborsEightWay(u, visiteds) : this.getNeighbors(u, visiteds)
            let gScore = f[u] + 1
            let gScoreIsBest = false
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i][0]
                let heuristicCost = 0
                if (!visiteds[neighbors[i]]) {
                    let pos = this.singleToDoubleIndex(neighbor)
                    if (isEnd(this.context.cells[pos.y][pos.x])) {
                        path[neighbor] = u
                        return path
                    }
                    gScoreIsBest = true
                    heuristicCost = this.heuristicManhattan(this.singleToDoubleIndex(neighbor), this.singleToDoubleIndex(target))
                    h[neighbor] = heuristicCost
                    await sleep(1);

                } else if (gScore < g[neighbor]) {
                    gScoreIsBest = true
                }

                if (gScoreIsBest) {
                    path[neighbor[0]] = u
                    let pos = this.singleToDoubleIndex(neighbor)
                    if (neighbor !== source ) {
                        this.context.cells[pos.y][pos.x].classList.add("visited")
                    }
                    path[neighbor] = u
                    g[neighbor] = gScore
                    f[neighbor] = g[neighbor] + h[neighbor]
                }

            }
        }
        return path
    }

    heuristicManhattan(pos0, pos1) {
        let d1 = Math.abs(pos1.x - pos0.x)
        let d2 = Math.abs(pos1.y - pos0.y)
        return d1 + d2
    }

    async shortestPath(path) {
        let S = []
        let u = this.getTarget()
        let source = this.getSource()
        if (path[u] || u === source) {
            while (path[u] !== false && u !== source) {
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

export {AStar}

