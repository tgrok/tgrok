//
//  NWConnectionExtensions.swift
//  Tgrok
//
//  Created by Yueyu Zhao on 2020/9/14.
//  Copyright © 2020 Yueyu Zhao. All rights reserved.
//

import Foundation
import Network

extension NWConnection {
    
    func pipe(_ connection: NWConnection) {
        self.receive(minimumIncompleteLength: 1, maximumLength: 4096) { (content, context, isComplete, error) in
            
            if let content = content {
                connection.send(content: content, completion: .contentProcessed({ (sendError) in
                    if let sendError = sendError {
                        print(sendError)
                        return
                    }
                }))
            } else if let context = context, context.isFinal, isComplete {
                print("context is done and no content: closing..")
                connection.cancel()
                return
            }

            if let error = error {
                print(error)
                connection.cancel()
                return
            }
            
            print("continue to read")
            self.pipe(connection)
        }
        
    }
    
}
