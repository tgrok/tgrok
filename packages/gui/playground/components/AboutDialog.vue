<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-toolbar dark color="success">
          <v-toolbar-title>About</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pt-4">
          Tgrok is a tunneling service.
          <div class="text-center mt-2">
            <v-btn icon class="mx-1" v-for="link in links" :key="link.url" @click="openLink(link.url)">
              <v-icon>{{ link.icon }}</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    dialog: false,
    links: [
      {
        icon: "mdi-github",
        url: "https://github.com/tgrok",
      },
      {
        icon: "mdi-twitter",
        url: "https://twitter.com/yueyuzhao",
      },
    ],
  }),
  methods: {
    show: function() {
      this.dialog = true;
    },
  },
});
</script>
