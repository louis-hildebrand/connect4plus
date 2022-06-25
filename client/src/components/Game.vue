<template>
  <div>
    <QuartoHeader />
    <p>Here is where the Quarto game will take place.</p>
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";

export default {
  name: "Game",
  components: {
    QuartoHeader
  }
}
</script>
