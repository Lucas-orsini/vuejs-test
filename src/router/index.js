import Vue from "vue";
import VueRouter from "vue-router";
import Cas1 from "../pages/Cas1.vue";
import Cas2 from "../pages/Cas2.vue";
import Cas3 from "../pages/Cas3.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Cas1 },
  { path: "/cas-2", component: Cas2 },
  { path: "/cas-3", component: Cas3 }
];

const router = new VueRouter({ routes });

export default router;
