<template>
  <div class="component-content">
    <header>
      <AppHeader />
    </header>
    <h1 class="game-code">
      <strong>{{ gameCode }}</strong>
    </h1>
    <div>Share this game code with a friend to start playing.</div>
    <button type="button" class="btn btn-primary" v-if="amHost" @click="startGame" :disabled="startGameButtonDisabled">
      Start game
    </button>
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
    initialPlayers: Array,
    amInitialHost: String  // The Vue router insists on converting the boolean value to a string >>:(
  },
  computed: {
    startGameButtonDisabled() {
      return this.players.length < 2;
    }
  },
  data() {
    return {
      players: this.initialPlayers.map(p => JSON.parse(p)),
      amHost: this.amInitialHost === "true"
    };
  },
  created() {
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
    startGame() {
      const arg = { gameCode: this.gameCode };
      const callback = (response) => {
        switch (response.status) {
          case 200:
            this.handleGameStarted(response);
            break;
          default:
            // TODO
            break;
        }
      };
      this.$root.socket.emit("start-game", arg, callback);
    },
    handleGameStarted(arg) {
      this.$router.replace({ name: "Game", params: {
        gameCode: this.gameCode,
        initialPlayers: this.players.map(p => JSON.stringify(p)),
        initialCurrentPlayerId: arg.currentPlayerId
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

.game-code {
  border: 2px var(--color-outline-dark, black) solid;
  background-color: lightgrey;
  width: 7em;
  padding: 15px;
  margin: 20px;
  font: xx-large;
}
</style>
