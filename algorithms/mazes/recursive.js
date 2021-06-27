import {isDraggable, randomRange, sleep} from "../../utils.js";

async function createRecursive(h, minX, maxX, minY, maxY, this_) { // TODO Fix it? It generates impossible mazes many times
    if (h && maxX - minX >= 1) {
        let y = Math.floor(randomRange(minY, maxY) / 2) * 2

        await addHWall(minX, maxX, y, this_)
        await createRecursive(!h, minX, maxX, minY, y - 1, this_)
        await createRecursive(!h, minX, maxX, y + 1, maxY, this_)
    } else if (!h && maxY - minY >= 1) {
        let x = Math.floor(randomRange(minX, maxX) / 2) * 2

        await addVWall(minY, maxY, x, this_)
        await createRecursive(!h, minX, x - 1, minY, maxY, this_)
        await createRecursive(!h, x + 1, maxX, minY, maxY, this_)
    }

}

async function addHWall(minX, maxX, y, this_) {
    let hole = getHole(minX, maxX)
    for (let i = minX; i <= maxX; i++) {
        if (i !== hole) {
            await sleep(5)
            let target = this_.context.cells[y][i]
            if (!isDraggable(target)) {
                target.className = "cell wall"
            }

        }
    }
}

async function addVWall(minY, maxY, x, this_) {
    let hole = getHole(minY, maxY);
    for (let i = minY; i <= maxY; i++) {
        if (i !== hole) {
            await sleep(5)
            let target = this_.context.cells[i][x]
            if (!isDraggable(target)) {
                target.className = "cell wall"
            }
        }
    }
}

function getHole(min, max) {
    return Math.floor(randomRange(min, max) / 2) * 2 + 1
}

export {createRecursive}