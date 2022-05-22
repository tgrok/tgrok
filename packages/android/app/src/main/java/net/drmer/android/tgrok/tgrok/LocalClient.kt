package net.drmer.android.tgrok.tgrok

import net.drmer.android.tgrok.patch.pipe
import java.net.Socket

class LocalClient(private val proxyClient: ProxyClient, tunnel: Tunnel) : BaseClient(tunnel.localHost, tunnel.localPort) {

    init {
        type = "prv"
    }

    override fun start() {
        socket = Socket(host, port)
        super.start()

        socket?.let {
            it.pipe(proxyClient.socket)
            proxyClient.socket?.pipe(it)
        }
    }

}