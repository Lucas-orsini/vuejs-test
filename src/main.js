import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import DesignSystem from "@makesenseorg/design-system";
import "@makesenseorg/design-system/dist/system.css";

Vue.use(DesignSystem);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
