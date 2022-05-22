//
//  IntExtensions.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation

extension Int {
    
    func to8Bytes() -> [UInt8] {
        let UInt = UInt64.init(Double.init(self))
        return [UInt8(truncatingIfNeeded: UInt >> 56),
            UInt8(truncatingIfNeeded: UInt >> 48),
            UInt8(truncatingIfNeeded: UInt >> 40),
            UInt8(truncatingIfNeeded: UInt >> 32),
            UInt8(truncatingIfNeeded: UInt >> 24),
            UInt8(truncatingIfNeeded: UInt >> 16),
            UInt8(truncatingIfNeeded: UInt >> 8),
            UInt8(truncatingIfNeeded: UInt)]
    }
    
    func toData() -> Data {
        var bytes = to8Bytes()
        bytes.reverse()
        return Data(bytes: bytes, count: 8)
    }
    
}
