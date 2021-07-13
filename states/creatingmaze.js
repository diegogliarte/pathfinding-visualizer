import {Default} from "./default.js"
import {resetBoard} from "../utils.js";
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

    start() {
        resetBoard(this.context.cells, this.context.ROWS, this.context.COLUMNS)
        this.maze = this.context.maze
        this.createMaze().then(e => this.context.change(Default))
    }

    handleMouseup() {
    }

    handleMousedown() {

    }

    handleMousemove(event) {

    }

    handleRunAlgorithm(event) {

    }

    handleReset(event) {

    }

    async createMaze() {
        if (this.maze === "create-random") {
            await createRandom(this)
        } else if (this.maze === "create-recursive") {
            await createRecursive(true, 0, this.context.COLUMNS - 1, 0, this.context.ROWS - 1, this)
        }
    }
}

export {CreatingMaze}
