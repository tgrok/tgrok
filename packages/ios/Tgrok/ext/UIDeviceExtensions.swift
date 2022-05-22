//
//  UIDeviceExtensions.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/17.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import UIKit

extension UIDevice {
    
    static func headerHeight() -> CGFloat {
        return isNotchScreen() ? CGFloat(50) : CGFloat(20)
    }
    
    static func isNotchScreen() -> Bool {
        if UIDevice.current.userInterfaceIdiom == .pad {
            return false
        }
        
        let size = UIScreen.main.bounds.size
        let notchValue: Int = Int(size.width/size.height * 100)
        
        return 216 == notchValue || 46 == notchValue
    }
    
}
