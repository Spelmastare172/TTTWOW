const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const winScreen = document.getElementById('winScreen');
const winMessage = document.getElementById('winMessage');
const newGameButton = document.getElementById('newGameButton');
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let oTurn;
let selectedCell = null;
let xPlacedCount = 0;
let oPlacedCount = 0;
const maxMarks = 3;

startGame();

restartButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', () => {
    winScreen.style.display = 'none';
    startGame();
});

function startGame() {
    oTurn = false;
    selectedCell = null;
    xPlacedCount = 0;
    oPlacedCount = 0;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('selected');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });
    setBoardHoverClass();
    messageElement.innerText = '';
    document.getElementById('gameContainer').style.display = 'block';
    winScreen.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    const placedCount = oTurn ? oPlacedCount : xPlacedCount;

    if (selectedCell) {
        // Moving a piece
        if (cell === selectedCell) {
            // Deselect the cell if clicked twice
            selectedCell.classList.remove('selected');
            selectedCell = null;
        } else if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            // Move piece to the new cell
            cell.classList.add(currentClass);
            selectedCell.classList.remove(currentClass);
            selectedCell.classList.remove('selected');
            selectedCell = null;
            if (checkWin(currentClass)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
                setBoardHoverClass();
            }
        }
    } else if (placedCount < maxMarks && !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
        // Placing a new piece
        placeMark(cell, currentClass);
        if (oTurn) {
            oPlacedCount++;
        } else {
            xPlacedCount++;
        }
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else if (xPlacedCount >= maxMarks && oPlacedCount >= maxMarks) {
            // Allow moving pieces after placing maxMarks pieces
            swapTurns();
            setBoardHoverClass();
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    } else if (cell.classList.contains(currentClass)) {
        // Select a piece to move
        cell.classList.add('selected');
        selectedCell = cell;
    }
}

function endGame(draw) {
    if (draw) {
        messageElement.innerText = 'Draw!';
        winMessage.innerText = 'Draw!';
    } else {
        messageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
        winMessage.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    }
    winScreen.style.display = 'flex';
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}
