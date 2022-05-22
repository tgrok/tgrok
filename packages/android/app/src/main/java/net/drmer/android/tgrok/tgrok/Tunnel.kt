package net.drmer.android.tgrok.tgrok

import org.greenrobot.eventbus.EventBus
import java.util.*

class Tunnel(config: Map<String, Any>) {

    val id = config["id"] as String

    var url: String? = null

    val localHost = config["localHost"] as String
    val localPort = config["localPort"] as Int

    val requestId = UUID.randomUUID().toString()

    var hostname: String? = null
    var subdomain: String? = null
    val protocol = config["protocol"] as String

    var remotePort = 0

    var status = 0
        set(value) {
            field = value
            EventBus.getDefault().post(TgrokEvent(statusJson))
        }

    private val statusJson = mapOf(
        "evt" to "tunnel:status",
        "payload" to mapOf(
            "id" to id,
            "status" to status,
            "url" to url
        )
    )

    val cmdReq = mapOf(
        "Type" to "ReqTunnel",
        "Payload" to mapOf(
            "ReqId" to requestId,
            "Protocol" to protocol,
            "Hostname" to hostname,
            "Subdomain" to subdomain,
            "HttpAuth" to "",
            "RemotePort" to remotePort
        )
    )
}