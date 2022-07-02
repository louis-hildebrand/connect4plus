<template>
  <div class="component-content">
    <!-- Join game modal -->
    <div class="modal fade" id="join-game-modal" data-bs-backdrop="false" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><b>Join an existing game</b></h5>
          </div>
          <div class="modal-body">
            <div class="modal-content-row">
              <div>Enter the game code:</div>
              <input
                type="text"
                v-model="gameCodeInput"
                style="text-transform: uppercase"
                v-on:keypress="ensureLetter($event)"
              >
            </div>
            <div class="modal-content-row">
              <div>Choose a display name:</div>
              <input
                type="text"
                v-model="player2Name"
              >
            </div>
            <p v-if="errorMsg" style="color: red;">{{errorMsg}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="joinGame">
              Join game
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Create game modal -->
    <div class="modal fade" id="create-game-modal" data-bs-backdrop="false" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><b>Create a new game</b></h5>
          </div>
          <div class="modal-body">
            <div class="modal-content-row">
              <div>Choose a display name:</div>
              <input
                type="text"
                v-model="player1Name"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="createGame">
              Create game
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Buttons -->
    <div class="button-container">
      <!-- Create game button -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create-game-modal">
        Create game
      </button>
      <!-- Join game button -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#join-game-modal">
        Join game
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      errorMsg: "",
      gameCodeInput: "",
      player1Name: "",
      player2Name: ""
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
      console.log(arg);
      this.$router.push({ name: "Game", params: {
        gameCode: this.gameCode,
        myNumber: 2,
        player1Name: arg.player1Name,
        player2Name: arg.player2Name
      }});
    },
    createGame() {
      console.log("Creating a new game.");
      this.$root.socket.emit("create-game", {player1Name: this.player1Name});
    },
    joinGame() {
      if (this.gameCode) {
        console.log(`Joining game '${this.gameCode}'.`);
        this.$root.socket.emit("join-game", {gameCode: this.gameCode, player2Name: this.player2Name});
      }
      else {
        this.errorMsg = "Please enter a game code.";
      }
    }
  }
};
</script>

<style scoped>
.component-content {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.button-container {
  max-width: min(20rem, 80%);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 5%;
  align-self: center;
}

.modal-content-row {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: right;
  column-gap: 1.5em;
  margin: 10px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
}
</style>
