<template>
  <body>
    <div class="game-header">
      <div class="player-name" id="player1-name" :style="playerNameStyle(1)">Player 1</div>
      <div class="player-name" id="player2-name" :style="playerNameStyle(2)">Player 2</div>
    </div>
    <h5 class="msg">{{ msg }}</h5>
    <div class="game-content">
      <div class="grid">
        <div class="cell" v-for="(path, index) in playingBoard" :key="index">
          <img v-if="path" src="@/assets/light-square-x-thick.png" />
        </div>
      </div>
      <div class="single-cell">
        <img v-if="selectedPiece" :src="getImg(selectedPiece)" />
      </div>
      <div class="grid">
        <div class="cell" v-for="(piece, index) in availablePieces" :key="index">
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
  data() {
    return {
      msg: "Choose a piece for your opponent to place",
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
  methods: {
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
