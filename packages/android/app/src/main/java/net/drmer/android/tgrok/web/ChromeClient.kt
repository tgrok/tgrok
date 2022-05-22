package net.drmer.android.tgrok.web

import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.appcompat.app.AlertDialog

class ChromeClient(private val activity: WebViewActivity) : WebChromeClient() {

    override fun onConsoleMessage(cm: ConsoleMessage): Boolean {
        Log.e(LOG_TAG, "JavaScript log, " + cm.sourceId() + ":" + cm.lineNumber() + ", " + cm.message())
        return true
    }

    override fun onJsAlert(view: WebView, url: String, message: String, result: JsResult): Boolean {
        val dialog = AlertDialog.Builder(activity)
            .setTitle("提示").setMessage(message)
            .setPositiveButton("确定") { dialog, _ ->
                result.confirm()
                dialog.dismiss()
            }.setCancelable(false).create()
        dialog.show()
        return true
    }

    override fun onJsConfirm(view: WebView, url: String, message: String, result: JsResult): Boolean {
        AlertDialog.Builder(activity)
            .setTitle("提示").setMessage(message)
            .setPositiveButton("确定") { dialog, _ ->
                result.confirm()
                dialog.dismiss()
            }.setNegativeButton("取消") { dialog, _ ->
                result.cancel()
                dialog.dismiss()
            }.setCancelable(false).create().show()
        return true
    }

    companion object {
        private val LOG_TAG = ChromeClient::class.java.simpleName
    }

}
