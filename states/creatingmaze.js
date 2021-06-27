import {Default} from "./default.js"
import {isDraggable, resetBoard, sleep} from "../utils.js";
import {createRandom} from "../algorithms/mazes/random.js";
import {createRecursive} from "../algorithms/mazes/recursive.js";

class CreatingMaze {
    constructor(context) {
        this.context = context
        this.maze = null
    }


    toString() {
        return "CreatingMaze"
    }

    start(maze) {
        resetBoard(this.context.cells, this.context.ROWS, this.context.COLUMNS)
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
            await createRandom(this)
        } else if (this.maze === "create-recursion") {
            await createRecursive(true, 0, this.context.COLUMNS - 1, 0, this.context.ROWS - 1, this)
        }
    }



}

export {CreatingMaze}
