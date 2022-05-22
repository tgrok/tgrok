package net.drmer.android.tgrok.tgrok

import android.util.Log
import org.apache.commons.lang3.RandomStringUtils
import java.net.Socket

abstract class BaseClient(val host: String, val port: Int) {

    var type = ""

    val name: String = RandomStringUtils.random(8)

    var socket: Socket? = null
        protected set

    open fun start() {

    }

    protected fun info(msg: String) {
        Log.i(TAG, "[$type:$name] $msg")
    }

    companion object {
        private val TAG = "tgrok"
    }
}