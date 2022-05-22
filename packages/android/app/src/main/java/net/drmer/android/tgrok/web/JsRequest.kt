package net.drmer.android.tgrok.web

import android.os.Build
import com.google.gson.Gson
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject

class JsRequest(private val activity: WebViewActivity, body: String) {

    var clsName: String? = null
        private set

    var clsMethod: String = ""

    var id: String? = null
        private set

    var params: JSONObject? = null
        private set

    init {
        val jsonObject = JSONObject(body)
        if (jsonObject.has("method")) {
            val method = jsonObject.optString("method").split("@".toRegex()).toTypedArray()
            clsName = method[0]
            clsMethod = method[1]
            id = jsonObject.optString("id")
            params = jsonObject.optJSONObject("params")
        }
    }

    fun valid(): Boolean {
        return StringUtils.isNotEmpty(clsName) && StringUtils.isNotEmpty(clsMethod)
    }

    fun intParam(key: String): Int {
        return params!!.optInt(key)
    }

    fun strParam(key: String): String {
        return params!!.optString(key)
    }

    fun objParam(key: String): JSONObject {
        return params!!.optJSONObject(key)
    }

    fun arrParam(key: String): JSONArray {
        return params!!.optJSONArray(key)
    }

    fun boolParam(key: String): Boolean {
        return params!!.optBoolean(key, false)
    }

    fun jsonParam(key: String): JSONObject {
        val res = strParam(key)
        return JSONObject(res)
    }

    fun lngParam(key: String): Long {
        return params!!.optLong(key)
    }

    fun callback(result: String) {
        if (null == id) {
            return
        }
        runJs(String.format("drmer.dequeue('%s', '%s');", id, result))
    }

    fun callback(model: Any?) {
        val json = when (model) {
            is JSONObject -> model.toString()
            is JSONArray -> model.toString()
            else -> Gson().toJson(model)
        }
        runJs(String.format("drmer.dequeue('%s', %s);", id, json))
    }

    private fun runJs(js: String) {
        val webView = activity.webView
        webView.post {
            if (Build.VERSION.SDK_INT >= 19) {
                webView.evaluateJavascript(js, null)
            } else {
                webView.loadUrl("javascript:$js")
            }
        }
    }

}
