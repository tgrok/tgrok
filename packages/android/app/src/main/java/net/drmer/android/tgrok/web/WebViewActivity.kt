package net.drmer.android.tgrok.web

import android.os.Build
import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import butterknife.BindView
import butterknife.ButterKnife
import net.drmer.android.tgrok.R
import org.apache.commons.lang3.StringUtils

open class WebViewActivity : AppCompatActivity() {

    var layoutView = R.layout.activity_web

    @BindView(R.id.webView)
    lateinit var webView: WebView

    lateinit var jsBridge: DesktopBridge

    var homeUrl = "index.html"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(layoutView)

        ButterKnife.bind(this)

        configWebView()

        installBridge()

        loadUrl(homeUrl)
    }

    fun loadUrl(url: String?) {
        if (null == url || StringUtils.isEmpty(url.trim())) {
            return
        }
        val fullUrl = if (!url.startsWith("file:///") && !url.startsWith("http")) {
            "file:///android_asset/www/$url"
        } else {
            url
        }
        webView.loadUrl(fullUrl)
    }

    private fun configWebView() {
        webView.settings.let {
            it.javaScriptEnabled = true
            it.domStorageEnabled = true
            it.builtInZoomControls = false
            it.displayZoomControls = false
            it.loadWithOverviewMode = false
            it.useWideViewPort = false
            it.allowFileAccess = true
            it.allowContentAccess = true
        }
        WebView.setWebContentsDebuggingEnabled(true)
        webView.webViewClient = WebViewClient(this)
        webView.webChromeClient = ChromeClient(this)
    }

    open fun installBridge() {
        jsBridge = DesktopBridge(this)
        webView.addJavascriptInterface(jsBridge, "jsBridge")
    }

    open fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
        return true
    }

    /**
     * Run the given JavaScript in the web view.
     */
    fun runJavaScript(js: String) {
        runOnUiThread {
            if (Build.VERSION.SDK_INT >= 19) {
                webView.evaluateJavascript(js, null)
            } else {
                webView.loadUrl("javascript:$js")
            }
        }
    }

}
