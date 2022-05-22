//
//  Tunnel.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import SwiftyJSON

class Tunnel: NSObject {
    
    let id: String
    var url: String?
    let localHost: String
    let localPort: UInt16
    let requestId = UUID().uuidString
    
    let hostname: String
    let subdomain: String
    let proto: String
    let remotePort: UInt16
    
    var _status = 0
    
    var status: Int {
        set (val) {
            _status = val
            NotificationCenter.default.post(name: .tgrok, object: self.statusJson())
        }
        get {
            return _status
        }
    }
    
    func statusJson() -> JSON {
        return JSON([
            "evt": "tunnel:status",
            "payload": [
                "id": self.id,
                "status": self._status,
                "url": self.url ?? ""
            ],
        ])
    }
    
    func request() -> JSON {
        return JSON([
            "Type": "ReqTunnel",
            "Payload": [
                "ReqId": self.requestId,
                "Protocol": self.proto,
                "Hostname": self.hostname,
                "Subdomain": self.subdomain,
                "HttpAuth": "",
                "RemotePort": self.remotePort
            ],
        ])
    }
    
    init(_ config: JSON) {
        self.id = config["id"].stringValue
        self.hostname = config["hostname"].stringValue
        self.subdomain = config["subdomain"].stringValue
        self.proto = config["protocol"].stringValue
        self.localHost = config["localHost"].stringValue
        self.localPort = config["localPort"].uInt16Value
        self.remotePort = 0
        super.init()
    }
    
}
