package net.drmer.android.tgrok.service

import android.webkit.JavascriptInterface
import net.drmer.android.tgrok.Config
import net.drmer.android.tgrok.web.JsRequest
import net.drmer.android.tgrok.web.JsService

class ConfigService : JsService {

    @JavascriptInterface
    fun flush(req: JsRequest) {
        Config.instance.flush()
        req.callback(true)
    }

    @JavascriptInterface
    fun get(req: JsRequest) {
        req.callback(Config.instance.get(req.strParam("key")))
    }

    @JavascriptInterface
    fun set(req: JsRequest) {
        Config.instance.set(req.strParam("key"), req.params!!["value"])
        req.callback(true)
    }

    @JavascriptInterface
    fun load(req: JsRequest) {
        req.callback(Config.instance.load())
    }

}