<template>
  <div>
    <QuartoHeader />
    <p>Your game code is</p>
    <h1><strong>{{ gameCode }}</strong></h1>
    <p>Share it with a friend to start playing.</p>
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";

export default {
  name: "Lobby",
  components: {
    QuartoHeader
  },
  props: [
    "gameCode"
  ]
};
</script>
