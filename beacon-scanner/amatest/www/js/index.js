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

        var paramsObj = { request: false }; //false不跳出藍牙開啟視窗
        bluetoothle.initialize(initializeSuccess, initializeError, paramsObj);
    }
};
function initializeSuccess(obj) {
    $('div.app').empty();
    var paramsObj = { serviceUuids: [] };
    var beacon_record = { 'D0:B5:C2:96:C3:B6': false, 
                          'D0:B5:C2:96:BF:5B': false};
    var preloader = '';
    preloader+='<div class="row" id="preload"><h4>掃描中，請稍後....</h4>';
    preloader+='<div class="progress">';
    preloader +='<div class="indeterminate"></div></div></div>';
    preloader += '<div class="row">'
    preloader+='<div class="col s4"></div><a class="waves-effect waves-light btn col s4" id="stopScan">停止掃描</a></div>';
    $('div.app').prepend(preloader);
    $('#stopScan').on('click', function(){
        bluetoothle.stopScan(function(){
            console.log('STOP SCAN');
        }, function(){
            console.log('Fail to stop ');
        });
        $('#preload').remove();
        $('#stopScan').remove();

    });
    bluetoothle.startScan(function (obj) {

        if (obj.status == "scanResult") {        
            if (obj.address == 'D0:B5:C2:96:C3:B6' && beacon_record['D0:B5:C2:96:C3:B6'] !== true) {
                beacon_record['D0:B5:C2:96:C3:B6'] = true;
                var str = '';
                str += '<img src="./img/test.jpg" style="border-radius:100%;margin-top:10%;margin-bottom:10%;"width="60%" height="60%">';
                str += '<div class="row"><div class="col s4"></div>';
                str += '<a class="waves-effect waves-light btn col s4" href="./user.html">排這家！</a>';
                str += '</div>';
                $('div.app').append(str); 
                 
                // bluetoothle.stopScan(function(){
                //     console.log('STOP SCAN');
                // }, function(){
                //     console.log('Fail to stop ');
                // });
            }

            if (obj.address == 'D0:B5:C2:96:BF:5B' && beacon_record['D0:B5:C2:96:BF:5B'] !== true) {
                beacon_record['D0:B5:C2:96:BF:5B'] = true;

                var str = '';
                str += '<img src="./img/test2.jpg" style="border-radius:100%;margin-top:10%;margin-bottom:10%;"width="60%" height="60%">';
                str += '<div class="row"><div class="col s4"></div>';
                str += '<a class="waves-effect waves-light btn col s4" href="./user.html">排這家！</a>';
                str += '</div>';
                $('div.app').append(str);

                // bluetoothle.stopScan(function(){
                //     console.log('STOP SCAN');
                // }, function(){
                //     console.log('Fail to stop ');
                // });
            }

        }
        console.log(obj);
        
    }, function (obj) {
        console.log("初始化掃描錯誤 : " + JSON.stringify(obj));
    }, paramsObj);
    return false;
}

function initializeError(obj) {
    console.log("未開啟藍牙，準備開啟 : " + JSON.stringify(obj));
}


