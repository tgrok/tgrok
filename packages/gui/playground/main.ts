import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import { drmer } from "./drmer";

import "animate.css";

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    openLink: function(url) {
      drmer.run("PageService@external", {
        url,
      });
    },
  },
});

(window as any).drmer = drmer;

// load configuration
store.dispatch("load");

drmer.onReady(() => {
  const conf = store.state.server;

  if (conf) {
    drmer.run("TgrokService@boot", conf);
  }
  new Vue({
    vuetify,
    store,
    render: h => h(App),
  }).$mount("#app");
});
