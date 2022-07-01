<template>
  <div class="component-content">
    <div>Your game code is</div>
    <h1 class="game-code">
      <strong>{{ gameCode }}</strong>
    </h1>
    <div>Share it with a friend to start playing.</div>
  </div>
</template>

<script>
export default {
  name: "Lobby",
  props: [
    "gameCode"
  ],
  created() {
    this.registerSocketListeners();
  },
  methods: {
    registerSocketListeners() {
      this.$root.socket.on("game-started", this.handleGameStarted);
    },
    handleGameStarted() {
      this.$router.replace({ name: "Game", params: {gameCode: this.gameCode, myNumber: 1} });
    }
  }
};
</script>

<style scoped>
.component-content {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  font: x-large;
}

.game-code {
  border: 2px black solid;
  align-self: center;
  padding: 15px;
  font: xx-large;
}
</style>