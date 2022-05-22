package net.drmer.android.tgrok

import android.app.Application

class TgrokApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        Config.makeInstance(this)
    }

}