//
//  Tgrok.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import SwiftyJSON

class Tgrok: NSObject {
    
    var controlClient: ControlClient?
    
    private var timer: Timer?
    private var retryTimes = 0
    
    override init() {
        super.init()
    }
    
    func boot(_ host: String, _ port: UInt16) {
        let controlClient = ControlClient(host, port)
        controlClient.delegate = self
        
        self.controlClient = controlClient
    }
    
    func start(_ port: UInt16, _ host: String?) {
        controlClient?.tunnels.append(Tunnel(JSON([
            "id": UUID().uuidString,
            "protocol": "http",
            "hostname": "",
            "subdomain": "test",
            "remotePort": 0,
            "localHost": host ?? "127.0.0.1",
            "localPort": port,
        ])))
        self.connect()
    }
    
    func start(_ tunnels: [Tunnel]) {
        controlClient?.tunnels = tunnels
        self.connect()
    }

    func openTunnel(_ tunnel: Tunnel) {
        controlClient?.openTunnel(tunnel)
    }
    
    func closeTunnel(_ id: String) -> Bool {
        _ = controlClient?.closeTunnel(id)
        return true
    }
    
    func removeTunnel(_ id: String) -> Bool {
        _ = controlClient?.removeTunnel(id)
        return true
    }
    
    func status() -> JSON {
        var tunnels: [JSON] = []
        if let client = controlClient {
            for tunnel in client.tunnels {
                tunnels.append(JSON([
                    "id": tunnel.id,
                    "status": tunnel.status,
                ]))
            }
        }
        
        return JSON([
            "status": controlClient?.status ?? 0,
            "tunnels": tunnels,
        ])
    }
    
    private func connect() {
        controlClient?.start()
    }
    
    func reconnect(_ clear: Bool) {
        if clear {
            timer?.invalidate()
            self.retryTimes = 0
            self.timer = nil
        }
        
        if self.timer != nil {
            return
        }
        
        let timeout = self.timeout()
        timer = Timer.scheduledTimer(withTimeInterval: timeout, repeats: false, block: { (_) in
            self.timer?.invalidate()
            self.timer = nil
            self.connect()
        })
        self.retryTimes += 1
    }
    
    func timeout() -> Double {
        let times = [1, 1, 2, 3, 5, 8, 13, 21]
        if self.retryTimes >= times.count {
            return Double(times.last!)
        }
        return Double(times[self.retryTimes])
    }
    
}

extension Tgrok : ControlClientDelegate {
    
    func onConnect() {
        self.retryTimes = 0
    }
    
    func onError() {
        let timeout = self.timeout()
        NotificationCenter.default.post(name: .tgrok, object: JSON([
            "evt": "master:error",
            "payload": "reconnect after \(timeout)s"
        ]))
        print("main socket error, reconnect after \(timeout)s")
        self.timer = nil
        self.reconnect(false)
    }
    
}
