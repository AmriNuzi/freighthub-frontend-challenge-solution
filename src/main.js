import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import router from "./router";

Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(),
  router,
  render: (h) => h(App),
}).$mount("#app");
