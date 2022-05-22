import Vue from "vue";
import Vuex from "vuex";
import { find, cloneDeep, findIndex } from "lodash";
import { TunnelStatus, ControlStatus } from "@tgrok/shared";
import { config } from "./config";
import { drmer } from "./drmer";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: ControlStatus.PENDING,
    server: {
      host: "", // ngrok server host
      port: "", // ngrok server port
    },
    tunnels: [],
    deletingId: "",
  },
  mutations: {
    setStatus: function(state, payload) {
      state.status = payload;
    },
    setDeletingId: function(state, payload) {
      state.deletingId = payload;
    },
    tunnelOpened: function(state, payload) {
      const tunnel: any = find(state.tunnels, {
        id: payload.id,
      });

      if (!tunnel) {
        return;
      }
      tunnel.status = TunnelStatus.CONNECTED;
    },
    tunnelClosed: function(state, payload) {
      const tunnel: any = find(state.tunnels, {
        id: payload,
      });

      if (!tunnel) {
        return;
      }
      tunnel.status = TunnelStatus.DISCONNECTED;
    },
    setTunnelStatus: function(state, payload) {
      const tunnel: any = find(state.tunnels, {
        id: payload.id,
      });

      if (!tunnel) {
        return;
      }
      tunnel.status = payload.status;
      tunnel.url = payload.url;
    },
  },
  actions: {
    load: async function({ state }) {
      const conf: any = config.load();

      state.server = conf.server;
      const tunnels = conf.tunnels;

      tunnels.forEach((tunnel: any) => {
        tunnel.status = TunnelStatus.DISCONNECTED;
      });
      state.tunnels = tunnels;
    },
    saveTunnels: function({ state }) {
      const tunnels = cloneDeep(state.tunnels);

      tunnels.forEach((tunnel: any) => {
        delete tunnel.status;
      });
      config.set("tunnels", tunnels);
    },
    editTunnel: function({ state }, tunnel: any) {
      const tunnels: any[] = state.tunnels;
      const index = findIndex(tunnels, {
        id: tunnel.id,
      });

      if (index < 0) {
        tunnels.push(tunnel);
      } else {
        tunnels.splice(index, 1, tunnel);
      }
      this.dispatch("saveTunnels");
    },
    deleteTunnel: function({ state }, id) {
      const tunnels: any[] = state.tunnels;
      const index = findIndex(tunnels, {
        id,
      });

      tunnels.splice(index, 1);
      drmer.run("TgrokService@remove", {
        id,
      });
      this.dispatch("saveTunnels");
    },
    openTunnel: async function({ state }, payload) {
      const tunnel: any = find(state.tunnels, {
        id: payload.id,
      });

      if (!tunnel) {
        return;
      }
      tunnel.paused = false;
      tunnel.status = TunnelStatus.CONNECTING;
      drmer.run("TgrokService@open", tunnel);
      this.dispatch("saveTunnels");
    },
    closeTunnel: async function({ state }, payload) {
      const tunnel: any = find(state.tunnels, {
        id: payload,
      });

      if (!tunnel) {
        return;
      }
      tunnel.paused = true;
      tunnel.status = TunnelStatus.DISCONNECTING;
      drmer.run("TgrokService@close", {
        id: payload,
      });
      this.dispatch("saveTunnels");
    },
    editServer: function({ state }, payload) {
      state.server = payload;
      config.set("server", payload);
    },
  },
  modules: {},
});
