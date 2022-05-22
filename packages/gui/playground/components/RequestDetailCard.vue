<template>
  <v-card>
    <v-toolbar
      color="cyan"
      dark
      flat
    >
      <v-toolbar-title>GET /favicon.ico</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <v-icon left>mdi-replay</v-icon>
        Replay
      </v-btn>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            Copy
            <v-icon right>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy link address</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy request headers</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy response headers</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy response</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy as fetch</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy as Node.js fetch</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy as cURL</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy all as fetch</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy all as Node.js fetch</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy all as cURL</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="copy">
            <v-list-item-title>Copy all as HAR</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-tabs v-model="tabReq">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :href="`#tab-req-${tab.name}`"
      >
        {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabReq">
      <v-tab-item
        value="tab-req-summary"
      >
        <v-card flat>
          <v-card-text>Summary</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-req-headers"
      >
        <v-card flat>
          <v-card-text>Headers</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-req-raw"
      >
        <v-card flat>
          <v-card-text>Raw</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-req-binary"
      >
        <v-card flat>
          <v-card-text>Binary</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-divider class="my-5" />

    <v-tabs v-model="tabResp">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :href="`#tab-resp-${tab.name}`"
      >
        {{ tab.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabResp">
      <v-tab-item
        value="tab-resp-summary"
      >
        <v-card flat>
          <v-card-text>Summary</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-resp-headers"
      >
        <v-card flat>
          <v-card-text>Headers</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-resp-raw"
      >
        <v-card flat>
          <v-card-text>Raw</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="tab-resp-binary"
      >
        <v-card flat>
          <v-card-text>Binary</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    tabReq: "tab-req-summary",
    tabResp: "tab-resp-summary",
    tabs: [
      {
        name: "summary",
        title: "Summary",
      },
      {
        name: "headers",
        title: "Headers",
      },
      {
        name: "raw",
        title: "Raw",
      },
      {
        name: "binary",
        title: "Binary",
      },
    ],
  }),
  methods: {
    copy: function() {
    },
  },
});
</script>
