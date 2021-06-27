import {Default} from "./default.js"
import {Dragging} from "./dragging.js"
import {isCell, isDraggable, isEmpty, isWall} from "../utils.js"

class Drawing {
    constructor(context) {
        this.context = context
        this.firstTarget = null
        this.previousTarget = null
        this.previousClassName = "cell empty"

    }

    toString() {
        return "Drawing"
    }

    start(event, firstTarget) {
        if (event) {
            this.drawWalls(event.target)
            this.previousTarget = event.target

        }


        this.firstTarget = firstTarget ? firstTarget : event.target

    }


    handleMouseup = function () {
        this.context.change(Default)

    }

    handleMousedown = function () {

    }

    handleMousemove(event) {
        if (!isCell(event.target) && event.target.id !== "board") {
            this.context.change(Dragging, null, this.firstTarget, this.previousTarget.cloneNode())
        }

        if (isDraggable(this.firstTarget)) {
            let _this = this
            this.movingDraggable(event.target).then(function (target) {
                if (target !== undefined) {
                    target.className = _this.firstTarget.className
                }
            })
        } else {
            this.drawWalls(event.target)
        }


    }

    handleRunAlgorithm = function (event) {

    }


    async drawWalls(target) {
        if (target !== this.previousTarget && (isEmpty(target) || (this.context.toggleDraw && isWall(target)))) {
            this.previousTarget = target
            this.previousTarget.classList.toggle("wall")
            this.previousTarget.classList.toggle("empty")
        }

    }

    async movingDraggable(target) {
        if (this.previousTarget !== target && (isWall(target) || isEmpty(target))) {
            this.previousTarget.className = this.previousClassName
            this.previousTarget = target
            this.previousClassName = this.previousTarget.className
            return target
        }
    }
}

export {Drawing}