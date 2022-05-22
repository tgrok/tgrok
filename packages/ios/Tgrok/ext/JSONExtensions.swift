//
//  JSONExtensions.swift
//  PipiJr
//
//  Created by Yueyu on 2018/11/22.
//  Copyright © 2018 drmer.net. All rights reserved.
//

import Foundation
import SwiftyJSON

extension JSON {
    var desc: String {
        return self.rawString(.utf8, options: .init(rawValue: 0))!
    }
}
