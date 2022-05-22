<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-left
      color="cyan"
      dark
    >
      <v-icon>mdi-folder-network</v-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span>Tgrok</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" class="mr-2" @click="$refs.settingDialog.show()">
            <v-icon>mdi-cogs</v-icon>
          </v-btn>
        </template>
        <span>Setting</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="editTunnel(null)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Create tunnel</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-container
        fluid
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="4"
            v-for="tunnel in tunnels"
            :key="tunnel.subdomain"
          >
            <tunnel-card
              v-bind:model="tunnel"
              @share="shareTunnel(tunnel)"
              @show="showRequests(tunnel)"
              @edit="editTunnel(tunnel)"
              @delete="deleteTunnel(tunnel)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <tunnel-form-dialog ref="formDialog" />
    <tunnel-share-dialog ref="shareDialog" />
    <tunnel-requests-dialog ref="requestsDialog" />
    <tunnel-delete-dialog ref="deleteDialog" />
    <setting-dialog ref="settingDialog" />
    <t-footer />
  </v-app>
</template>

<style>
html, body, #inspire {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 0 !important
}
</style>

<script>
import Vue from "vue";
import TunnelCard from "@/components/tunnel/DetaillCard.vue";
import TunnelFormDialog from "@/components/tunnel/FormDialog.vue";
import TunnelShareDialog from "@/components/tunnel/ShareDialog.vue";
import TunnelRequestsDialog from "@/components/tunnel/RequestsDialog.vue";
import TunnelDeleteDialog from "@/components/tunnel/DeleteDialog.vue";
import SettingDialog from "./components/SettingDialog";
import TFooter from "./components/TFooter";
import { drmer } from "./drmer";

export default Vue.extend({
  data: () => ({
    header: 0,
  }),
  components: {
    TunnelCard,
    TunnelFormDialog,
    TunnelShareDialog,
    TunnelRequestsDialog,
    TunnelDeleteDialog,
    SettingDialog,
    TFooter,
  },
  computed: {
    tunnels: function() {
      return this.$store.state.tunnels;
    },
  },
  watch: {
    "$store.state.status": function(val) {
      if (val === 10) {
        this.openTunnels();
      }
    },
  },
  async beforeMount() {
    drmer.on("tgrok", this.onMessage);
    const data = await drmer.callJson("TgrokService@status");

    this.$store.commit("setStatus", data.status);
  },
  beforeDestroy() {
    drmer.removeListener("tgrok", this.onMessage);
  },
  mounted: async function() {
    if (this.tunnels.length === 0) {
      this.editTunnel();
    }
  },
  methods: {
    editTunnel: function(tunnel) {
      this.$refs.formDialog.show(tunnel);
    },
    shareTunnel: function(tunnel) {
      this.$refs.shareDialog.show(tunnel);
    },
    showRequests: function(tunnel) {
      this.$refs.requestsDialog.show(tunnel);
    },
    deleteTunnel: function(tunnel) {
      this.$refs.deleteDialog.show(tunnel);
    },
    onMessage: function(message) {
      const evt = message.evt;
      const payload = message.payload;

      switch (evt) {
        case "tunnel:status":
          this.$store.commit("setTunnelStatus", payload);
      }
    },
    openTunnels: function() {
      this.tunnels.forEach((tunnel) => {
        if (tunnel.paused) {
          return;
        }
        this.$store.dispatch("openTunnel", tunnel);
      });
    },
  },
});
</script>
