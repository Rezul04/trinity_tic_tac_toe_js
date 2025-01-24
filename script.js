// Constants for game configuration
const WINNING_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Game state
const gameState = {
    isPlayerTurn: true, // Indicates whose turn it is
    isGameOver: false, // Tracks whether the game has ended
    isComputerMode: false, // Determines if the game is in computer mode
    blockedGrids: { // Tracks which grids are blocked
        grid1: false,
        grid2: false,
        grid3: false
    },
    playerNames: { // Stores player names
        player1: '',
        player2: 'Computer'
    },
    totalBlockedGrids: 0, // Counts the total number of blocked grids
    lastMoveBy: null, // Tracks who made the last move
    lastMove: null, // Tracks the last move
    lastMoves: { // Stores the last moves made by player and computer
        player: null,
        computer: null
    }
};

// DOM Elements
const elements = {
    cells: {
        grid1: document.querySelectorAll(".grid1-cell"), // Cells for grid 1
        grid2: document.querySelectorAll(".grid2-cell"), // Cells for grid 2
        grid3: document.querySelectorAll(".grid3-cell")  // Cells for grid 3
    },
    playerDisplay: document.querySelector(".current-player"), // Display for the current player
    tutorialButton: document.querySelector(".tutorial-btn"), // Button to open the tutorial
    tutorialSlides: document.querySelectorAll(".tutorial-slide"), // Slides in the tutorial
    overlay: document.querySelector(".overlay"), // Overlay for modals
    closeButtons: document.querySelectorAll(".close-tutorial"), // Buttons to close the tutorial
    newGameButton: document.querySelector(".new-game-btn"), // Button to start a new game
    winnerModal: document.querySelector(".winner-modal"), // Modal to show the winner
    winnerMessage: document.querySelector(".winner-message"), // Message displaying the winner
    nextSlideButtons: document.querySelectorAll(".next-slide"), // Buttons to navigate tutorial slides forward
    prevSlideButtons: document.querySelectorAll(".prev-slide"), // Buttons to navigate tutorial slides backward
    confirmWinButton: document.querySelector(".confirm-win"), // Button to confirm a win
    modeToggle: document.querySelector(".mode-toggle"), // Button to toggle game mode
    undoButton: document.querySelector(".undo-btn"), // Button to undo the last move
    modeSwitchModal: document.querySelector(".mode-switch-modal"), // Modal for mode switch confirmation
    resetGameModal: document.querySelector(".reset-game-modal"), // Modal for reset game confirmation
    confirmModeSwitch: document.querySelector(".confirm-mode-switch"), // Button to confirm mode switch
    cancelModeSwitch: document.querySelector(".cancel-mode-switch"), // Button to cancel mode switch
    confirmReset: document.querySelector(".confirm-reset"), // Button to confirm game reset
    cancelReset: document.querySelector(".cancel-reset"), // Button to cancel game reset
    moveSound: document.querySelector("#moveSound"), // Sound effect for moves
    winSound: document.querySelector("#winSound"),  // Sound effect for win
    namesModal: document.querySelector('.names-modal'), // Modal for player names at time t=0
    player1NameInput: document.querySelector('#player1-name'), // Input field for player 1 name
    player2NameInput: document.querySelector('#player2-name'), // Input field for player 2 name
    playerNameInput: document.querySelector('#player-name'), // Input field for player name in single player mode
    playVsPlayerBtn: document.querySelector('.play-vs-player'), // Button to play against a player at t=0
    playVsComputerBtn: document.querySelector('.play-vs-computer'), // Button to play against the computer at t=0
    startGameBtn: document.querySelector('.start-game-btn'), // Button to start the game at t=0
    twoPlayerInputs: document.querySelector('.two-player-inputs'), // Input fields for player names in two player mode
    singlePlayerInputs: document.querySelector('.single-player-inputs') // Input fields for player name in single player mode
};

function initializeNameInputs() {
    // Show names modal and overlay on page load
    elements.namesModal.classList.remove('hidden');
    elements.overlay.classList.remove('hidden');

    // Mode selection handling
    elements.playVsPlayerBtn.addEventListener('click', () => {
        gameState.isComputerMode = false;
        elements.playVsPlayerBtn.classList.add('active');
        elements.playVsComputerBtn.classList.remove('active');
        elements.twoPlayerInputs.classList.remove('hidden');
        elements.singlePlayerInputs.classList.add('hidden');
        validateInputs();
    });

    elements.playVsComputerBtn.addEventListener('click', () => {
        gameState.isComputerMode = true;
        elements.playVsComputerBtn.classList.add('active');
        elements.playVsPlayerBtn.classList.remove('active');
        elements.singlePlayerInputs.classList.remove('hidden');
        elements.twoPlayerInputs.classList.add('hidden');
        validateInputs();
    });

    // Input validation
    function validateInputs() {
        if (gameState.isComputerMode) {
            elements.startGameBtn.disabled = !elements.playerNameInput.value.trim();
        } else {
            elements.startGameBtn.disabled = 
                !elements.player1NameInput.value.trim() || 
                !elements.player2NameInput.value.trim();
        }
    }

    // Add input listeners
    elements.player1NameInput.addEventListener('input', validateInputs);
    elements.player2NameInput.addEventListener('input', validateInputs);
    elements.playerNameInput.addEventListener('input', validateInputs);

    // Start game button handling
    elements.startGameBtn.addEventListener('click', () => {
        if (gameState.isComputerMode) {
            gameState.playerNames.player1 = elements.playerNameInput.value.trim();
            gameState.playerNames.player2 = 'Computer';
        } else {
            gameState.playerNames.player1 = elements.player1NameInput.value.trim();
            gameState.playerNames.player2 = elements.player2NameInput.value.trim();
        }
        
        elements.namesModal.classList.add('hidden');
        elements.overlay.classList.add('hidden');
        elements.modeToggle.textContent = gameState.isComputerMode ? 
            "Play vs Player" : "Play vs Computer";
        gameState.isPlayerTurn = !gameState.isPlayerTurn; // Toggle the turn
        updateTurn();
    });
}

// Checks if a winning pattern exists in the grid cells
function checkWinningPattern(cells) {
    return WINNING_PATTERNS.some(pattern => { // Iterate over all winning patterns
        const [a, b, c] = pattern; // Get the indices of the cells in the pattern
        return cells[a].innerText && 
               cells[a].innerText === cells[b].innerText && 
               cells[b].innerText === cells[c].innerText;
    });
}

// Handles a win for a specific grid
function handleGridWin(gridCells, gridKey) {
    if (gameState.blockedGrids[gridKey]) return; // Do nothing if the grid is already blocked

    gameState.blockedGrids[gridKey] = true; // Mark the grid as blocked
    gameState.totalBlockedGrids++; // Increment the blocked grids counter

    gridCells.forEach(cell => cell.classList.add("blocked-cell")); // Add visual cue for blocked grid

    // Check if all grids are blocked
    if (gameState.totalBlockedGrids === 3) {
        gameState.isPlayerTurn = !gameState.isPlayerTurn; // Toggle turn for final state
        showWinner(); // Display the winner
    }
}

// Makes a move on the specified cell
function makeMove(cell, gridCells, gridKey) {
    if (gameState.blockedGrids[gridKey] || gameState.isGameOver || cell.innerText) return; // Prevent invalid moves

    // Play move sound
    if (elements.moveSound) {
        elements.moveSound.currentTime = 0; // Reset sound to start
        elements.moveSound.play().catch(error => console.log('Audio play failed:', error)); // Play sound effect and handle potential errors
    }

    cell.innerText = 'X'; // Mark the cell with player's symbol
    cell.disabled = true; // Disable further interaction with the cell

    // Store moves for undo functionality
    if (gameState.isComputerMode) { // Only store moves if computer mode is enabled
        const moveInfo = { // Create a move object with cell index and grid key
            cell, // The cell that was clicked
            gridCells,
            gridKey, 
            wasBlocked: false // Flag to indicate if the cell was blocked
        };

        if (gameState.isPlayerTurn) { // Store move if it's the player's turn
            gameState.lastMoves.player = moveInfo; // Store player move
            elements.undoButton.classList.remove('hidden'); // Show undo button
        } else {
            gameState.lastMoves.computer = moveInfo; // Store computer move
        }
    }

    gameState.lastMoveBy = gameState.isPlayerTurn ? 
        (gameState.isComputerMode ? 'player' : 'player1') : 
        (gameState.isComputerMode ? 'computer' : 'player2'); // Determine who made the move

    // Check if this move caused a win
    if (checkWinningPattern(gridCells)) {
        handleGridWin(gridCells, gridKey); // Handle win/blocking for the current grid
        // Store if this move caused a grid block
        if (gameState.isPlayerTurn) {
            gameState.lastMoves.player.wasBlocked = true;
        } else {
            gameState.lastMoves.computer.wasBlocked = true;
        }
    }

    if (!gameState.isGameOver) {
        updateTurn(); // Update the turn
    }
}

// Updates the turn and displays the current player
function updateTurn() {
    gameState.isPlayerTurn = !gameState.isPlayerTurn; // Toggle the turn
    elements.playerDisplay.textContent = gameState.isComputerMode ? 
        (gameState.isPlayerTurn ? "Your Turn" : "Computer's Turn") :
        `${gameState.isPlayerTurn ? `${gameState.playerNames.player1}'s Turn` : `${gameState.playerNames.player2}'s Turn`}`; // Display appropriate message

    if (gameState.isComputerMode && !gameState.isPlayerTurn) {
        setTimeout(computerMove, 700); // Delay computer move
    }
}

// Finds an available move for the computer
function getAvailableMove() {
    const availableGrids = Object.entries(gameState.blockedGrids)
        .filter(([_, blocked]) => !blocked) // Filter out blocked grids
        .map(([key]) => key); // Extract grid keys

    if (availableGrids.length === 0) return null; // No available grids

    const randomGrid = availableGrids[Math.floor(Math.random() * availableGrids.length)]; // Randomly pick a grid
    const availableCells = Array.from(elements.cells[randomGrid])
        .filter(cell => !cell.innerText); // Find empty cells

    if (availableCells.length === 0) return getAvailableMove(); // Retry if no cells are available

    return {
        cell: availableCells[Math.floor(Math.random() * availableCells.length)], // Pick a random cell
        gridCells: elements.cells[randomGrid], 
        gridKey: randomGrid // Grid key represents the grid
    };
}

// Executes the computer's move
function computerMove() {
    if (gameState.isGameOver) return; // Do nothing if the game is over

    const move = getAvailableMove(); // Get the computer's move
    if (move) {
        makeMove(move.cell, move.gridCells, move.gridKey); // Make the move
    }
}

// Undoes the last moves made by the player and computer
function undoMove() {
    if (!gameState.isComputerMode || !gameState.lastMoves.player) return; // Ensure undo is valid

    // Undo computer's move first if it exists
    if (gameState.lastMoves.computer) {
        const computerMove = gameState.lastMoves.computer;
        undoSingleMove(computerMove); // Undo the computer's move
        gameState.lastMoves.computer = null; // Clear stored move
    }

    // Then undo player's move
    const playerMove = gameState.lastMoves.player;
    undoSingleMove(playerMove); // Undo the player's move
    gameState.lastMoves.player = null; // Clear stored move

    // Reset game state
    gameState.isPlayerTurn = true; // Make it player's turn
    elements.undoButton.classList.add('hidden'); // Hide undo button
    elements.playerDisplay.textContent = "Your Turn"; // Update display
}

// Helper function to undo a single move
function undoSingleMove(moveInfo) {
    if (!moveInfo) return;

    const { cell, gridCells, gridKey, wasBlocked } = moveInfo;

    // Reset the cell
    cell.innerText = '';
    cell.disabled = false;

    // Reset grid if it was blocked by this move
    if (wasBlocked && gameState.blockedGrids[gridKey]) {
        gameState.blockedGrids[gridKey] = false; // Unblock the grid
        gameState.totalBlockedGrids--; // Decrement blocked grids counter
        gridCells.forEach(cell => cell.classList.remove("blocked-cell")); // Remove blocked visual cue
    }
}

// Displays the winner and ends the game
function showWinner() {
    gameState.isGameOver = true; // Set game over state

    // Play winning sound
    if (elements.winSound) {
        elements.winSound.currentTime = 0;
        elements.winSound.play().catch(error => console.log('Win sound play failed:', error));
    }

    let winnerText; // Declare winner text
    if (gameState.isComputerMode) {
        winnerText = gameState.lastMoveBy === 'player' ? 
            "Computer Wins!" : 
            "You Win!"; // Determine winner based on last move
    } else {
        winnerText = gameState.lastMoveBy === 'player1' ? 
            `${gameState.playerNames.player2} Won`: 
            `${gameState.playerNames.player1} Won`; // Determine winner for multiplayer
    }

    elements.winnerMessage.textContent = winnerText; // Update modal text
    elements.winnerModal.classList.remove("hidden"); // Show winner modal
    elements.overlay.classList.remove("hidden"); // Show overlay
}


// Resets the game to its initial state
function resetGame() {
    // Set the player's turn to true, indicating the game starts with the player
    gameState.isPlayerTurn = true;

    // Reset the game-over flag to false as the game is being restarted
    gameState.isGameOver = false;

    // Reset the count of total blocked grids to zero
    gameState.totalBlockedGrids = 0;

    // Clear the last move tracking variables
    gameState.lastMoveBy = null;

    // Reset the last moves made by both the player and the computer
    gameState.lastMoves = {
        player: null,
        computer: null
    };

    // Unblock all grids by setting their blocked state to false
    Object.keys(gameState.blockedGrids).forEach(key => {
        gameState.blockedGrids[key] = false;
    });

    // Clear all cells in each grid by removing text, enabling interactions, and removing visual cues
    Object.values(elements.cells).forEach(gridCells => {
        gridCells.forEach(cell => {
            cell.innerText = ""; // Clear the cell content
            cell.disabled = false; // Enable cell interaction
            cell.classList.remove("blocked-cell"); // Remove blocked visual indication
        });
    });

    // Hide the undo button if it's currently visible
    if (elements.undoButton) {
        elements.undoButton.classList.add('hidden');
    }

    // Reset the player display to show the correct initial message based on the mode
    elements.playerDisplay.textContent = gameState.isComputerMode ? `Your Turn` : `${gameState.playerNames.player1}'s Turn`;

    // Hide the winner modal
    elements.winnerModal.classList.add("hidden");

    // Hide the overlay to return to the game screen
    elements.overlay.classList.add("hidden");
}

// Displays a confirmation modal before resetting the game
function showResetConfirmation() {
    // Check if the reset game modal element exists
    if (elements.resetGameModal) {
        // Show the reset confirmation modal
        elements.resetGameModal.classList.remove('hidden');

        // Display the overlay for focus on the modal
        elements.overlay.classList.remove('hidden');
    }
}

// Displays a confirmation modal for switching game modes
function showModeSwitchModal() {
    // Check if the mode switch modal element exists
    if (elements.modeSwitchModal) {
        // Show the mode switch confirmation modal
        elements.modeSwitchModal.classList.remove('hidden');

        // Display the overlay for focus on the modal
        elements.overlay.classList.remove('hidden');
    }
}

// Sets up event listeners for all interactive elements
function initializeEventListeners() {
    // Add click event listeners to each cell in all grids
    Object.entries(elements.cells).forEach(([gridKey, cells]) => {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                // Prevent action if it's the computer's turn in computer mode
                if (gameState.isComputerMode && !gameState.isPlayerTurn) return;

                // Make a move when the cell is clicked
                makeMove(cell, cells, gridKey);
            });
        });
    });

    // Open the tutorial when the tutorial button is clicked
    elements.tutorialButton.addEventListener('click', () => {
        elements.tutorialSlides[0].classList.remove("hidden");
        elements.overlay.classList.remove("hidden");
    });

    // Close the tutorial when any close button is clicked
    elements.closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            elements.tutorialSlides.forEach(slide => slide.classList.add("hidden"));
            if (!gameState.isGameOver) {
                elements.overlay.classList.add("hidden");
            }
        });
    });

    // Show the reset confirmation modal when the new game button is clicked
    elements.newGameButton.addEventListener('click', showResetConfirmation);

    // Reset the game when the confirm win button is clicked
    elements.confirmWinButton.addEventListener('click', resetGame);

    // Show the mode switch confirmation modal when the mode toggle button is clicked
    elements.modeToggle.addEventListener('click', showModeSwitchModal);

    // Undo the last move when the undo button is clicked
    if (elements.undoButton) {
        elements.undoButton.addEventListener('click', undoMove);
    }

    // Confirm the mode switch and apply the changes
    if (elements.confirmModeSwitch) {
        elements.confirmModeSwitch.addEventListener('click', () => {
            gameState.isComputerMode = !gameState.isComputerMode; // Toggle the mode
            elements.modeToggle.textContent = gameState.isComputerMode ? "Play vs Player" : "Play vs Computer";
            elements.modeSwitchModal.classList.add('hidden');
            elements.overlay.classList.add('hidden');
            resetGame(); // Reset the game for the new mode
        });
    }

    // Cancel the mode switch and hide the modal
    if (elements.cancelModeSwitch) {
        elements.cancelModeSwitch.addEventListener('click', () => {
            elements.modeSwitchModal.classList.add('hidden');
            elements.overlay.classList.add('hidden');
        });
    }

    // Confirm the reset and restart the game
    if (elements.confirmReset) {
        elements.confirmReset.addEventListener('click', () => {
            elements.resetGameModal.classList.add('hidden');
            elements.overlay.classList.add('hidden');
            resetGame();
        });
    }

    // Cancel the reset and hide the modal
    if (elements.cancelReset) {
        elements.cancelReset.addEventListener('click', () => {
            elements.resetGameModal.classList.add('hidden');
            elements.overlay.classList.add('hidden');
        });
    }

    // Hide modals and overlay when the overlay is clicked
    elements.overlay.addEventListener('click', () => {
        elements.tutorialSlides.forEach(slide => slide.classList.add("hidden"));
        if (elements.modeSwitchModal) elements.modeSwitchModal.classList.add('hidden');
        if (elements.resetGameModal) elements.resetGameModal.classList.add('hidden');
        if (!gameState.isGameOver) {
            elements.overlay.classList.add("hidden");
        }
    });

    // Close all modals with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.tutorialSlides.forEach(slide => slide.classList.add("hidden"));
            if (elements.modeSwitchModal) elements.modeSwitchModal.classList.add('hidden');
            if (elements.resetGameModal) elements.resetGameModal.classList.add('hidden');
            if (!gameState.isGameOver) {
                elements.overlay.classList.add("hidden");
            }
        }
    });
}

// Initialize game
initializeEventListeners();
initializeNameInputs();

// error handling for sound effects
elements.moveSound.addEventListener('error', (e) => {
    console.error('Error loading move sound:', e);
});

elements.winSound.addEventListener('error', (e) => {
    console.error('Error loading win sound:', e);
});
