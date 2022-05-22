package net.drmer.android.tgrok

import android.content.Context
import com.google.gson.Gson
import java.io.File

class Config private constructor(private val context: Context) {

    private val file = File(context.filesDir, ".tgrok")

    private val config: HashMap<String, Any?>

    init {
        config = if (file.exists()) {
            @Suppress("UNCHECKED_CAST")
            Gson().fromJson(file.readText(), Map::class.java) as HashMap<String, Any?>
        } else {
            hashMapOf(
                "server" to mapOf(
                    "host" to "t.drmer.net",
                    "port" to 4443
                ),
                "tunnels" to emptyList<Any>()
            )
        }
    }

    fun flush() {
        context.openFileOutput(file.name, Context.MODE_PRIVATE).use {
            it.write(Gson().toJson(config).toByteArray())
        }
    }

    fun get(key: String): Any? {
        return config[key]
    }

    fun set(key: String, value: Any?) {
        config[key] = value
    }

    fun load(): HashMap<String, Any?> {
        return config
    }

    companion object {
        lateinit var instance: Config
            private set

        fun makeInstance(context: Context) {
            instance = Config(context)
        }
    }

}