//
//  TgrokClient.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import Network
import SwiftyJSON

class TgrokClient: BaseClient {
    
    var paused = false
    
    override func start() {
        if nil == connection {
            connection = NWConnection(host: self.host, port: self.port, using: .tls)
        }
        super.start()
    }
    
    override func onReady() {
        super.onReady()
        readLoop()
    }
    
    func readLoop() {
        readHeader(connection)
    }
    
    func readHeader(_ connection: NWConnection) {
        let headerLength: Int = 8
        connection.receive(minimumIncompleteLength: headerLength, maximumLength: headerLength) { (content, contentContext, isComplete, err) in
            if let error = err {
                print("read header error: ", error)
                return
            }
            if let content = content {
                let bodyLength = content.toUIntLE()
                self.readBody(connection, bodyLength)
                return
            }
            if (!self.paused) {
                self.readLoop()
            }
        }
    }
    
    func readBody(_ connection: NWConnection, _ bodyLength: Int) {
        connection.receive(minimumIncompleteLength: bodyLength, maximumLength: bodyLength) { (content, context, isComplete, err) in
            if let error = err {
                print("read body error: ", error)
                return
            }
            
            if let content = content {
                let data = String(data: content, encoding: .utf8)
                self.log("recv <<<< " + data!)
                self.onData(JSON(parseJSON: data!))
            }
            if let context = context, context.isFinal, isComplete  {
                return
            }
            
            if (!self.paused) {
                self.readLoop()
            }
        }
    }
    
    func onData(_ json: JSON) {
    }
    
    func send(_ content: String) {
        if (connection == nil || connection.state != .ready) {
            log("socket not ready")
            return
        }
        let data = content.data(using: .utf8)!
        let headerData = data.count.toData()
        log("send >>>> " + content)
        connection.send(content: headerData + data, completion: .contentProcessed({ (err) in
            if let sendError = err {
                print(sendError)
            }
        }))
    }
    
    func send(_ json: JSON) {
        send(json.desc)
    }
}
