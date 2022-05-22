//
//  Config.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/19.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import SwiftyJSON

class Config: NSObject {
    
    static let shared = Config()
    
    private static let KEY = "tgrok"
    
    let defaults = UserDefaults.standard
    
    var config: JSON
    
    private override init() {
        let config: JSON
        if let json = defaults.string(forKey: Config.KEY) {
            config = JSON(parseJSON: json)
        } else {
            config = JSON([
                "server": [
                    "host": "t.drmer.net",
                    "port": 4443,
                ],
                "tunnels": [],
            ])
        }
        self.config = config
        super.init()
    }
    
    func load() -> JSON {
        return config
    }
    
    func set(_ key: String, _ value: Any) {
        config.dictionaryObject?.removeValue(forKey: key)
        try? config.merge(with: JSON([
            key: value
        ]))
        defaults.set(config.desc, forKey: Config.KEY)
    }
    
    func get(_ key: String) -> Any? {
        return config[key]
    }
    
    func flush() {
        defaults.set(config.desc, forKey: Config.KEY)
    }
}
