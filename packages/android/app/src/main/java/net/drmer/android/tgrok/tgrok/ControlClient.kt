package net.drmer.android.tgrok.tgrok

import android.util.Log
import com.google.gson.Gson
import org.apache.commons.lang3.StringUtils
import org.greenrobot.eventbus.EventBus
import java.util.*
import kotlin.concurrent.timerTask

class ControlClient(config: Map<String, Any>, tunnels: Array<Tunnel>) : TgrokClient(config["host"].toString(), config["port"] as Int) {

    var clientId: String = ""
        private set

    var timer: Timer? = null

    var status = 0
        set(value) {
            field = value
            EventBus.getDefault().post(TgrokEvent(mapOf(
                "evt" to "control:status",
                "payload" to value
            )))
        }

    private val cmdPing = mapOf(
        "Type" to "Ping",
        "Payload" to emptyMap<String, Any>()
    )

    private val cmdAuth = mapOf(
        "Type" to "Auth",
        "Payload" to mapOf(
            "Version" to "2",
            "MmVersion" to "1.7",
            "User" to "",
            "Password" to "",
            "OS" to "Android",
            "Arch" to "amd64",
            "ClientId" to this.clientId
        )
    )

    var tunnelList: MutableList<Tunnel>

    init {
        type = "ctl"
        tunnelList = tunnels.toMutableList()
    }

    override fun onConnect() {
        super.onConnect()
        this.status = 2
        sendData(cmdAuth)
    }

    fun clearTimer() {
        timer?.cancel()
    }

    override fun onMessage(message: String) {
        super.onMessage(message)
        val data = Gson().fromJson(message, Map::class.java)
        val payload = data["Payload"] as Map<String, Any>
        when (data["Type"]) {
            "AuthResp" -> onAuth(payload)
            "ReqProxy" -> onReqProxy(payload)
            "NewTunnel" -> onNewTunnel(payload)
        }
    }

    private fun onAuth(payload: Map<String, Any>) {
        this.clientId = payload["ClientId"] as String
        val error = payload["Error"] as String
        EventBus.getDefault().post(TgrokEvent(mapOf(
            "evt" to "auth:resp",
            "payload" to error
        )))
        if (!StringUtils.isEmpty(error)) {
            this.status = 6
            return
        }
        this.status = 10
        // start timer
        startTimer()
        // register tunnels
        registerTunnels()
    }

    private fun startTimer() {
        if (timer != null) {
            return
        }
        timer = Timer()
        Timer().schedule(timerTask {
            sendData(cmdPing)
        }, 1000L * 20, 1000L * 20)
    }

    private fun registerTunnels() {
        this.tunnelList.forEach {
            registerTunnel(it)
        }
    }

    private fun registerTunnel(tunnel: Tunnel) {
        tunnel.status = 6
        sendData(tunnel.cmdReq)
    }

    private fun onReqProxy(payload: Map<String, Any>) {
        EventBus.getDefault().post(TgrokEvent(mapOf(
            "evt" to "proxy:req",
            "payload" to payload["Error"]
        )))
        val proxy = ProxyClient(host, port, this)
        proxy.start()
    }

    private fun onNewTunnel(payload: Map<String, Any>) {
        val error = payload["Error"] as String
        EventBus.getDefault().post(TgrokEvent(mapOf(
            "evt" to "tunnel:resp",
            "payload" to error
        )))

        if (StringUtils.isNotEmpty(error)) {
            Log.i(TAG, "Add tunnel failed, $error")
            return
        }
        val requestId = payload["ReqId"] as String
        val tunnel = tunnelList.firstOrNull {
            it.requestId == requestId
        }
        if (tunnel == null) {
            Log.e(TAG, "No tunnel found for requestId $requestId")
            return
        }
        tunnel.url = payload["Url"] as String
        tunnel.status = 10
        Log.i(TAG, "Add tunnel OK, type: ${payload["Protocol"]} url: ${payload["Url"]}")
    }

    fun openTunnel(tunnel: Tunnel) {
        info("opening tunnel for ${tunnel.subdomain}")
        val oldTunnel = tunnelList.firstOrNull {
            it.id == tunnel.id
        }
        if (oldTunnel != null) {
            if (oldTunnel.status != 0) {
                return
            }
            tunnelList.remove(oldTunnel)
        }
        tunnelList.add(tunnel)
        if (oldTunnel != null && oldTunnel.subdomain == tunnel.subdomain && StringUtils.isNotBlank(oldTunnel.url)) {
            // tunnel is already successfully registered
            tunnel.url = oldTunnel.url
            tunnel.status = 10
            return
        }
        registerTunnel(tunnel)
    }

    fun closeTunnel(id: String) {
        info("closing tunnel for $id")
        val tunnel = tunnelList.firstOrNull {
            it.id == id
        }
        tunnel?.status = 0
        EventBus.getDefault().post(TgrokEvent(mapOf(
            "evt" to "tunnel:closed",
            "payload" to id
        )))
    }

    fun removeTunnel(id: String) {
        tunnelList.removeAll {
            it.id == id
        }
        EventBus.getDefault().post(TgrokEvent(mapOf(
            "evt" to "tunnel:removed",
            "payload" to id
        )))
    }

    companion object {
        private val TAG = ControlClient::class.java.simpleName
    }
}