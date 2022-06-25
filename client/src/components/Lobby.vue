<template>
  <div>
    <QuartoHeader />
    <p>Your game code is</p>
    <h1><strong>{{ gameCode }}</strong></h1>
    <p>Share it with a friend to start playing.</p>
    <QuartoFooter />
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";
import QuartoFooter from "./QuartoFooter.vue";

export default {
  name: "Lobby",
  components: {
    QuartoHeader,
    QuartoFooter
},
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
      this.$router.push({ name: "Game" });
    }
  }
};
</script>
