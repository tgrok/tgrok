package net.drmer.android.tgrok

import android.os.Bundle
import com.google.gson.Gson
import net.drmer.android.tgrok.service.ConfigService
import net.drmer.android.tgrok.service.PageService
import net.drmer.android.tgrok.service.TgrokService
import net.drmer.android.tgrok.tgrok.ControlClient
import net.drmer.android.tgrok.tgrok.TgrokEvent
import net.drmer.android.tgrok.web.WebViewActivity
import org.greenrobot.eventbus.Subscribe

class MainActivity : WebViewActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
//        homeUrl = "http://192.168.10.147:8080/"
        super.onCreate(savedInstanceState)

        val thread = Thread {
            val client = ControlClient(mapOf(
                "host" to "t.drmer.net",
                "port" to 4443
            ), emptyArray())
            client.start()
        }
        thread.start()
    }

    override fun installBridge() {
        super.installBridge()

        jsBridge.register(PageService(this))
        jsBridge.register(ConfigService())
        jsBridge.register(TgrokService())
    }

    override fun onBackPressed() {
//        super.onBackPressed()
        webView.reload()
    }

    @Subscribe
    fun onTgrokEvent(event: TgrokEvent) {
        val json = Gson().toJson(event.payload)
        val format = "drmer.emit('%@', %@);"
        val js = String.format(format, "tgrok", json)
        this.runJavaScript(js)
    }
}
