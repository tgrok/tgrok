<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">Remove this tunnel?</v-card-title>

      <v-card-text>
        You will not be able to recover this tunnel after removal.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="grey darken-1"
          text
          @click="dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="red darken-1"
          text
          @click="confirm"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    dialog: false,
    tunnel: {},
  }),
  watch: {
    dialog: function(val) {
      if (val) {
        return;
      }
      this.$store.commit("setDeletingId", undefined);
    },
  },
  methods: {
    show: function(tunnel) {
      this.dialog = true;
      this.tunnel = tunnel;
    },
    confirm: function() {
      this.dialog = false;
      this.$store.dispatch("deleteTunnel", this.tunnel.id);
    },
  },
});
</script>
