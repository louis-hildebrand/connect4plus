<template>
  <body>
    <div class="content">
      <button type="button" @click="createGame">Create game</button>
      <button type="button" @click="joinGame">Join game</button>
      <p>Enter the game code:</p>
      <input type="text" v-model="gameCodeInput" style="text-transform: uppercase" v-on:keypress="ensureLetter($event)">
      <p v-if="errorMsg" style="color: red;">{{errorMsg}}</p>
    </div>
    <QuartoFooter />
  </body>
</template>

<script>
import QuartoFooter from "./QuartoFooter.vue";

export default {
  name: "Home",
  components: {
    QuartoFooter
  },
  data() {
    return {
      errorMsg: "",
      gameCodeInput: ""
    };
  },
  computed: {
    gameCode() {
      return this.gameCodeInput.toUpperCase();
    }
  },
  created() {
    this.registerSocketListeners();
  },
  unmounted() {
    this.removeSocketListeners();
  },
  methods: {
    ensureLetter(evt) {
      const char = String.fromCharCode(evt.keyCode);
      if (/[A-Za-z]/.test(char)) {
        return true;
      }
      else {
        evt.preventDefault();
        return false;
      }
    },
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
      this.$router.push({ name: "Game", params: {gameCode: this.gameCode, myNumber: 2} });
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
