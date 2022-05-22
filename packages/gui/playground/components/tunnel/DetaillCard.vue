<template>
  <v-card class="mx-auto" :class="{ 'animate__animated animate__headShake animate__infinite	infinite': shaking }">
    <v-list-item>
      <v-list-item-avatar
        :color="color"
        :class="{'animate__animated animate__pulse animate__infinite	infinite': changing}"
      />
      <v-list-item-content>
        <v-list-item-title class="headline">{{ tunnel.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ tunnel.protocol }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on" @click="$emit('show')" class="subtitle-1 mr-4 d-none">
            1212
          </span>
        </template>
        <span>Show requests</span>
      </v-tooltip>
    </v-list-item>

    <v-card-text class="text-center">
      <v-row>
        <v-col cols="12" sm="6" class="text-left text-sm-right py-0">
          <a href="javascript:;" @click="openLink(remoteUrl)">{{ remoteUrl }}</a>
        </v-col>
        <v-col cols="12" sm="1" class="text-center py-0 d-none d-sm-block">
          <v-icon small>mdi-transfer-right</v-icon>
        </v-col>
        <v-col cols="12" sm="5" class="text-right text-sm-left py-0">
          <v-icon small class="mr-5 d-inline d-sm-none">mdi-transfer-right</v-icon>
          <a href="javascript:;" @click="openLink(localUrl)">{{ localUrl }}</a>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions class="d-flex justify-space-between">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="toggle" :disabled="!ready || changing">
            <v-icon>{{ toggleIcon }}</v-icon>
          </v-btn>
        </template>
        <span>Toggle status</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" :disabled="!canEdit" @click="$emit('edit')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Edit tunnel</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="$emit('share')">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <span>Share</span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="remove">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";
import { timeout, isiOS } from "@tgrok/utils";
import TunnelModel from "./TunnelModel.vue";

export default Vue.extend({
  data: () => ({
    changing: false,
  }),
  extends: TunnelModel,
  props: {
    model: {
      type: Object,
      default: null,
    },
  },
  watch: {
    model: function(val) {
      this.tunnel = val;
    },
    "tunnel.status": async function(val) {
      if ([0, 10].indexOf(val) < 0) {
        this.changing = true;

        return;
      }
      await timeout(1000 * 2);
      this.changing = false;
    },
  },
  computed: {
    ready: function() {
      return this.$store.state.status === 10;
    },
    shaking: function() {
      return !isiOS() && this.tunnel.id === this.$store.state.deletingId;
    },
    color: function() {
      if (this.tunnel.status < 5) {
        return "grey";
      }

      return "success";
    },
    toggleIcon: function() {
      if (this.tunnel.status < 5) {
        return "mdi-play";
      }

      return "mdi-stop";
    },
    canEdit: function() {
      return this.tunnel.status === 0;
    },
  },
  mounted() {
    this.tunnel = this.model;
  },
  methods: {
    edit: function() {
      this.$root.editTunnel(this.tunnel);
    },
    showRequests: function() {
      this.$root.showRequests(this.tunnel);
    },
    remove: function() {
      this.$store.commit("setDeletingId", this.tunnel.id);
      this.$emit("delete");
    },
    toggle: function() {
      if (this.tunnel.paused) {
        this.$store.dispatch("openTunnel", this.tunnel);
      } else {
        this.$store.dispatch("closeTunnel", this.tunnel.id);
      }
    },
  },
});
</script>
