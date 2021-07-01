import {randomRange, sleep} from "../../utils.js";

async function kruskal(this_) {
    for (let i = 0; i < this_.context.ROWS; i++) {
        for (let j = 0; j < this_.context.COLUMNS; j++) {
            if (Math.trunc(randomRange(0, 4)) === 0) {
                await sleep(2.5)
                let target = this_.context.cells[i][j]
                target.classList.toggle("wall")
                target.classList.toggle("empty")
            }
        }
    }
}

export {kruskal}