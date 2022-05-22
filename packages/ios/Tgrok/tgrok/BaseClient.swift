//
//  BaseClient.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import Network

let tgrokQueue = DispatchQueue.main

class BaseClient: NSObject {
    
    var connection: NWConnection!
    
    var type: String
    let name: String
    
    let host: NWEndpoint.Host
    let port: NWEndpoint.Port
    
    init(_ host: String, _ port: UInt16) {
        self.name = String.random(8)
        self.type = ""
        self.host = NWEndpoint.Host(host)
        self.port = NWEndpoint.Port(rawValue: port)!
        super.init()
    }
    
    func log(_ msg: String) {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
        let time = formatter.string(from: Date())
        print("[\(time)]", "[\(type):\(name)]", msg)
    }
    
    func start() {
        if (nil == connection) {
            return
        }
        connection.start(queue: tgrokQueue)
        connection.stateUpdateHandler = { (newState) in
            self.onStateUpdate(newState)
        }
    }
    
    func onStateUpdate(_ newState: NWConnection.State) {
        switch newState {
        case .ready:
            self.onReady()
            break
        case .waiting(let error):
            self.onWaiting(error)
            self.onError(error)
            break
        case .cancelled:
            self.onCancelled()
            self.onError(nil)
            break
        case .failed(let error):
            self.onFailed(error)
            self.onError(error)
            break
        case .setup:
            self.onSetup()
            break
        case .preparing:
            self.log("perparing")
            break;
        default:
            print("unhandled state", newState)
        }
    }
    
    func onReady() {
        log("on ready")
    }
    
    func onWaiting(_ error: Error) {
        print(error)
    }
    
    func onCancelled() {
        log("on cancelled")
    }
    
    func onFailed(_ error: Error) {
        log("on failed")
        print(error)
    }
    
    func onError(_ error: Error?) {
        log("on error")
        if let error = error {
            print(error)
        }
    }
    
    func onSetup() {
        log("setup")
    }
    
}
