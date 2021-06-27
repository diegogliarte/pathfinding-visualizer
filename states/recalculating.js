import {Default} from "./default.js"
import {Dragging} from "./dragging.js"
import {isCell, isDraggable, resetVisited} from "../utils.js";

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
            resetVisited(this.context.cells, this.context.ROWS, this.context.COLUMNS)
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

export {Recalculating}