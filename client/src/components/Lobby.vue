<template>
  <div class="component-content">
    <header>
      <AppHeader>
        <button
        type="button"
        class="btn btn-primary"
        id="start-game-btn"
        v-if="amHost"
        @click="startGame"
        :disabled="startGameButtonDisabled"
      >
        Start game
      </button>
      </AppHeader>
    </header>
    <div class="component-body">
      <div class="game-code-container">
        <div>Your game code is</div>
        <h1 class="game-code">
          <strong>{{ gameCode }}</strong>
        </h1>
      </div>
      <div class="player-list-container">
        <h3><b>Players</b></h3>
        <div class="player-list">
          <div v-for="(player, index) in players" :key="index">
            {{ player.name }}
          </div>
        </div>
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
}

header {
  width: 100%;
}

#start-game-btn {
  margin: 5px;
}

.component-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  row-gap: 30px;
  font: x-large;
  flex-grow: 1;
  width: 100%;
}

.game-code-container {
  display: flex;
  flex-direction: column;
}

.game-code {
  border: 2px var(--color-outline-dark, black) solid;
  background-color: lightgrey;
  width: 7em;
  padding: 10px;
  margin: 10px;
  font: xx-large;
}

.player-list-container {
  width: 100%;
}

.player-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 20px;
  justify-content: center;
  width: 80%;
  padding: 10px;
}
</style>
