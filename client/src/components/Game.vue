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
    msg() {
      if (this.myNumber * 1 === this.currentPlayer && this.placingPiece) {
        return "Choose where to place the piece";
      }
      else if (this.myNumber * 1 === this.currentPlayer && !this.placingPiece) {
        return "Choose a piece for your opponent";
      }
      else if (this.myNumber * 1 !== this.currentPlayer && this.placingPiece) {
        return "Your opponent is choosing where to place the piece";
      }
      else if (this.myNumber * 1 !== this.currentPlayer && !this.placingPiece) {
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
      if (player === 1) {
        return "";
      }
      else if (player === 2) {
        return "background-color: slategrey;";
      }
    },
    choosePiece(index) {
      if (this.myNumber * 1 !== this.currentPlayer) {
        return;
      }
      if (this.placingPiece) {
        return;
      }
      if (!this.availablePieces[index]) {
        return;
      }

      this.$root.socket.emit("choose-piece", {gameCode: this.gameCode, piece: index});

      this.handlePieceChosen(index);
    },
    handlePieceChosen(index) {
      this.selectedPiece = this.availablePieces[index];
      this.availablePieces[index] = null;

      this.advanceRound();
    },
    placePiece(index) {
      if (this.myNumber * 1 !== this.currentPlayer) {
        return;
      }
      if (!this.placingPiece) {
        return;
      }
      if (this.playingBoard[index]) {
        return;
      }

      this.$root.socket.emit("place-piece", {gameCode: this.gameCode, piece: index});

      this.handlePiecePlaced(index);
    },
    handlePiecePlaced(index) {
      this.playingBoard[index] = this.selectedPiece;
      this.selectedPiece = null;

      this.advanceRound();
    },
    advanceRound() {
      this.currentPlayer = this.placingPiece
        ? this.currentPlayer
        : (this.currentPlayer % 2) + 1;

      this.placingPiece = !this.placingPiece;
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
  padding: 0.25rem;
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
  max-width: 100%;
  max-height: 100%;
}
</style>
