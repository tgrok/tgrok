//
//  ProxyClient.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import Network
import SwiftyJSON

class ProxyClient: TgrokClient {
    
    var controller: ControlClient
    
    init(_ host: String, _ port: UInt16, ctl: ControlClient) {
        self.controller = ctl
        super.init(host, port)
        type = "pxy"
    }
    
    override func onReady() {
        super.onReady()
        
        self.send(self.regProxy())
    }
    
    override func onData(_ json: JSON) {
        super.onData(json)
        
        if json["Type"].stringValue != "StartProxy" {
            return
        }
        
        self.paused = true
        
        let payload = json["Payload"].dictionaryValue
        let url = payload["Url"]?.string
        var tunnel: Tunnel?
        for i in 0..<controller.tunnels.count {
            if controller.tunnels[i].url == url {
                tunnel = controller.tunnels[i]
            }
        }
        if tunnel == nil || tunnel!.status < 5 {
            connection.cancel()
            if tunnel == nil {
                self.log("no tunnel for \(url!) found")
            } else {
                self.log("tunnel for \(url!) is closed")
            }
            return
        }
        
        LocalClient(self, tunnel!).start()
    }
    
    private func regProxy() -> JSON {
        return JSON([
            "Type": "RegProxy",
            "Payload": [
                "ClientId": controller.clientId,
            ],
        ])
    }
}
