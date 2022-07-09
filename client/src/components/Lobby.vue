<template>
  <div class="component-content">
    <header>
      <AppHeader />
    </header>
    <div class="game-code-message-container">
      <div>Your game code is</div>
      <h1 class="game-code">
        <strong>{{ gameCode }}</strong>
      </h1>
      <div>Share it with a friend to start playing.</div>
    </div>
    <div class="player-list">
      <h5>Players</h5>
      <div v-for="(player, index) in players" :key="index">
        {{ player.name }}
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';

export default {
  name: "Lobby",
  props: {
    gameCode: String,
    initialPlayers: Array
  },
  data() {
    return {
      players: []
    };
  },
  created() {
    this.players = this.initialPlayers.map(p => JSON.parse(p));
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    registerSocketListeners() {
      this.$root.socket.on("game-started", this.handleGameStarted);
      this.$root.socket.on("player-joined", this.handlePlayerJoined);
    },
    removeSocketListeners() {
      this.$root.socket.off("game-started", this.handleGameStarted);
      this.$root.socket.off("player-joined", this.handlePlayerJoined);
    },
    handleGameStarted(arg) {
      this.$router.replace({ name: "Game", params: {
        gameCode: this.gameCode,
        myNumber: 1,
        player1Name: arg.player1Name,
        player2Name: arg.player2Name
      } });
    },
    handlePlayerJoined(arg) {
      this.players.push(arg.player);
    }
  },
  components: {
    AppHeader
  }
};
</script>

<style scoped>
.component-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  font: x-large;
}

header {
  width: 100%;
}

.game-code-message-container {
  height: 75%;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: top;
}

.game-code {
  border: 2px var(--color-outline-dark, black) solid;
  background-color: lightgrey;
  padding: 15px;
  margin: 20px;
  font: xx-large;
}
</style>
