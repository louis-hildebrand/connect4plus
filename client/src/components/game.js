// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------
const data = {
  gameOverWin: false,
  gameOverTie: false,
  currentPlayer: 1,
  placingPiece: false,
  playingBoard: Array(16).fill(null),
  playingBoardHighlight: [],
  availablePieces: [
    {color: "dark",  shape: "square", mark: "o", border: "thick"},
    {color: "dark",  shape: "square", mark: "o", border: "thin"},
    {color: "dark",  shape: "circle", mark: "o", border: "thin"},
    {color: "dark",  shape: "circle", mark: "o", border: "thick"},
    {color: "dark",  shape: "square", mark: "x", border: "thick"},
    {color: "dark",  shape: "square", mark: "x", border: "thin"},
    {color: "dark",  shape: "circle", mark: "x", border: "thin"},
    {color: "dark",  shape: "circle", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "x", border: "thin"},
    {color: "light", shape: "circle", mark: "x", border: "thin"},
    {color: "light", shape: "circle", mark: "x", border: "thick"},
    {color: "light", shape: "square", mark: "o", border: "thick"},
    {color: "light", shape: "square", mark: "o", border: "thin"},
    {color: "light", shape: "circle", mark: "o", border: "thin"},
    {color: "light", shape: "circle", mark: "o", border: "thick"}
  ],
  availablePiecesHighlight: [],
  selectedPiece: null
};

// -----------------------------------------------------------------------------
// Computed properties
// -----------------------------------------------------------------------------
function gameOver() {
  return this.gameOverWin || this.gameOverTie;
}

function message() {
  const myNumber = this.myNumber * 1;
  if (this.gameOverWin && myNumber === this.currentPlayer) {
    return "Game over. You win!";
  }
  else if (this.gameOverWin && myNumber !== this.currentPlayer) {
    return "Game over. You lose.";
  }
  else if (this.gameOverTie) {
    return "Game over. Tie.";
  }
  if (myNumber === this.currentPlayer && this.placingPiece) {
    return "Choose where to place the piece";
  }
  else if (myNumber === this.currentPlayer && !this.placingPiece) {
    return "Choose a piece for your opponent";
  }
  else if (myNumber !== this.currentPlayer && this.placingPiece) {
    return "Your opponent is choosing where to place the piece";
  }
  else if (myNumber !== this.currentPlayer && !this.placingPiece) {
    return "Your opponent is choosing a piece for you";
  }
  else {
    return "Invalid state. Please refresh the page.";
  }
}

// -----------------------------------------------------------------------------
// Private methods
// -----------------------------------------------------------------------------
function isTie(playingBoard) {
  return playingBoard.every((x) => x);
}

function tryGetWinningIndices(playingBoard) {
  const winConfigurations = [
    // Horizontal
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    // Vertical
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    // Diagonal
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];

  for (const indices of winConfigurations) {
    const pieces = indices.map((i) => playingBoard[i]);
    if (haveCommonCharacteristics(pieces)) {
      return indices;
    }
  }

  return false;
}

function haveCommonCharacteristics(pieces) {
  if (pieces.some((x) => !x)) {
    return false;
  }

  const common = {
    color: pieces[0].color,
    shape: pieces[0].shape,
    mark: pieces[0].mark,
    border: pieces[0].border
  };
  for (var i = 1; i < pieces.length; i++) {
    if (pieces[i].color !== common.color) common.color = false;
    if (pieces[i].shape !== common.shape) common.shape = false;
    if (pieces[i].mark !== common.mark) common.mark = false;
    if (pieces[i].border !== common.border) common.border = false;
  }

  return common.color || common.shape || common.mark || common.border;
}

// -----------------------------------------------------------------------------
// Public methods
// -----------------------------------------------------------------------------
function advanceGameState() {
  const winningIndices = tryGetWinningIndices(this.playingBoard);
  if (winningIndices) {
    this.playingBoardHighlight = winningIndices;
    this.gameOverWin = true;
    return;
  }
  else if (isTie(this.playingBoard)) {
    this.gameOverTie = true;
    return;
  }

  this.currentPlayer = this.placingPiece
    ? this.currentPlayer
    : (this.currentPlayer % 2) + 1;

  this.placingPiece = !this.placingPiece;
}

function cellBackgroundStyle(isPlayingBoard, index) {
  const boardHighlight = isPlayingBoard ? this.playingBoardHighlight : this.availablePiecesHighlight;
  const highlightThis = boardHighlight.some(x => x === index);
  const color = highlightThis ? "var(--selected-cell-highlight-color, white)" : "white";
  return `background-color: ${color};`;
}

function choosePiece(index) {
  if (this.gameOver) return;
  if (this.myNumber * 1 !== this.currentPlayer) return;
  if (this.placingPiece) return;
  if (!this.availablePieces[index]) return;
  if (!this.availablePiecesHighlight.some(x => x === index)) {
    this.availablePiecesHighlight = [index];
    return;
  }

  this.availablePiecesHighlight = [];

  this.$root.socket.emit("choose-piece", {gameCode: this.gameCode, piece: index});

  this.handlePieceChosen(index);
}

function handlePieceChosen(index) {
  this.selectedPiece = this.availablePieces[index];
  this.availablePieces[index] = null;

  this.advanceGameState();
}

function handlePiecePlaced(index) {
  this.playingBoard[index] = this.selectedPiece;
  this.selectedPiece = null;

  this.advanceGameState();
}

function image(piece) {
  const name = piece.color + "-" + piece.shape + "-" + piece.mark + "-" + piece.border + ".png";
  return require("@/assets/pieces/" + name);
}

function placePiece(index) {
  if (this.gameOver) return;
  if (this.myNumber * 1 !== this.currentPlayer) return;
  if (!this.placingPiece) return;
  if (this.playingBoard[index]) return;
  if (!this.playingBoardHighlight.some(x => x === index)) {
    this.playingBoardHighlight = [index];
    return;
  }

  this.playingBoardHighlight = [];

  this.$root.socket.emit("place-piece", {gameCode: this.gameCode, piece: index});

  this.handlePiecePlaced(index);
}

function playerNameStyle(player) {
  if (player === this.currentPlayer) {
    return "background-color: #63a7a7;";
  }
  else {
    return "";
  }
}

function registerSocketListeners() {
  this.$root.socket.on("piece-chosen", this.handlePieceChosen);
  this.$root.socket.on("piece-placed", this.handlePiecePlaced);
}

function removeSocketListeners() {
  this.$root.socket.off("piece-chosen", this.handlePieceChosen);
  this.$root.socket.off("piece-placed", this.handlePiecePlaced);
}

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
import AppHeader from './AppHeader.vue';

export default {
  name: "Game",
  props: [
    "gameCode",
    "myNumber",
    "player1Name",
    "player2Name"
  ],
  data() {
    return data;
  },
  computed: {
    gameOver,
    message
  },
  created() {
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    registerSocketListeners,
    removeSocketListeners,
    image,
    playerNameStyle,
    cellBackgroundStyle,
    choosePiece,
    handlePieceChosen,
    placePiece,
    handlePiecePlaced,
    advanceGameState
  },
  components: {
    AppHeader
  }
};
