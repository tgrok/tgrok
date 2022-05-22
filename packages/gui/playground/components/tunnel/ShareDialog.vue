<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-toolbar dark color="success">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Share</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-img class="mt-2" :src="qrcodeUrl" />
        <v-text-field
          readonly
          label="Remote url"
          persistent-hint
          append-icon="mdi-content-copy"
          @click:append="copy"
          :success="!!this.message"
          :messages="message"
          :value="remoteUrl"
        >
        </v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import QRCode from "qrcode";
import Vue from "vue";
import { timeout } from "@tgrok/utils";
import TunnelModel from "./TunnelModel.vue";
import { write } from "clipboardy";

export default Vue.extend({
  extends: TunnelModel,
  data: () => ({
    dialog: false,
    qrcodeUrl: "",
    message: "",
  }),
  methods: {
    show: async function(tunnel) {
      this.dialog = true;
      this.tunnel = tunnel;
      this.qrcodeUrl = await QRCode.toDataURL(this.remoteUrl);
    },
    copy: async function() {
      await write(this.remoteUrl);
      this.message = "Copied!";
      await timeout(3000);
      this.message = "";
    },
  },
});
</script>
