<template>
  <div class="component-content">
    <header>
      <AppHeader />
    </header>
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
                v-model="guestDisplayName"
              >
            </div>
            <p v-if="errorMsg" style="color: red;">{{errorMsg}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="joinGame" :disabled="joinGameButtonDisabled">
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
                v-model="hostDisplayName"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="createGame" :disabled="createGameButtonDisabled">
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
import AppHeader from './AppHeader.vue';

export default {
  name: "Home",
  data() {
    return {
      errorMsg: "",
      gameCodeInput: "",
      hostDisplayName: "",
      guestDisplayName: ""
    };
  },
  computed: {
    gameCode() {
      return this.gameCodeInput.toUpperCase();
    },
    createGameButtonDisabled() {
      return !this.hostDisplayName;
    },
    joinGameButtonDisabled() {
      return !this.gameCodeInput || !this.guestDisplayName;
    }
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
    createGame() {
      const arg = { displayName: this.hostDisplayName };
      const callback = (response) => {
        switch (response.status) {
          case 200:
            const hostPlayer = { id: this.$root.socket.id, name: this.hostDisplayName };
            this.$router.push({ name: "Lobby", params: {
              gameCode: response.gameCode,
              initialPlayers: [JSON.stringify(hostPlayer)],
              amInitialHost: true
            } });
            break;
          default:
            // TODO
            break;
        }
      };
      this.$root.socket.emit("create-game", arg, callback);
    },
    joinGame() {
      if (this.gameCode) {
        const arg = { gameCode: this.gameCode, displayName: this.guestDisplayName };
        const callback = (response) => {
          switch (response.status) {
            case 200:
              this.$router.push({ name: "Lobby", params: {
                gameCode: this.gameCode,
                initialPlayers: response.players.map(p => JSON.stringify(p)),
                amInitialHost: false
              } });
              break;
            case 404:
              this.errorMsg = "There is no game with that code.";
              break;
            case 409:
              this.errorMsg = "That game has already started.";
              break;
            default:
              this.errorMsg = "An unexpected error occurred. Please refresh the page and try again.";
              break;
          }
        };
        this.$root.socket.emit("join-game", arg, callback);
      }
      else {
        this.errorMsg = "Please enter a game code.";
      }
    }
  },
  components: {
    AppHeader
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

header {
  flex-grow: 0;
}

.button-container {
  max-width: min(20rem, 80%);
  width: 100%;
  height: 100%;
  flex-grow: 1;
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
