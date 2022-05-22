//
//  DataExtensions.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation

extension Data {
    
    func toUIntLE() -> Int {
        var value : UInt32 = 0
        let data = NSData(data: self)
        data.getBytes(&value, length: self.count)
        value = UInt32(littleEndian: value)
        return Int(value)
    }
    
}
