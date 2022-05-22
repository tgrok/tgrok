//
//  LocalClient.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import Network

class LocalClient: BaseClient {
    
    var proxy: ProxyClient?
    var tunnel: Tunnel?
    
    init(_ proxy: ProxyClient, _ tunnel: Tunnel) {
        self.proxy = proxy
        self.tunnel = tunnel
        super.init(tunnel.localHost, tunnel.localPort)
        self.type = "prv"
        
        NotificationCenter.default.addObserver(self, selector: #selector(onTunnelEvent(_:)), name: .tunnel, object: nil)
    }
    
    override func start() {
        connection = NWConnection(host: self.host, port: self.port, using: .tcp)
        super.start()
    }
    
    override func onReady() {
        connection.pipe(proxy!.connection)
        proxy!.connection.pipe(connection)
    }
    
    @objc func onTunnelEvent(_ notification: Notification) {
        let t = notification.object as! Tunnel
        if (t.id == tunnel?.id) {
            connection.forceCancel()
            proxy?.connection.forceCancel()
        }
    }
    
}
