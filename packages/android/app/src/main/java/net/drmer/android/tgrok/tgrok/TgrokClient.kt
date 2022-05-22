package net.drmer.android.tgrok.tgrok

import android.util.Log
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import net.drmer.android.tgrok.patch.readUInt32LE
import net.drmer.android.tgrok.patch.writeUInt32LE
import java.lang.StringBuilder
import javax.net.ssl.SSLSocketFactory

open class TgrokClient(host: String, port: Int) : BaseClient(host, port) {

    private val stringBuilder = StringBuilder()

    override fun start() {
        socket = SSLSocketFactory.getDefault().run {
            createSocket(host, port)
        }
        super.start()

        val connected = socket!!.isConnected
        if (!connected) {
            Log.e(TAG, "socket connected")
            return
        }
        onConnect()
        GlobalScope.launch {
            val buffer = ByteArray(512)
            var length: Int
            val inputStream = socket!!.getInputStream()
            while (inputStream.read(buffer).also { length = it } > 0) {
                onData(buffer.sliceArray(IntRange(0, length - 1)))
            }
        }
    }

    open fun onConnect() {

    }

    private suspend fun onData(data: ByteArray) {
        stringBuilder.append(String(data))
        if (stringBuilder.length < 8) {
            return
        }
        val headBuffer = stringBuilder.substring(0, 7).toByteArray()
        val length = headBuffer.readUInt32LE()
        if (stringBuilder.length < 8 + length) {
            return
        }
        Log.d(TAG, "reading message with length: $length")
        val raw = stringBuilder.substring(8, 8 + length)
        Log.d(TAG, "reading message: $raw")
        stringBuilder.delete(0, 8 + length)
        Log.d(TAG, stringBuilder.toString())
        withContext(Dispatchers.IO) {
            onMessage(raw)
        }
    }

    open fun onMessage(message: String) {
        Log.d(TAG, "recv <<<< $message")
    }

    fun sendData(data: Any) {
        sendData(Gson().toJson(data))
    }

    private fun sendData(data: String) {
        if (this.socket == null) {
            return
        }
        val headBuffer = ByteArray(8).writeUInt32LE(data.length.toLong())
        socket!!.getOutputStream().let {
            it.write(headBuffer)
            it.write(data.toByteArray())
        }
    }

    companion object {
        private val TAG = TgrokClient::class.java.simpleName
    }
}