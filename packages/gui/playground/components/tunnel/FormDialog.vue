<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="600px"
  >
    <v-card>
      <v-toolbar dark color="success">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ inEdit ? "Edit" : "Create" }} Tunnel</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row class="mx-2">
          <v-col
            cols="12"
          >
            <v-text-field
              label="Name"
              clearable
              persistent-hint
              hint="Your own tunnel name"
              v-model="tunnel.name"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              label="Subdomain"
              v-model="tunnel.subdomain"
              persistent-hint
              :hint="`Your request url will be ${remoteUrl}`"
              append-icon="mdi-cached"
              @click:append="randomSubdomain"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              label="Local host"
              clearable
              persistent-hint
              hint="Ip address or other domain"
              v-model="tunnel.localHost"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              label="Local port"
              type="number"
              clearable
              v-model="tunnel.localPort"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="text-right">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              @click="save"
            >
              <v-icon left>mdi-check</v-icon>
              {{ inEdit ? "Save" : "Create" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import TunnelModel from "./TunnelModel.vue";
import { Tunnel } from "../../Tunnel";
import { cloneDeep } from "lodash";

export default Vue.extend({
  name: "TunnelDialog",
  extends: TunnelModel,
  data: () => ({
    dialog: false,
    inEdit: true,
  }),
  methods: {
    show: function(tunnel) {
      this.inEdit = !!tunnel;
      if (!tunnel) {
        tunnel = new Tunnel();
        tunnel.subdomain = Tunnel.randomDomain();
      }
      this.tunnel = cloneDeep(tunnel);
      this.dialog = true;
    },
    save: function() {
      this.dialog = false;
      this.$store.dispatch("editTunnel", this.tunnel);
      if (!this.inEdit) {
        // if this tunnel is newly created, start it right now
        this.$store.dispatch("openTunnel", this.tunnel.id);
      }
    },
    randomSubdomain: function() {
      this.tunnel.subdomain = Tunnel.randomDomain();
    },
  },
});
</script>
