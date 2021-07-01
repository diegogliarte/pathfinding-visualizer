import {Default} from "./default.js"
import {Drawing} from "./drawing.js"
import {isCell} from "../utils.js";

class Dragging {
    constructor(context) {
        this.context = context
        this.previousTarget = null
    }

    toString() {
        return "Dragging"
    }

    start(event, firstTarget, previousTarget) {
        this.previousTarget = previousTarget
        if (event && isCell(event.target)) {
            this.context.change(Drawing, event, firstTarget)
        }
    }

    handleMouseup = function () {
        this.context.change(Default)
    }

    handleMousedown(event) {
    }

    handleMousemove(event) {
        if (isCell(event.target)) {
            event = this.previousTarget ? null : event
            this.context.change(Drawing, event, this.previousTarget)
        }
    }

    handleRunAlgorithm = function (event) {

    }
}

export {Dragging}