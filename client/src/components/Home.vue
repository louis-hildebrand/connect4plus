<template>
  <div>
    <QuartoHeader />
    <button type="button" @click="createGame">Create game</button>
    <button type="button" @click="joinGame">Join game</button>
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";

export default {
  name: "Home",
  components: {
    QuartoHeader
  },
  methods: {
    createGame: function() {
      console.log("TODO: Create game...");
      this.$router.push({ name: "Lobby", params: {gameCode: "ABC 123"} });
    },
    joinGame: function() {
      console.log("TODO: Join game...");
    }
  }
};
</script>
