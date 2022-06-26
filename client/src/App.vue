<template>
  <router-view/>
</template>

<script>
import { io } from "socket.io-client";

//const backendUrl = "ws://localhost:3000/";
const backendUrl = "https://connect4plus-backend.herokuapp.com/";

export default {
  name: "App",
  data() {
    return {
      socket: null
    }
  },
  created() {
    document.title = "Quarto";

    this.socket = io(backendUrl);
    this.socket.on("connect", () => {
      console.log("Connected to the server.");
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
