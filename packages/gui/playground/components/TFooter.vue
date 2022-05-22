<template>
  <v-footer
    color="cyan"
    app
  >
    <span :class="color + '--text'">
      <v-icon x-small :color="color" v-if="message">mdi-record</v-icon> {{ message }}
    </span>
    <v-btn icon class="ml-1" small v-if="status === 3" @click="reconnect">
      <v-icon small color="white">mdi-refresh</v-icon>
    </v-btn>
    <v-spacer></v-spacer>

    <span class="white--text">
      <a href="javascript:;" @click="showAbout" class="white--text">drmer</a> &copy; 2020 - 2022
    </span>
    <about-dialog ref="about" />
  </v-footer>
</template>

<script>
import Vue from "vue";
import AboutDialog from "./AboutDialog";
import { drmer } from "../drmer";

export default Vue.extend({
  components: {
    AboutDialog,
  },
  data: () => ({
    message: "",
  }),
  computed: {
    color: function() {
      if (this.$store.state.status === 10) {
        return "white";
      }

      return "purple";
    },
    status: function() {
      return this.$store.state.status;
    },
  },
  watch: {
    status: function(val) {
      switch (val) {
        case 0:
          this.message = "starting";
          break;
        case 2:
          this.message = "connecting";
          break;
        case 4:
          this.message = "connected";
          break;
        case 6:
          this.message = "auth failed";
          break;
        case 10:
          this.message = "ready";
          break;
      }
    },
  },
  beforeMount() {
    drmer.on("tgrok", this.onMessage);
  },
  beforeDestroy() {
    drmer.removeListener("tgrok", this.onMessage);
  },
  methods: {
    onMessage: function(message) {
      const evt = message.evt;
      const payload = message.payload;

      switch (evt) {
        case "control:status":
          this.$store.commit("setStatus", payload);
          break;
        case "master:error":
          this.message = payload;
          break;
      }
    },
    reconnect: function() {
      drmer.run("TgrokService@reconnect");
    },
    showAbout: function() {
      this.$refs.about.show();
    },
  },
});
</script>
