import {Default} from "./default.js"
import {Dragging} from "./dragging.js"
import {Drawing} from "./drawing.js"
import {Pathfinding} from "./pathfinding.js"
import {Recalculating} from "./recalculating.js"
import {CreatingMaze} from "./creatingmaze.js"
import {clearSelection} from "../utils.js";

class Context {
    constructor(cells) {
        this.cells = cells
        this.states = [new Default(this), new Dragging(this), new Drawing(this), new Pathfinding(this), new Recalculating(this), new CreatingMaze(this)]
        this.current = this.states[0]
        this.toggleDraw = false
        this.ROWS = cells.length
        this.COLUMNS = cells[0].length
        this.algorithm = "algorithm-dijkstra"
    }

    toggle() {
        console.log(this.toggleDraw)
        this.toggleDraw = !this.toggleDraw
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

        let algorithms = document.getElementsByClassName("pick-algorithm")
        for (let i = 0; i < algorithms.length; i++) {
            algorithms[i].addEventListener("click", function (event) {
                _this.algorithm = algorithms[i].id
            })
        }

        _this.current.start();
    };
}

export {Context}