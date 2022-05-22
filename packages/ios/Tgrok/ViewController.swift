//
//  ViewController.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/12.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import UIKit
import WebKit
import SwiftyJSON

class ViewController: WebViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func setupBridge() {
        super.setupBridge()
        
        bridge.register("PageService", PageService())
        bridge.register("TgrokService", TgrokService.shared)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        NotificationCenter.default.removeObserver(self, name: .tgrok, object: nil)
        NotificationCenter.default.removeObserver(self, name: UIDevice.orientationDidChangeNotification, object: nil)
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        NotificationCenter.default.addObserver(self, selector: #selector(rotated), name: UIDevice.orientationDidChangeNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(onTgrokEvent(_:)), name: .tgrok, object: nil)
    }

    @objc func rotated() {
        Timer.scheduledTimer(withTimeInterval: 0.3, repeats: false) { (_) in
            self.webView.frame = self.webViewRect()
        }
    }

    @objc func onTgrokEvent(_ notification: Notification) {
        let json = notification.object as! JSON
        let format = "drmer.emit('%@', %@);"
        let js = String(format: format, "tgrok", json.desc)
        // print(js)
        webView.evaluateJavaScript(js, completionHandler: nil)
    }
    
    override var prefersStatusBarHidden: Bool {
        return false
    }
}
