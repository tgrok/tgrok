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
        <v-toolbar-title>Config</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-form @submit="save">
          <v-row class="mx-2">
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                label="Ngrok host"
                clearable
                v-model="server.host"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                label="Port"
                v-model="server.port"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                @click="save"
              >
                <v-icon left>mdi-check</v-icon>
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import { cloneDeep } from "lodash";

export default Vue.extend({
  name: "SettingDialog",
  data: () => ({
    dialog: false,
    server: {
      host: "",
      port: "",
    },
  }),
  methods: {
    show: function() {
      this.dialog = true;
      this.server = cloneDeep(this.$store.state.server);
    },
    save: function() {
      this.dialog = false;
      this.$store.dispatch("editServer", cloneDeep(this.server));
    },
  },
});
</script>
