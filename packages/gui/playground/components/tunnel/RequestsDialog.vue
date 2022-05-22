<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="success">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Requests of {{ tunnel.subdomain }}</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-card
              class="mx-auto"
            >
              <v-toolbar
                color="cyan"
                dark
              >
                <v-toolbar-title>All requests</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-view-module</v-icon>
                </v-btn>
              </v-toolbar>

              <v-list two-line>
                <v-list-item-group>
                  <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    selectable
                  >
                    <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                      <v-icon>mdi-send</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="item.title"></v-list-item-title>
                      <v-list-item-subtitle class="d-flex justify-space-between">
                        <span class="font-weight-medium">200 OK</span>
                        <span><v-icon small>mdi-clock-outline</v-icon> Duration: 2.13ms</span>
                        <span><v-icon small>mdi-account</v-icon> IP: 127.0.0.1</span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" hidden class="d-md-block">
            <request-detail-card />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TunnelModel from "./TunnelModel.vue";
import RequestDetailCard from "../RequestDetailCard.vue";

export default Vue.extend({
  extends: TunnelModel,
  components: {
    RequestDetailCard,
  },
  data: () => ({
    dialog: false,
    requests: [
      {},
    ],
    items: [
      { title: "GET /", subtitle: "Jan 9, 2014" },
      { title: "GET /favicon.ico", subtitle: "Jan 17, 2014" },
    ],
  }),
  methods: {
    show: function(tunnel: any) {
      this.dialog = true;
      // @ts-ignore
      this.tunnel = tunnel;
    },
  },
});
</script>
