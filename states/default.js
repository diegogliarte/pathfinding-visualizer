import {Dragging} from "./dragging.js"
import {Pathfinding} from "./pathfinding.js"
import {CreatingMaze} from "./creatingmaze.js"

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

    handleRunAlgorithm() {
        this.context.change(Pathfinding)
    }

    handleCreateMaze(event) {
        this.context.change(CreatingMaze, event.target.id)
    }

    handleReset(event) {

    }
}

export {Default}