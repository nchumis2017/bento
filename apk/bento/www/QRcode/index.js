/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log("ready");
        $('#app').css("display", "none");
        
        $('#bottom_button').css("display", "block");
        if (typeof (QRScanner) != 'undefined') {
            //初始化检测，申请摄像头等权限  
            QRScanner.prepare(onDone); // show the prompt  
        } else {
            alert('插件加载失败');
        }
        
        function onDone(err, status) {
            if (err) {
                console.error(err);
            }
            if (status.authorized) {
                //绑定扫描监听  
                // `QRScanner.cancelScan()` is called.  
                QRScanner.scan(displayContents);
                function displayContents(err, text) {
                    if (err) {
                        // an error occurred, or the scan was canceled (error code `6`)  
                        alert('启动扫描出错：' + JSON.stringify(err));
                    } else {
                        // The scan completed, display the contents of the QR code:  
                        if (text != null) {
                            destroyCam();
                            document.location.href = "../Order/JoinOrder.html?" + text;
                        }

                    }
                }
                //开始扫描，需要将页面的背景设置成透明  
                QRScanner.show();

            } else if (status.denied) {
                // The video preview will remain black, and scanning is disabled. We can  
                // try to ask the user to change their mind, but we'll have to send them  
                // to their device settings with `QRScanner.openSettings()`.  
                alert('用户拒绝访问摄像头');
            } else {
                // we didn't get permission, but we didn't get permanently denied. (On  
                // Android, a denial isn't permanent unless the user checks the "Don't  
                // ask again" box.) We can ask again at the next relevant opportunity.  
            }
        }  

    }
};

function destroyCam(){

    QRScanner.destroy(function (status) {
        console.log(status);
    });
    $('#app').css("display", "block");

    $('#bottom_button').css("display", "none");
}