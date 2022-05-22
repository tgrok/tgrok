package net.drmer.android.tgrok

import net.drmer.android.tgrok.patch.toHexString
import net.drmer.android.tgrok.patch.readUInt32LE
import net.drmer.android.tgrok.patch.writeUInt32LE
import org.junit.Assert
import org.junit.Test

class ByteArrayTest {

    @Test
    fun readUInt32LE() {
        val data = ByteArray(8)
        data[0] = 0x12
        data[1] = 0x98.toByte()
        data[2] = 0x67
        data[3] = 0x45
        Assert.assertEquals("12 98 67 45 00 00 00 00", data.toHexString())
        Assert.assertEquals(0x45679812, data.readUInt32LE())
    }

    @Test
    fun writeUInt32LE() {
        val data = ByteArray(8)
        data.writeUInt32LE(0x45679812L)
        Assert.assertEquals("12 98 67 45 00 00 00 00", data.toHexString())
        Assert.assertEquals("[18, -104, 103, 69, 0, 0, 0, 0]", data.contentToString())
    }

}