// -----------------------------------------------------------------------------
// Computed properties
// -----------------------------------------------------------------------------
function currentPlayer() {
  return this.getPlayerById(this.currentPlayerId);
}

function gameOver() {
  return this.gameOverWin || this.gameOverTie;
}

function isMyTurn() {
  return this.$root.socket.id === this.currentPlayerId;
}

function message() {
  if (this.gameOverWin && this.isMyTurn) {
    return "Game over. You win!";
  }
  else if (this.gameOverWin && !this.isMyTurn) {
    return "Game over. You lose.";
  }
  else if (this.gameOverTie) {
    return "Game over. Tie.";
  }
  else if (this.isMyTurn && this.placingPiece) {
    return "Choose where to place the piece.";
  }
  else if (this.isMyTurn && !this.placingPiece) {
    return `Choose a piece for ${this.nextPlayerName}.`;
  }
  else if (!this.isMyTurn && this.placingPiece) {
    return `Waiting for ${this.getPlayerById(this.currentPlayerId).name}'s move...`;
  }
  else if (!this.isMyTurn && !this.placingPiece) {
    return `Waiting for ${this.getPlayerById(this.currentPlayerId).name}'s move...`;
  }
  else {
    return "Invalid state. Please refresh the page.";
  }
}

function nextPlayerName() {
  const currentIndex = this.players.indexOf(this.getPlayerById(this.currentPlayerId));

  const nextIndex = (currentIndex + 1) % this.players.length;

  return this.players[nextIndex].name;
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

  this.placingPiece = !this.placingPiece;
}

function cellBackgroundStyle(isPlayingBoard, index) {
  const boardHighlight = isPlayingBoard ? this.playingBoardHighlight : this.availablePiecesHighlight;
  const highlightThis = boardHighlight.some(x => x === index);
  const color = highlightThis ? "var(--color-selected-cell-highlight, khaki)" : "var(--color-background, white)";
  return `background-color: ${color};`;
}

function choosePiece(index) {
  if (this.gameOver) return;
  if (!this.isMyTurn) return;
  if (this.placingPiece) return;
  if (!this.availablePieces[index]) return;
  if (!this.availablePiecesHighlight.some(x => x === index)) {
    this.availablePiecesHighlight = [index];
    return;
  }

  this.availablePiecesHighlight = [];

  const arg = {gameCode: this.gameCode, index: index};
  const callback = (response) => {
    switch (response.status) {
      case 200:
        this.handlePieceChosen(response);
        break;
      default:
        // TODO
        break;
    }
  };
  this.$root.socket.emit("choose-piece", arg, callback);
}

function getPlayerById(id) {
  return this.players.filter(p => p.id === id)[0];
}

function handlePieceChosen(arg) {
  this.selectedPiece = this.availablePieces[arg.index];
  this.availablePieces[arg.index] = null;

  this.currentPlayerId = arg.currentPlayerId;

  this.advanceGameState();
}

function handlePiecePlaced(arg) {
  this.playingBoard[arg.index] = this.selectedPiece;
  this.selectedPiece = null;

  this.advanceGameState();
}

function image(piece) {
  const name = piece.color + "-" + piece.shape + "-" + piece.mark + "-" + piece.border + ".png";
  return require("@/assets/pieces/" + name);
}

function placePiece(index) {
  if (this.gameOver) return;
  if (!this.isMyTurn) return;
  if (!this.placingPiece) return;
  if (this.playingBoard[index]) return;
  if (!this.playingBoardHighlight.some(x => x === index)) {
    this.playingBoardHighlight = [index];
    return;
  }

  this.playingBoardHighlight = [];

  const arg = {gameCode: this.gameCode, index: index};
  const callback = (response) => {
    switch (response.status) {
      case 200:
        this.handlePiecePlaced(response);
        break;
      default:
        // TODO
        break;
    }
  };
  this.$root.socket.emit("place-piece", arg, callback);
}

function playerNameStyle(player) {
  if (player === this.currentPlayer) {
    return "background-color: var(--color-dark-highlight, #447a7a);";
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
  props: {
    gameCode: String,
    initialPlayers: Array,
    initialCurrentPlayerId: String
  },
  data() {
    return {
      players: this.initialPlayers.map(p => JSON.parse(p)),
      currentPlayerId: this.initialCurrentPlayerId,
      gameOverWin: false,
      gameOverTie: false,
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
  },
  computed: {
    currentPlayer,
    gameOver,
    isMyTurn,
    message,
    nextPlayerName
  },
  created() {
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    getPlayerById,
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
