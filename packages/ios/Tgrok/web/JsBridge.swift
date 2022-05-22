//
//  JsBridge.swift
//  PipiJr
//
//  Created by Yueyu Zhao on 2022/4/23.
//

import Foundation
import WebKit

class JsBridge: NSObject {
    let serviceMap = NSMutableDictionary()

    let webController: WebViewController

    init(_ webController: WebViewController) {
        self.webController = webController
    }

    func register(_ id: String, _ service: JsService) {
        serviceMap.setValue(service, forKey: id)
    }
}

extension JsBridge: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // swiftlint:disable force_cast
        let jsRequest = JsRequest(webController.webView, message.body as! String)

        // swiftlint:disable force_cast
        guard let service = serviceMap.value(forKey: jsRequest.clsName) as! JsService? else {
            print("No service found for \(jsRequest.clsName)")
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
        guard let ret = service.perform(selector, with: jsRequest) else {
            return
        }
        guard let res = ret.takeUnretainedValue() as? String else {
            // nothing is returned
            return
        }
        jsRequest.callback(res)
    }
}
