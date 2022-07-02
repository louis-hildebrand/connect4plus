<template>
  <div id="app-template">
    <div id="app-content">
      <router-view/>
    </div>
    <footer>
      <img class="footer-mark" src="@/assets/github.png">
      <a href="https://github.com/louis-hildebrand/quarto">Source code</a>
    </footer>
  </div>
</template>

<script>
import config from "@/config";
import { io } from "socket.io-client";

export default {
  name: "App",
  data() {
    return {
      socket: null
    }
  },
  created() {
    document.title = "Quarto";

    this.socket = io(config.backendUrl);
    this.socket.on("connect", () => {
      console.log(`Connected to the server (URL: ${config.backendUrl}).`);
    });

    this.$router.replace({ name: "Home" });
  }
};
</script>

<style>
:root {
  --selected-cell-highlight-color: khaki;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

html, body, #app, #app-template, .component-content {
  width: 100%;
  height: 100%;
}

#app-template {
  display: flex;
  flex-direction: column;
}

#app-content {
  flex: 1 1 auto;
}

footer {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  flex: 0 1 auto;
  text-align: left;
  padding: 5px;
  margin-top: 5px;
}
</style>
