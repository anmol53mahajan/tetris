
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const startBtn = document.getElementById('start-button');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreSpan = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

const width = 10;
let squares = [];
let timerId = null;
let score = 0;
let isGameActive = false;
let speed = 1000;

const colors = [
    "#0ad2ff", "#2962ff", "#9500ff", "#ff0059", "#ff8c00", "#b4e600", "#0fffdb"
];

// making the main grid
function createGrid() {
    grid.innerHTML = '';
    squares = [];
    // 200 squares in grid 
    for (let i = 0; i < 200; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }
    // 10 Floor Squares to detect the bottom
    for (let i = 0; i < 10; i++) {
        const square = document.createElement('div');
        square.classList.add('taken');
        square.style.height = '0'; // Invisible floor
        grid.appendChild(square);
        squares.push(square);
    }
    //all are added to main squares array
}
createGrid();

// High Score from local storage
let highScore = localStorage.getItem('tetrisHighScore') || 0;
highScoreDisplay.textContent = highScore;

//making the tetrominoes arrays

// L-tetromino
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];
// Z-Tetromino
const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];
// T-Tetromino
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];
// O-Tetromino
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];
// I-Tetromino
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];
const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

// to store the state 
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

// next block setup
const miniGrid = document.querySelector('.mini-grid');
const miniWidth = 5;
let displaySquares = [];
let nextRandom = 0;

// Create Mini Grid (5x5 = 25 divs)
for (let i = 0; i < 25; i++) {
    const square = document.createElement('div');
    miniGrid.appendChild(square);
    displaySquares.push(square);
}


const upNextTetrominoes5x5 = [
    [2, 7, 12, 13],   // 0: L-Tetromino
    [6, 7, 12, 13],   // 1: Z-Tetromino
    [7, 11, 12, 13],  // 2: T-Tetromino
    [6, 7, 11, 12],   // 3: O-Tetromino
    [2, 7, 12, 17]    // 4: I-Tetromino
];

// Function to display the shape in the mini-grid
function displayShape() {
    // Clear grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
        square.style.boxShadow = '';
    });

    // Draw next shape
    upNextTetrominoes5x5[nextRandom].forEach(index => {
        if (displaySquares[index]) { // Safety check
            displaySquares[index].classList.add('tetromino');
            displaySquares[index].style.backgroundColor = colors[nextRandom];
            displaySquares[index].style.boxShadow = `0 0 5px ${colors[nextRandom]}`;
        }
    });
}

// main game logic
function draw() {

    current.forEach(index => {
        if (squares[currentPosition + index]) {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
            squares[currentPosition + index].style.boxShadow = `0 0 10px ${colors[random]}`;
        }
    });
}

function undraw() {
    current.forEach(index => {
        if (squares[currentPosition + index]) {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
            squares[currentPosition + index].style.boxShadow = '';
        }
    });
}
//moving the tetrominoes down
function moveDown() {
    if (!isGameActive) return;
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function checktaken(idx) {
    return squares[currentPosition + idx + width].classList.contains('taken')
}

function checktakenattop(idx) {
    return squares[currentPosition + idx].classList.contains('taken')
}

function freeze() {
    if (current.some(checktaken)) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));

        // starting  new piece
        random = nextRandom; // Using the one in next block 
        nextRandom = Math.floor(Math.random() * theTetrominoes.length); // Picking new block 
        current = theTetrominoes[random][0];
        currentPosition = 4;
        currentRotation = 0;

        displayShape(); // Update mini-grid
        addScore();

        // Game Over Check
        if (current.some(checktakenattop)) {
            scoreDisplay.textContent = 'END';
            clearInterval(timerId);
            isGameActive = false;
            timerId = null;
            gameOverModal.style.display = 'flex';
            finalScoreSpan.textContent = score;
            // High Score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('tetrisHighScore', highScore);
                highScoreDisplay.textContent = highScore;
            }
        } else {
            draw();
        }
    }
}

// Controls
function moveLeft() {
    if (!isGameActive || !timerId) return;
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

function moveRight() {
    if (!isGameActive || !timerId) return;
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

function hardDrop() {
    if (!isGameActive || !timerId) return;
    undraw();
    while (!current.some(checktaken)) {
        currentPosition += width;
    }
    draw();
    freeze();
}

//rotate function

function rotate() {
    if (!isGameActive || !timerId) return;
    undraw();

    const nextRotation = (currentRotation + 1) % current.length;
    const nextLayout = theTetrominoes[random][nextRotation];

    // main wall kick logic

    function isValidPosition(pos, layout) {
        //  Check if any cell is taken
        if (layout.some(index => squares[pos + index] && squares[pos + index].classList.contains('taken'))) {
            return false;
        }

        // collect all column indices
        const cols = layout.map(index => (pos + index) % width);

        //wrap check
        const hasLeftEdge = cols.some(c => c < 3); // 0 or 1 or 2
        const hasRightEdge = cols.some(c => c > 6); // 7 or 8 or 9

        if (hasLeftEdge && hasRightEdge) return false;

        return true;
    }

    // Try Original Position
    if (isValidPosition(currentPosition, nextLayout)) {
        currentRotation = nextRotation;
        current = nextLayout;
    }
    // Kick 1 Left
    else if (isValidPosition(currentPosition - 1, nextLayout)) {
        currentPosition -= 1;
        currentRotation = nextRotation;
        current = nextLayout;
    }
    // Kick 1 Right
    else if (isValidPosition(currentPosition + 1, nextLayout)) {
        currentPosition += 1;
        currentRotation = nextRotation;
        current = nextLayout;
    }
    // Kick 2 Left as a glitch was there for I tetrimino at right wall
    else if (isValidPosition(currentPosition - 2, nextLayout)) {
        currentPosition -= 2;
        currentRotation = nextRotation;
        current = nextLayout;
    }
    // same for left wall
    else if (isValidPosition(currentPosition + 2, nextLayout)) {
        currentPosition += 2;
        currentRotation = nextRotation;
        current = nextLayout;
    }

    draw();
}

document.addEventListener('keydown', control);
function control(e) {
    if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }

    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
    else if (e.keyCode === 32) hardDrop();
}

function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.textContent = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
                squares[index].style.boxShadow = '';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

//main event listeners
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = "Resume";

    } else {
        // first start or Resume
        startBtn.textContent = "Pause";
        if (!isGameActive && score === 0) {
            // first initial load
            if (squares.length === 0) createGrid(); // ensure grid exists

            // initial Seeds
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][0];

            isGameActive = true;
            draw();
        }
        timerId = setInterval(moveDown, speed);
    }
});

restartBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = 0;
    createGrid();
    isGameActive = true;

    // reset Logic
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][0];
    currentPosition = 4;
    currentRotation = 0;

    // restart Timer
    if (timerId) clearInterval(timerId);
    timerId = setInterval(moveDown, speed);
    startBtn.textContent = "Pause";
    draw();
});
