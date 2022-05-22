package net.drmer.android.tgrok.patch

import java.net.Socket

fun Socket.pipe(socket: Socket?) {
    if (socket == null) {
        return
    }
    val buffer = ByteArray(1024) // Adjust if you want

    var bytesRead: Int
    while (getInputStream().read(buffer).also { bytesRead = it } != -1) {
        socket.getOutputStream().write(buffer, 0, bytesRead)
    }

}