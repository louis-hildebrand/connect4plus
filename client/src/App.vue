<template>
  <router-view/>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
