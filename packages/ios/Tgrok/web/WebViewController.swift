//
//  WebViewController.swift
//  PipiJr
//
//  Created by Yueyu Zhao on 2022/4/23.
//

import UIKit
import WebKit
import SwiftyJSON
import MessageUI

class WebViewController: UIViewController {

    var urlHome: String! = "www/index.html"

    var webView: WKWebView!

    var shouldReload = false

    var bridge: JsBridge!

    override func viewDidLoad() {
        super.viewDidLoad()

        initWebview()

        if nil != urlHome {
            loadRequest(urlHome)
        }
    }

    @objc func onAppReady(_ notification:Notification) {
        webView.isHidden = false
    }

    @objc func onEvent(_ notification:Notification) {
        if let userInfo = notification.userInfo {
            DispatchQueue.main.async {
                let payload = JSON(userInfo["payload"] as Any)
                self.webView.evaluateJavaScript(
                    String(
                        format: "window.drmer && drmer.emit('%@', '%@');",
                        // swiftlint:disable force_cast
                        userInfo["event"] as! CVarArg, payload.description
                    ),
                    completionHandler: nil
                )
            }
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    func initWebview() {
        webView = WKWebView(frame: webViewRect(), configuration: webViewConfig())

        webView.scrollView.decelerationRate = UIScrollView.DecelerationRate.normal

        webView.navigationDelegate = self

        webView.translatesAutoresizingMaskIntoConstraints = false

//        webView.isHidden = true

        self.view.addSubview(webView)
        self.view.sendSubviewToBack(webView)
    }

    func setupBridge() {
        bridge = JsBridge(self)
    }

    func webViewRect() -> CGRect {
        return CGRect(x: 0, y: 0, width: view.bounds.size.width, height: view.bounds.size.height)
    }

    func webViewConfig() -> WKWebViewConfiguration {
        let config = WKWebViewConfiguration()

        let contentController = WKUserContentController()

        setupBridge()

        contentController.add(bridge, name: "jsBridge")

        config.allowsInlineMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true
        config.allowsPictureInPictureMediaPlayback = true
        // auto play audio or video
        if #available(iOS 10.0, *) {
            config.mediaTypesRequiringUserActionForPlayback = []
        } else {
            // Fallback on earlier versions
            config.mediaPlaybackRequiresUserAction = false
        }
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        config.userContentController = contentController

        return config
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])

        if !shouldReload {
            return
        }
        shouldReload = false
        webView.reload()
    }

    func loadRequest(_ file: String) {
        var url: URL
        if (file.starts(with: "file:///")) {
            url = URL(string: file)!
        } else if !file.starts(with: "http") {
            let path = Bundle.main.path(forResource: file, ofType: "", inDirectory: "")!
            url = URL(fileURLWithPath: path)
        } else {
            url = URL(string: file)!
        }

        webView.load(URLRequest(url: url))
    }

    override var prefersStatusBarHidden: Bool {
        return true
    }
}

extension WebViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("window.iOSBridge = window.webkit.messageHandlers.jsBridge", completionHandler: nil)

        self.disableLongPressGesturesForView(webView)
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url {
            if url.scheme == "http" || url.scheme == "https" {
                if UIApplication.shared.canOpenURL(url) {
                    if #available(iOS 10.0, *) {
                        UIApplication.shared.open(url)
                    } else {
                        UIApplication.shared.openURL(url)
                    }
                    decisionHandler(.cancel)
                }
                return
            }
        }
        decisionHandler(.allow)
    }

    // Disables iOS 9 webview touch tooltip by disabling the long-press gesture recognizer in subviews
    // Thanks to Rye:
    // http://stackoverflow.com/questions/32687368/how-to-completely-disable-magnifying-glass-for-uiwebview-ios9
    func disableLongPressGesturesForView(_ view: UIView) {
        for subview in view.subviews {
            if let gestures = subview.gestureRecognizers as [UIGestureRecognizer]? {
                for gesture in gestures {
                    // swiftlint:disable for_where
                    if gesture is UILongPressGestureRecognizer {
                        gesture.isEnabled = false
                    }
                }
            }
            disableLongPressGesturesForView(subview)
        }
    }

    // 修复编程返回白屏问题
    // 感谢林泽水
    // @see https://mp.weixin.qq.com/s/rhYKLIbXOsUJC_n6dt9UfA
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        shouldReload = true
    }
}

extension WebViewController: MFMailComposeViewControllerDelegate {
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        self.dismiss(animated: true, completion: nil)
        //        controller.dismiss(animated: true, completion: nil)
    }
}
