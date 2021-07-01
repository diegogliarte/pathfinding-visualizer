import {Default} from "./default.js"
import {Recalculating} from "./recalculating.js"
import {resetVisited} from "../utils.js"
import {Dijkstra} from "../algorithms/pathfindings/dijkstra.js";
import {AStar} from "../algorithms/pathfindings/aStar.js";


class Pathfinding {
    constructor(context) {
        this.context = context
        this.algorithm = null
    }


    toString = function toString() {
        return "Pathfinding"
    }

    start() {
        if (this.context.algorithm === "algorithm-dijkstra") {
            this.algorithm = new Dijkstra(this.context, false)
        } else if (this.context.algorithm === "algorithm-dijkstra8Way") {
            this.algorithm = new Dijkstra(this.context, true)
        } else if (this.context.algorithm === "algorithm-a*") {
            this.algorithm = new AStar(this.context, true)
        }

        let _this = this

        this.algorithm.solve().then(path => this.algorithm.shortestPath(path)).then(shortest => this.algorithm.drawPath(shortest)).then(function (e) {
            _this.context.change(Recalculating, _this.algorithm)
        })
    }

    handleMousedown(event) {

    }

    handleMouseup(event) {

    }

    handleMousemove(event) {

    }

    handleRunAlgorithm(event) {
        this.algorithm.stop()
        resetVisited(this.context.cells, this.context.ROWS, this.context.COLUMNS)
        this.context.change(Default)
    }


}

export {Pathfinding}