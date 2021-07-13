import {Context} from "./states/context.js"

const COLUMNS = 50
const ROWS = 20
const cells = []
let contextState


function initializeStartingPoints() {
    let start = cells[cells.length / 2][Math.round(cells[0].length * 1 / 3)]
    start.className = "cell start_point draggable"

    let end = cells[cells.length / 2][Math.round(cells[0].length * 2 / 3)]
    end.className = "cell end_point draggable"

}

function initializeBoard() {
    let board = document.getElementById("board")
    for (let i = 0; i < ROWS; i++) {
        let row = board.insertRow()
        let rows = []
        for (let j = 0; j < COLUMNS; j++) {
            let cell = row.insertCell()
            cell.classList.add("cell")
            cell.classList.add("empty")
            rows.push(cell)
        }
        cells.push(rows)
    }
    initializeStartingPoints();

}


window.onload = function () {
    initializeBoard()
    contextState = new Context(cells)
    contextState.start()

}
