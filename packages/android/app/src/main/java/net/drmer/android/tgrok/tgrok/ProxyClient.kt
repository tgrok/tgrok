package net.drmer.android.tgrok.tgrok

class ProxyClient(host: String, port: Int, private val controlClient: ControlClient) : TgrokClient(host, port) {

    init {
        type = "pxy"
    }

}