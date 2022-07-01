<template>
  <div class="content">
    <p>Your game code is</p>
    <h1><strong>{{ gameCode }}</strong></h1>
    <p>Share it with a friend to start playing.</p>
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
      this.$router.push({ name: "Game", params: {gameCode: this.gameCode, myNumber: 1} });
    }
  }
};
</script>
