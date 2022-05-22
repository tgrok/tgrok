//
//  JsBridge.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/13.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import UIKit
import WebKit

class JsBridge: NSObject {

    private var services = Dictionary<String, JsService>()

    let webView: WKWebView

    init(_ webView: WKWebView) {
        self.webView = webView
    }

    func register(_ name: String, _ service: JsService) {
        services[name] = service
    }

    func register(_ service: JsService) {
        let name = String(describing: type(of: service))
        register(name, service)
    }

}

extension JsBridge: WKScriptMessageHandler {

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let jsRequest = JsRequest(webView, message.body as! String)

        guard let service = services[jsRequest.clsName] else {
            print("Service \(jsRequest.clsName) not found.")
            return
        }

        var selector = NSSelectorFromString("\(jsRequest.clsMethod):")
        if !service.responds(to: selector) {
            selector = NSSelectorFromString(jsRequest.clsMethod)
            if !service.responds(to: selector) {
                print("Method \(jsRequest.clsName)@\(jsRequest.clsMethod) not found, does it start with @objc or have the right signature?")
                return
            }
        }
        service.perform(selector, with: jsRequest)
    }

}
