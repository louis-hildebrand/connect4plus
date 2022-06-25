<template>
  <div>
    <QuartoHeader />
    <p>Here is where the Quarto game will take place.</p>
    <QuartoFooter />
  </div>
</template>

<script>
import QuartoHeader from "./QuartoHeader.vue";
import QuartoFooter from "./QuartoFooter.vue";

export default {
  name: "Game",
  components: {
    QuartoHeader,
    QuartoFooter
}
}
</script>
