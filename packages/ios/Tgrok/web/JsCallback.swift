//
//  JsCallback.swift
//  PipiJr
//
//  Created by Yueyu Zhao on 2022/4/23.
//

import Foundation
import WebKit
import SwiftyJSON

class JsCallback {
    let id: String
    let webView: WKWebView

    init(_ webView: WKWebView, _ id: String!) {
        self.id = id
        self.webView = webView
    }

    func onResult(_ result: String) {
        webView.evaluateJavaScript("window.drmer && drmer.dequeue('\(id)', \(result));", completionHandler: nil)
    }

    func onResult(_ result: JsResult) {
        let json = result.toJson()
//        print("app.dequeue('\(id)', \(json))")
        webView.evaluateJavaScript("window.drmer && drmer.dequeue('\(id)', \(json));", completionHandler: nil)
    }
}
