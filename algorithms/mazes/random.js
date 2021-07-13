import {randomRange, sleep} from "../../utils.js";

async function createRandom(_this) {
    for (let i = 0; i < _this.context.ROWS; i++) {
        for (let j = 0; j < _this.context.COLUMNS; j++) {
            if (Math.trunc(randomRange(0, 4)) === 0) {
                await sleep(2.5)
                let target = _this.context.cells[i][j]
                target.classList.toggle("wall")
                target.classList.toggle("empty")
            }
        }
    }
}

export {createRandom}