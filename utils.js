export function isCell(target) {
    return target.classList.contains("cell")
}

export function isEmpty(target) {
    return target.classList.contains("empty") && !target.classList.contains("start_point") && !target.classList.contains("end_point")
}

export function isWall(target) {
    return target.classList.contains("wall") && !target.classList.contains("start_point") && !target.classList.contains("end_point")
}

export function isDraggable(target) {
    return target.classList.contains("draggable")
}

export function isStart(target) {
    return target.classList.contains("start_point")
}

export function isEnd(target) {
    return target.classList.contains("end_point")
}

export function isVisited(target) {
    return target.classList.contains("visited")
}

export function isInside(x, y, maxX, maxY) {
    return 0 <= x && x < maxX && 0 <= y && y < maxY
}

export function reset(func, bool, cells, rows, columns) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = cells[i][j]
            if (func(cell) === bool) {
                cell.className = "cell empty"
            }
        }
    }
}

export function resetBoard(cells, rows, columns) {
    reset(isDraggable, false, cells, rows, columns)

}

export function resetVisited(cells, rows, columns) {
    reset(isVisited, true, cells, rows, columns)
}

export function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomRange(min, max) {
    return Math.random() * (max - min + 1) + min
}

