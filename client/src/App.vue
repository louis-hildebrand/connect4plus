<template>
  <div id="app-template">
    <div id="app-content">
      <router-view/>
    </div>
    <footer>
      <img class="footer-mark" src="@/assets/github.png">
      <a href="https://github.com/louis-hildebrand/connect4plus">Source code</a>
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
    this.socket = io(config.backendUrl);
    this.socket.on("connect", () => {
      console.log(`Connected to the server (URL: ${config.backendUrl}).`);
    });
    this.socket.onAny((event, ...args) => {
      console.log(`Event '${event}'.`);
    });

    this.$router.replace({ name: "Home" });
  }
};
</script>

<style>
:root {
  --color-dark-main: darkslategrey;
  --color-dark-highlight: #447a7a;
  --color-light-main: #63a7a7;
  --color-light-highlight: #9fd3d3;
  --color-selected-cell-highlight: khaki;
  --color-font-dark: black;
  --color-font-light: white;
  --color-background: rgb(235, 235, 235);
  --color-outline-dark: black;
  --color-outline-light: lightgrey;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-font-dark, black);
  background-color: var(--color-background, white);
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
