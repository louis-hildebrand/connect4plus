import { createRouter, createWebHistory } from "vue-router";
import Game from "../components/Game.vue";
import Home from "../components/Home.vue";
import Lobby from "../components/Lobby.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: Lobby,
    props: true
  },
  {
    path: "/play",
    name: "Game",
    component: Game,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
