// JSCODE

const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = "player"; // Default mode

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    document.getElementById("statusMessage").innerText = `Player ${currentPlayer}'s Turn`;
    restartGame();
}

function handleClick(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].innerText = currentPlayer;
    document.getElementsByClassName("cell")[index].classList.add("taken");

    if (checkWin()) {
        document.getElementById("statusMessage").innerText = `🎉 Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("statusMessage").innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("statusMessage").innerText = `Player ${currentPlayer}'s Turn`;

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function checkWin() {
    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function aiMove() {
    let bestMove = minimax(board, "O").index;
    board[bestMove] = "O";
    document.getElementsByClassName("cell")[bestMove].innerText = "O";
    document.getElementsByClassName("cell")[bestMove].classList.add("taken");

    if (checkWin()) {
        document.getElementById("statusMessage").innerText = `🎉 AI Wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("statusMessage").innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    document.getElementById("statusMessage").innerText = `Player X's Turn`;
}

function restartGame() {
    board.fill("");
    document.querySelectorAll(".cell").forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("taken");
    });
    currentPlayer = "X";
    gameActive = true;
    document.getElementById("statusMessage").innerText = `Player X's Turn`;
}

// Minimax Algorithm (AI - Hard Mode)
function minimax(newBoard, player) {
    let emptyCells = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWinAI(newBoard, "X")) return { score: -10 };
    if (checkWinAI(newBoard, "O")) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        let move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = player;

        let result;
        if (player === "O") {
            result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

function checkWinAI(board, player) {
    return winningCombos.some(combo => combo.every(index => board[index] === player));
}
