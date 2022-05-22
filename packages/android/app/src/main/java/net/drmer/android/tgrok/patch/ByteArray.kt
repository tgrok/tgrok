package net.drmer.android.tgrok.patch

import java.math.BigInteger

fun ByteArray.readUInt32LE(): Int {

    return BigInteger(reversedArray()).toInt()

}

fun ByteArray.writeUInt32LE(value: Long): ByteArray {
    BigInteger.valueOf(value).toByteArray().reversedArray().copyInto(this)
    return this
}

fun ByteArray.toHexString(): String {
    return joinToString(" ") {
        "%02X".format(it)
    }
}