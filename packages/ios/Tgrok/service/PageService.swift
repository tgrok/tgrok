//
//  PageService.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import UIKit
import SwiftyJSON

class PageService: JsService {
    
    @objc func config(_ req: JsRequest) {
        req.callback([
            "header": 0,
        ])
    }
    
    @objc func external(_ req: JsRequest) {
        guard let url = URL(string: req.strParam("url")) else {
            req.callback(false)
            return
        }
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        }
        req.callback(true)
    }
    
}
