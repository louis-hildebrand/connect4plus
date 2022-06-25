<template>
  <div>
    <QuartoHeader />
    <button type="button" @click="createGame">Create game</button>
    <button type="button" @click="joinGame">Join game</button>
    <p>Enter the game code:</p>
    <input v-model="gameCode" type="text" style="text-transform: uppercase;">
    <p v-if="errorMsg" style="color: red;">{{errorMsg}}</p>
    <QuartoFooter />
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";
import QuartoFooter from "./QuartoFooter.vue";

export default {
  name: "Home",
  components: {
    QuartoHeader,
    QuartoFooter
  },
  data() {
    return {
      errorMsg: "",
      gameCode: ""
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
      this.$root.socket.on("game-created", this.handleGameCreated);
      this.$root.socket.on("game-not-found", this.handleGameNotFound);
      this.$root.socket.on("game-already-started", this.handleGameAlreadyStarted);
      this.$root.socket.on("game-started", this.handleGameStarted);
    },
    removeSocketListeners() {
      this.$root.socket.off("game-created", this.handleGameCreated);
      this.$root.socket.off("game-not-found", this.handleGameNotFound);
      this.$root.socket.off("game-already-started", this.handleGameAlreadyStarted);
      this.$root.socket.off("game-started", this.handleGameStarted);
    },
    handleGameCreated(arg) {
      this.$router.push({ name: "Lobby", params: {gameCode: arg.gameCode} });
    },
    handleGameAlreadyStarted(arg) {
      console.log("Event 'game-already-started'.");
      this.errorMsg = "That game has already started.";
    },
    handleGameNotFound(arg) {
      console.log("Event 'game-not-found'.");
      this.errorMsg = "There is no game with that code."
    },
    handleGameStarted(arg) {
      this.$router.push({ name: "Game" });
    },
    createGame() {
      console.log("Creating a new game.");
      this.$root.socket.emit("create-game");
    },
    joinGame() {
      if (this.gameCode) {
        console.log(`Joining game '${this.gameCode}'.`);
        this.$root.socket.emit("join-game", {gameCode: this.gameCode});
      }
      else {
        this.errorMsg = "Please enter a game code.";
      }
    }
  }
};
</script>
