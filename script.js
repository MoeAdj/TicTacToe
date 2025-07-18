const menu = document.getElementById('menu');
const symbolScreen = document.getElementById('symbol');
const gameScreen = document.getElementById('game');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const messageBox = document.getElementById('message');
const messageText = document.getElementById('messageText');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let isTwoPlayer = false;
let playerSymbol = 'X';
let computerSymbol = 'O';
let turn = 1; // 1 for player 1, 2 for player 2 or CPU
let currentBoard = Array(9).fill('');
let gameActive = false;
let playerScores = [0, 0];

// UI Navigation
document.getElementById('onePlayer').onclick = () => {
  isTwoPlayer = false;
  menu.classList.add('hidden');
  symbolScreen.classList.remove('hidden');
};
document.getElementById('twoPlayer').onclick = () => {
  isTwoPlayer = true;
  menu.classList.add('hidden');
  symbolScreen.classList.remove('hidden');
};
document.getElementById('chooseX').onclick = () => startGame('X');
document.getElementById('chooseO').onclick = () => startGame('O');
document.getElementById('reset').onclick = () => location.reload();

function startGame(symbol) {
  playerSymbol = symbol;
  computerSymbol = symbol === 'X' ? 'O' : 'X';
  symbolScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  initBoard();
  gameActive = true;

  // If computer goes first
  if (!isTwoPlayer && turn === 2) {
    setTimeout(cpuMove, 700);
  }
}

function initBoard() {
  board.innerHTML = '';
  currentBoard = Array(9).fill('');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.onclick = () => handleClick(i);
    board.appendChild(cell);
  }
  updateStatus();
}

function handleClick(index) {
  if (!gameActive || currentBoard[index] !== '') return;

  let symbol;
  if (turn === 1) {
    symbol = playerSymbol;
  } else {
    symbol = isTwoPlayer ? computerSymbol : computerSymbol; // Always allow CPU to play
  }

  currentBoard[index] = symbol;
  board.children[index].textContent = symbol;

  if (checkWin(symbol)) {
    endGame(`Player ${turn} wins!`);
    playerScores[turn - 1]++;
    updateScore();
    return;
  }

  if (!currentBoard.includes('')) {
    endGame("It's a draw.");
    return;
  }

  turn = turn === 1 ? 2 : 1;
  updateStatus();

  if (!isTwoPlayer && turn === 2) {
    setTimeout(cpuMove, 700);
  }
}

function cpuMove() {
  let emptyIndexes = currentBoard
    .map((val, idx) => val === '' ? idx : null)
    .filter(v => v !== null);

  const move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  handleClick(move);
}

function checkWin(sym) {
  const winCombinations = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombinations.some(combo => combo.every(i => currentBoard[i] === sym));
}

function endGame(message) {
  gameActive = false;
  messageText.textContent = message;
  messageBox.classList.remove('hidden');
}

function updateStatus() {
  statusText.textContent = isTwoPlayer
    ? `Player ${turn}'s turn`
    : turn === 1 ? 'Your Turn' : "Computer's Turn";
}

function updateScore() {
  score1.textContent = playerScores[0];
  score2.textContent = playerScores[1];
}
