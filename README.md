# Neon Tetris - DOM-Based Web Application

## 📌 Project Overview
Neon Tetris is a fully functional, browser-based recreation of the classic arcade game, built entirely from scratch using **HTML, CSS, and Vanilla JavaScript**. 

Unlike typical game developments that rely on the HTML5 `<canvas>`, this project strictly enforces **DOM Manipulation** concepts. Every single block on the grid is a distinct `<div>` element, and the game logic operates by manipulating these DOM nodes in real-time. This approach demonstrates a deep understanding of the Document Object Model, event handling, and efficient state management.

## 📝 Problem Statement
The challenge was to engineer a complex, interactive application without using external frameworks (React, Vue) or game-specific drawing APIs. The goal was to prove that complex game states and animations can be managed purely through:
1.  Dynamic DOM generation.
2.  Smart CSS class toggling.
3.  Efficient Array-to-DOM mapping.

## ✨ Features Implemented
*   **Dynamic Grid Generation**: The 200-cell game board is generated via JavaScript loops, not hardcoded HTML.
*   **Classic Gameplay mechanics**: Gravity, collision detection, and line clearing.
*   **Smart Rotation System**: Implements **"Wall Kicks"**, allowing pieces to rotate even when against a wall (they automatically nudge over).
*   **Next Block Preview**: A mini-grid showing the upcoming tetromino.
*   **High Score System**: Persist your best score using the browser's `localStorage`.
*   **Neon UI Theme**: Custom CSS styling with glow effects (`box-shadow`) and smooth transitions.
*   **Game States**: Start, Pause, and Game Over logic.

## 🧠 Deep Dive: Algorithms & Logic Used

### 1. The Game Loop (`setInterval`)
The heart of the game is a time-based Interval.
```javascript
timerId = setInterval(moveDown, speed);
```
This function triggers the `moveDown()` logic every 1000ms. I implemented a Pause/Resume feature by clearing this interval (`clearInterval`) and re-assigning it based on the game state variable `isGameActive`.

### 2. Line Clearing (`splice` method)
One of the most interesting challenges was clearing lines.
*   **Detection**: I check every row (sets of 10) to see if every div has the class `.taken`.
*   **Removal**: Instead of complex DOM re-ordering, I used the Array `splice()` method.
    *   `squares.splice(i, width)` removes the full row from the array.
    *   This removed row is then stripped of its classes (color, taken).
    *   `squares.concat(...)` adds these fresh cells back to the **start** of the array.
    *   Finally, the DOM is re-appended to match the new Array state, causing the blocks to visually "fall."

### 3. Collision & "Freezing"
I used a look-ahead logic. Before a piece moves down, I check:
*   `index + width`: Is the cell directly below me taken?
*   If yes, the piece calls `freeze()`. This converts the moving `tetromino` class into a static `taken` class, locking it in place.

### 4. Wall Kicks (Rotation Logic)
Standard rotation often fails near edges because the new shape index hits a wall/limit. I implemented a robust check:
*   If `currentPosition` is invalid after rotation, try `currentPosition - 1` (Kick Left).
*   If still invalid, try `currentPosition + 1` (Kick Right).
*   For the long I-Block, I even added a +/- 2 kick.
This ensures the game feels responsive and doesn't "glitch" out near edges.

### 5. Persistent Data (`localStorage`)
To keep the players engaged, the high score is saved locally.
```javascript
localStorage.setItem('tetrisHighScore', highScore);
```
On load, the game checks `localStorage.getItem` to populate the UI, proving client-side data persistence.

## 🛠️ DOM Concepts Used
This project heavily utilizes the following API methods:
*   **Selection**: `document.querySelector`, `document.getElementById`, `document.querySelectorAll`.
*   **Creation**: `document.createElement('div')` to build the grid.
*   **Modification**: `element.appendChild()` to assemble the board.
*   **Styling**: `element.classList.add/remove` for state changes (e.g., active piece, frozen piece).
*   **Attributes**: `element.style.backgroundColor` for dynamic coloring.
*   **Events**: `addEventListener('keydown')` used for Arrow Key controls and `click` for buttons.


6.  **Controls**:
    *   **Arrow Left/Right**: Move
    *   **Arrow Up**: Rotate
    *   **Arrow Down**: Soft Drop
    *   **Spacebar**: Hard Drop

## ⚠️ Known Limitations
*   **Mobile Support**: The game currently relies on keyboard arrow keys, so it is not optimized for touch screens/mobile devices.
*   **Refresh Rate**: The game loop is tied to the main thread; extremely heavy browser usage *could* theoretically cause minor stutters (though unlikely with DOM this optimized).

---
*Submitted by [Your Name/Roll Number] for Web Dev II Final Project.*
