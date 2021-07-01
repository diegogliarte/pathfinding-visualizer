import {Default} from "./default.js"
import {Dragging} from "./dragging.js"
import {isCell, isDraggable, isEmpty, isWall, resetVisited} from "../utils.js";
import {Drawing} from "./drawing.js";

class Recalculating {
    constructor(context) {
        this.context = context
    }

    start() {

    }

    toString() {
        return "Recalculating"
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

}

export {Recalculating}