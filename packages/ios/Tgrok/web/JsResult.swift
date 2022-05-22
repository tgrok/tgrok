//
//  JsResult.swift
//  PipiJr
//
//  Created by Yueyu Zhao on 2022/4/23.
//

import Foundation
import SwiftyJSON

class JsResult {
    let code: Int
    let data: Any?

    init(_ code: Int, _ data: Any?) {
        self.code = code
        self.data = data
    }

    init(raw: String) {
        let json = JSON.init(parseJSON: raw)
        self.code = json["code"].intValue
        self.data = json["data"].object
    }

    init(_ data: Any) {
        self.code = 200
        self.data = data
    }

    func toJson() -> String {
        let dic = [
            "code": code,
            "data": data
        ]
        return JSON.init(dic).description
    }

    func getData() -> Any? {
        return self.data
    }
}
