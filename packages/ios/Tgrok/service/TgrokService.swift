//
//  TgrokService.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import SwiftyJSON

class TgrokService: JsService {
    
    static let shared = TgrokService()
    
    private override init() {
        super.init()
    }

    @objc func boot(_ req: JsRequest) {
        tgrok.boot(req.strParam("host"), UInt16(req.intParam("port")))
        DispatchQueue.main.async {
            tgrok.start([])
        }
    }

    @objc func reconnect(_ req: JsRequest) {
        req.callback(true)
    }
    
    @objc func open(_ req: JsRequest) {
        tgrok.openTunnel(Tunnel(req.params))
        req.callback(true)
    }
    
    @objc func close(_ req: JsRequest) {
        req.callback(tgrok.closeTunnel(req.strParam("id")))
    }
    
    @objc func remove(_ req: JsRequest) {
        req.callback(tgrok.removeTunnel(req.strParam("id")))
    }
    
    @objc func status(_ req: JsRequest) {
        req.callback(tgrok.status())
    }
    
}
