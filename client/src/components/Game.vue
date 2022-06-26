<template>
  <body>
    <div class="game-header">
      <div class="player-name" id="player1-name" :style="playerNameStyle(1)">Player 1</div>
      <div class="player-name" id="player2-name" :style="playerNameStyle(2)">Player 2</div>
    </div>
    <h5 class="msg">{{ msg }}</h5>
    <div class="game-content">
      <div class="grid">
        <div class="cell" v-for="(piece, index) in playingBoard" :key="index" @click="placePiece(index)">
          <img v-if="piece" :src="getImg(piece)" />
        </div>
      </div>
      <div class="single-cell">
        <img v-if="selectedPiece" :src="getImg(selectedPiece)" />
      </div>
      <div class="grid">
        <div class="cell" v-for="(piece, index) in availablePieces" :key="index" @click="choosePiece(index)">
          <img v-if="piece" :src="getImg(piece)" />
        </div>
      </div>
    </div>
    <QuartoFooter />
  </body>
</template>

<script>
import QuartoFooter from "./QuartoFooter.vue";

export default {
  name: "Game",
  components: {
    QuartoFooter
  },
  props: [
    "gameCode",
    "myNumber"
  ],
  data() {
    return {
      gameOverWin: false,
      gameOverTie: false,
      currentPlayer: 1,
      placingPiece: false,
      playingBoard: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      availablePieces: [
        {color: "dark", shape: "square", mark: "o", border: "thick"},
        {color: "dark", shape: "square", mark: "o", border: "thin"},
        {color: "dark", shape: "circle", mark: "o", border: "thin"},
        {color: "dark", shape: "circle", mark: "o", border: "thick"},
        {color: "dark", shape: "square", mark: "x", border: "thick"},
        {color: "dark", shape: "square", mark: "x", border: "thin"},
        {color: "dark", shape: "circle", mark: "x", border: "thin"},
        {color: "dark", shape: "circle", mark: "x", border: "thick"},
        {color: "light", shape: "square", mark: "x", border: "thick"},
        {color: "light", shape: "square", mark: "x", border: "thin"},
        {color: "light", shape: "circle", mark: "x", border: "thin"},
        {color: "light", shape: "circle", mark: "x", border: "thick"},
        {color: "light", shape: "square", mark: "o", border: "thick"},
        {color: "light", shape: "square", mark: "o", border: "thin"},
        {color: "light", shape: "circle", mark: "o", border: "thin"},
        {color: "light", shape: "circle", mark: "o", border: "thick"}
      ],
      selectedPiece: null
    };
  },
  computed: {
    gameOver() {
      return this.gameOverWin || this.gameOverTie;
    },
    msg() {
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
  },
  created() {
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    registerSocketListeners() {
      this.$root.socket.on("piece-chosen", this.handlePieceChosen);
      this.$root.socket.on("piece-placed", this.handlePiecePlaced);
    },
    removeSocketListeners() {
      this.$root.socket.off("piece-chosen", this.handlePieceChosen);
      this.$root.socket.off("piece-placed", this.handlePiecePlaced);
    },
    getImg(piece) {
      const name = piece.color + "-" + piece.shape + "-" + piece.mark + "-" + piece.border + ".png";
      return require("@/assets/" + name);
    },
    playerNameStyle(player) {
      if (player === this.currentPlayer) {
        return "background-color: slategrey;";
      }
      else {
        return "";
      }
    },
    choosePiece(index) {
      if (this.gameOver) return;
      if (this.myNumber * 1 !== this.currentPlayer) return;
      if (this.placingPiece) return;
      if (!this.availablePieces[index]) return;

      this.$root.socket.emit("choose-piece", {gameCode: this.gameCode, piece: index});

      this.handlePieceChosen(index);
    },
    handlePieceChosen(index) {
      this.selectedPiece = this.availablePieces[index];
      this.availablePieces[index] = null;

      this.advanceGameState();
    },
    placePiece(index) {
      if (this.gameOver) return;
      if (this.myNumber * 1 !== this.currentPlayer) return;
      if (!this.placingPiece) return;
      if (this.playingBoard[index]) return;

      this.$root.socket.emit("place-piece", {gameCode: this.gameCode, piece: index});

      this.handlePiecePlaced(index);
    },
    handlePiecePlaced(index) {
      this.playingBoard[index] = this.selectedPiece;
      this.selectedPiece = null;

      this.advanceGameState();
    },
    advanceGameState() {
      const winningIndices = this.isWin();
      if (winningIndices) {
        this.win(winningIndices);
        return;
      }
      else if (this.isTie()) {
        this.tie();
        return;
      }

      this.currentPlayer = this.placingPiece
        ? this.currentPlayer
        : (this.currentPlayer % 2) + 1;

      this.placingPiece = !this.placingPiece;
    },
    win(winningIndices) {
      console.log(`Win detected: ${winningIndices}`);
      this.gameOverWin = true;
    },
    tie() {
      console.log("Tie detected");
      this.gameOverTie = true;
    },
    isWin() {
      const winningIndices =
        // Horizontal
        this.haveCommonCharacteristics(0, 1, 2, 3)
        || this.haveCommonCharacteristics(4, 5, 6, 7)
        || this.haveCommonCharacteristics(8, 9, 10, 11)
        || this.haveCommonCharacteristics(12, 13, 14, 15)
        // Vertical
        || this.haveCommonCharacteristics(0, 4, 8, 12)
        || this.haveCommonCharacteristics(1, 5, 9, 13)
        || this.haveCommonCharacteristics(2, 6, 10, 14)
        || this.haveCommonCharacteristics(3, 7, 11, 15)
        // Diagonal
        || this.haveCommonCharacteristics(0, 5, 10, 15)
        || this.haveCommonCharacteristics(3, 6, 9, 12);
      return winningIndices;
    },
    haveCommonCharacteristics(idx0, idx1, idx2, idx3) {
      const pieces = [
        this.playingBoard[idx0],
        this.playingBoard[idx1],
        this.playingBoard[idx2],
        this.playingBoard[idx3],
      ];
      if (pieces.some((x) => !x)) {
        return false;
      }
      
      const common = {
        color: pieces[0].color,
        shape: pieces[0].shape,
        mark: pieces[0].mark,
        border: pieces[0].border
      };
      for (var i = 1; i < 4; i++) {
        if (pieces[i].color !== common.color) common.color = false;
        if (pieces[i].shape !== common.shape) common.shape = false;
        if (pieces[i].mark !== common.mark) common.mark = false;
        if (pieces[i].border !== common.border) common.border = false;
      }

      const haveCommonCharacteristics = common.color || common.shape || common.mark || common.border;
      return haveCommonCharacteristics ? [idx0, idx1, idx2, idx3] : false;
    },
    isTie() {
      return this.playingBoard.every((x) => x);
    }
  }
}
</script>

<style scoped>
footer {
  height: 50px;
  text-align: center;
}
.game-header {
  display: flex;
  flex-direction: row;
  background-color: darkslategrey;
  margin-bottom: 1.5rem;
}
.player-name {
  font-size: x-large;
  padding: 0.75rem;
  color: white;
}
#player1-name {
  margin-right: auto;
}
#player2-name {
  margin-left: auto;
}
.game-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.msg {
  margin-bottom: 1.5rem;
}
.grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 0.3rem;
  padding: 0.3rem;
  margin: auto;
  background-color: darkslategrey;
}
.cell, .single-cell {
  width: 8rem;
  height: 8rem;
  padding: 0px;
  margin: auto;
  background-color: white;
}
.single-cell {
  border-style: solid;
  border-width: 0.3rem;
  border-color: darkslategrey;
}
img {
  width: 100%;
  height: 100%;
}
</style>
