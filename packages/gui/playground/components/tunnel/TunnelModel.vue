<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    tunnel: {
      name: "",
      protocol: "HTTP",
      subdomain: "",
      localPort: 80,
      localHost: "127.0.0.1",
    },
  }),
  computed: {
    remoteUrl: function() {
      if (!this.tunnel.protocol) {
        return "";
      }
      const protocol = this.tunnel.protocol.toLowerCase();
      // @ts-ignore

      return `${protocol}://${this.tunnel.subdomain}.${this.$store.state.server.host}`;
    },
    localUrl: function() {
      return `${this.tunnel.protocol}://${this.tunnel.localHost}:${this.tunnel.localPort}`;
    },
  },
});
</script>
