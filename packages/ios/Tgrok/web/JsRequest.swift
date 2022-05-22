//
//  JsRequest.swift
//  PipiJr
//
//  Created by Yueyu Zhao on 2022/4/23.
//

import Foundation
import SwiftyJSON
import WebKit

class JsRequest: NSObject {
    let webView: WKWebView

    let id: String!
    let clsName: String
    let clsMethod: String
    let params: JSON
    let callback: String
    let origMethod: String

    init(_ webView: WKWebView, _ json: String) {
        self.webView = webView

        let body = JSON(parseJSON: json)
        self.id = body["id"].string
        origMethod = body["method"].stringValue
        let methods = origMethod.components(separatedBy: "@")
        clsName = methods[0]
        clsMethod = methods[1]
        params = body["params"]
        callback = body["callback"].stringValue
    }

    func callback(_ result: String) {
        if nil == self.id {
            return
        }
        var format = "window.drmer && drmer.dequeue('%@', '%@');"
        // result is a JSON string
        if "null" == result || result.starts(with: "{") || result.starts(with: "[") {
            format = "window.drmer && drmer.dequeue('%@', %@);"
        }
        let script = String(format: format, self.id, result)
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript(script, completionHandler: nil)
        }
    }

    func callback(_ result: Bool) {
        self.callback(result ? "true" : "false")
    }

    func callback(_ result: JSON) {
        self.callback(result.description)
    }

    func intParam(_ key: String) -> Int {
        return self.params[key].intValue
    }

    func strParam(_ key: String) -> String {
        return self.params[key].stringValue
    }

    func boolParam(_ key: String) -> Bool {
        return self.params[key].boolValue
    }

    func jsonParam(_ key: String) -> JSON {
        return JSON(parseJSON: self.strParam(key))
    }
}
