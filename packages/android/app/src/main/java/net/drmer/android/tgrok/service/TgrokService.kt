package net.drmer.android.tgrok.service

import android.webkit.JavascriptInterface
import net.drmer.android.tgrok.web.JsRequest
import net.drmer.android.tgrok.web.JsService

class TgrokService : JsService {

    @JavascriptInterface
    fun connect(req: JsRequest) {
        req.callback(true)
    }

    @JavascriptInterface
    fun open(req: JsRequest) {
        req.callback(true)
    }

    @JavascriptInterface
    fun close(req: JsRequest) {
        req.callback(true)
    }

    @JavascriptInterface
    fun remove(req: JsRequest) {
        req.callback(true)
    }

    @JavascriptInterface
    fun status(req: JsRequest) {
        req.callback(mapOf(
            "status" to 0,
            "tunnels" to emptyList<Any>()
        ))
    }

}