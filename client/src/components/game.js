import { choosePiece, initialAvailablePieces, nextPlayerId, placePiece } from "./gameplay.js";

// -----------------------------------------------------------------------------
// Computed properties
// -----------------------------------------------------------------------------
function isMyTurn() {
  return this.$root.socket.id === this.gameState.currentPlayerId;
}

function message() {
  const gameOverWin = this.gameState.gameOver && this.gameState.winningCells.length > 0;
  const gameOverTie = !gameOverWin && this.gameState.gameOver;

  if (gameOverWin && this.isMyTurn)
    return "Game over. You win!";
  else if (gameOverWin && !this.isMyTurn)
    return "Game over. You lose.";
  else if (gameOverTie)
    return "Game over. Tie.";
  else if (this.isMyTurn && this.gameState.placingPiece)
    return "Choose where to place the piece.";
  else if (this.isMyTurn && !this.gameState.placingPiece)
    return `Choose a piece for ${this.nextPlayerName}.`;
  else if (!this.isMyTurn && this.gameState.placingPiece)
    return `Waiting for ${this.playerNames.get(this.gameState.currentPlayerId)}'s move...`;
  else if (!this.isMyTurn && !this.gameState.placingPiece)
    return `Waiting for ${this.playerNames.get(this.gameState.currentPlayerId)}'s move...`;
  else
    return "Invalid state. Please refresh the page.";
}

function nextPlayerName() {
  const nextId = nextPlayerId(this.gameState.playerIds, this.gameState.currentPlayerId);
  return this.playerNames.get(nextId);
}

function players() {

}

// -----------------------------------------------------------------------------
// Public methods
// -----------------------------------------------------------------------------
function eventChoosePiece(index) {
  if (this.gameState.gameOver) return;
  if (!this.isMyTurn) return;
  if (this.gameState.placingPiece) return;
  if (!this.gameState.availablePieces[index]) return;
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

function eventPlacePiece(index) {
  if (this.gameState.gameOver) return;
  if (!this.isMyTurn) return;
  if (!this.gameState.placingPiece) return;
  if (this.gameState.playingBoard[index]) return;
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

function handlePieceChosen(arg) {
  this.gameState = choosePiece(this.gameState, arg.index);
}

function handlePiecePlaced(arg) {
  this.gameState = placePiece(this.gameState, arg.index);
  this.playingBoardHighlight = this.gameState.winningCells;
}

function image(piece) {
  const name = piece.color + "-" + piece.shape + "-" + piece.mark + "-" + piece.border + ".png";
  return require("@/assets/pieces/" + name);
}

function initializePlayerIds() {
  return this.initialPlayers.map((p) => JSON.parse(p).id);
}

function initializePlayersMap() {
  const playersMap = new Map();

  this.initialPlayers.forEach((p) => {
    const player = JSON.parse(p);
    playersMap.set(player.id, player.name);
  });

  return playersMap;
}

function registerSocketListeners() {
  this.$root.socket.on("piece-chosen", this.handlePieceChosen);
  this.$root.socket.on("piece-placed", this.handlePiecePlaced);
}

function removeSocketListeners() {
  this.$root.socket.off("piece-chosen", this.handlePieceChosen);
  this.$root.socket.off("piece-placed", this.handlePiecePlaced);
}

function styleCellBackground(isPlayingBoard, index) {
  const boardHighlight = isPlayingBoard ? this.playingBoardHighlight : this.availablePiecesHighlight;
  const highlightThis = boardHighlight.some(x => x === index);
  const color = highlightThis ? "var(--color-selected-cell-highlight, khaki)" : "var(--color-background, white)";
  return `background-color: ${color};`;
}

function stylePlayerName(id) {
  if (id === this.gameState.currentPlayerId) {
    return "background-color: var(--color-dark-highlight, #447a7a);";
  }
  else {
    return "";
  }
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
      gameState: {
        playerIds: this.initializePlayerIds(),
        playingBoard: Array(16).fill(null),
        availablePieces: initialAvailablePieces(),
        selectedPiece: null,
        currentPlayerId: this.initialCurrentPlayerId,
        placingPiece: false,
        winningCells: []
      },
      playerNames: this.initializePlayersMap(),
      playingBoardHighlight: [],
      availablePiecesHighlight: []
    };
  },
  computed: {
    isMyTurn,
    message,
    nextPlayerName,
    players
  },
  created() {
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    eventChoosePiece,
    eventPlacePiece,
    handlePieceChosen,
    handlePiecePlaced,
    image,
    initializePlayerIds,
    initializePlayersMap,
    registerSocketListeners,
    removeSocketListeners,
    styleCellBackground,
    stylePlayerName
  },
  components: {
    AppHeader
  }
};
