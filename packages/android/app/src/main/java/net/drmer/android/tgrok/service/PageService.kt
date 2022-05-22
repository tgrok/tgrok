package net.drmer.android.tgrok.service

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.webkit.JavascriptInterface
import net.drmer.android.tgrok.web.JsRequest
import net.drmer.android.tgrok.web.JsService

class PageService(private val activity: Activity) : JsService {

    @JavascriptInterface
    fun external(req: JsRequest) {
        activity.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(req.strParam("url"))))
        req.callback(true)
    }

    @JavascriptInterface
    fun config(req: JsRequest) {
        req.callback(mapOf(
            "header" to 0
        ))
    }

}