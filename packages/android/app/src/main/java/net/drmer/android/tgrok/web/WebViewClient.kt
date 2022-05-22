package net.drmer.android.tgrok.web

import android.annotation.TargetApi
import android.util.Log
import android.webkit.*
import android.webkit.WebViewClient as BaseWebViewClient

class WebViewClient(val activity: WebViewActivity): BaseWebViewClient() {

    override fun onReceivedError(view: WebView, errorCode: Int, description: String, failingUrl: String) {
        Log.e(LOG_TAG, description)
    }

    override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
        return super.shouldInterceptRequest(view, request)
    }

    @TargetApi(21)
    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
        return shouldOverrideUrlLoading(view, request.url.toString())
    }

    override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
        return activity.shouldOverrideUrlLoading(view, url)
    }

    override fun onPageFinished(view: WebView, url: String) {
        // Sync cookies
        CookieSyncManager.getInstance().sync()
    }

    companion object {
        private val LOG_TAG = WebViewClient::class.java.simpleName
    }
}
