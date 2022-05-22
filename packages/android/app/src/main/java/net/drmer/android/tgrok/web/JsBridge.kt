package net.drmer.android.tgrok.web

import android.util.Log
import android.webkit.JavascriptInterface
import java.lang.reflect.Method

class DesktopBridge(private val webActivity: WebViewActivity) {

    private val serviceMap = HashMap<String, JsService>()

    fun register(service: JsService) {
        register(service::class.java.simpleName, service)
    }

    fun register(name: String, service: JsService) {
        serviceMap[name] = service
    }

    @JavascriptInterface
    fun postMessage(body: String) {
        Log.d(TAG, body)
        val request = JsRequest(webActivity, body)
        if (!request.valid()) {
            return
        }
        val jsService = serviceMap[request.clsName]
        if (null == jsService) {
            Log.e(TAG, request.clsName + " NOT FOUND")
            return
        }
        try {
            var method: Method
            var hasParam = false
            try {
                method = jsService.javaClass.getMethod(request.clsMethod, JsRequest::class.java)
                hasParam = true
            } catch (e: NoSuchMethodException) {
                method = jsService.javaClass.getMethod(request.clsMethod)
            }
            if (!isJsMethod(method)) {
                Log.e(
                    TAG,
                    "Method " + request.clsMethod + " is not callable. Is it marked with @JavascriptInterface?"
                )
                return
            }
            if (hasParam) {
                method.invoke(jsService, request)
            } else {
                method.invoke(jsService)
            }
        } catch (e: NoSuchMethodException) {
            e.printStackTrace()
            Log.e(
                TAG,
                "Method ${request.clsMethod} not found, is it in ${request.clsName}?"
            )
        } catch (e: Exception) {
            e.printStackTrace()
            Log.e(TAG, "Method " + request.clsMethod + " call failed")
        }
    }

    private fun isJsMethod(method: Method): Boolean {
        return method.annotations.asList().any {
            it is JavascriptInterface
        }
    }

    companion object {
        private val TAG: String = DesktopBridge::class.java.simpleName
    }
}
