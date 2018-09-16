var loc=new Array();
var current=new Array();
var distance =new Array();
var now;
var startpoint;
var endoint;
var waypoint=[];
var Farthest;
var deliveryMid = "";
var telphone = "";
var bicons=["bike/green.png","bike/red.png","bike/blue.png","bike/yellow.png","bike/orange.png","bike/pink.png","bike/purple.png","bike/teal.png","bike/sky.png"];
var ficons=["flag/1.png","flag/2.png","flag/3.png","flag/4.png","flag/5.png","flag/6.png","flag/7.png","flag/8.png","flag/9.png"];
///////////////取得URL data////////////////
var url = location.href;
if(url.indexOf('?')!=-1)
{
    var ary = url.split('?')[1].split('&');
    for(i=0;i<=ary.length-1;i++)
    {
        if(ary[i].split('=')[0] == 'id')
            deliveryMid = ary[i].split('=')[1];
        if(ary[i].split('=')[0] == 'telphone')
            telphone = ary[i].split('=')[1];
    }
      $('#did').text("外送人員："+deliveryMid);
      $('#dphone').text("電話："+telphone);
}
if(deliveryMid==""||telphone==""){
  alert("沒有登入");
  location.href="fmlogin.html";
}
/////////////////取得位置資訊////////////////////
function getAddress(){
  $(".modal").remove();
  $( "#card" ).empty();
  loc.length = 0;

  var query = firebase.database().ref("Orders").orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

      if(childSnapshot.child("OrderStatus").val() == "3"/** && snapshot.child("deliveryMid").val()=="3"**/){
        var idt = childSnapshot.key;
        var addt= childSnapshot.child("OrderInfo/Address").val();
        var namet= childSnapshot.child("OrderInfo/OrderMainName").val();
        var telt= childSnapshot.child("OrderInfo/TEL").val();

        $("<div class='col s12 m6' id='card"+idt+"'><div class='card'><div class='card-content black-text'><span class='card-title'><a class='modal-trigger' href='#modal"+idt+"'>"+idt+"</a></span><p>訂購人姓名："+namet+"</br>手機："+telt+"</br>地址："+addt+"</p></div><div class='card-action'><a class='waves-effect waves-light btn-small light-green accent-4' onclick='pantomap(\""+addt+"\")'><i class='material-icons left'>place</i>所在位置</a><a class='waves-effect waves-light btn-small light-green accent-4' onclick='setStatus(\""+idt+"\")'><i class='material-icons left'>check</i>已經送達</a></div></div></div>").appendTo("#card");


        $("#modalall").after("<div id='modal"+idt+"' class='modal'> <div class='modal-content'><h4>訂單內容</h4><p></p></div><div class='modal-footer'><a href='#!' class='modal-close waves-effect waves-green btn-flat'>Agree</a></div></div>");
        madaldisplay(idt);
      var ref = firebase.database().ref("Orders/"+childSnapshot.key+"/OrderInfo/");
      ref.once("value")
        .then(function(snapshot) {

          if(snapshot.child("Address").val()!==""){
          $('.map').tinyMap('query', snapshot.child("Address").val(), function (addr) {

            loc.push({'addr':[addr.geometry.location.lat(),addr.geometry.location.lng()],'text':snapshot.ref.parent.key,'BentoID':snapshot.ref.parent.key})

              });
            }
      });
    }
    });
  },function(error) {
  // The Promise was rejected.
  console.error(error);
});


}

///////////////////////getAllMarkers////////////////////

function getAllMarkers() {
  if(loc.length == 0 || loc == null){
    alert("你必須先取得訂單");
  }
  else
  DrawAllMarkers();
}

function DrawAllMarkers(){
  $('.map').tinyMap('clear', 'marker');
  distance.length = 0;
  $('.map').tinyMap('modify', {
  'marker': [{
      'addr':current,
      'text':'現在位置',
      'now':true,
    }]
  });
  $('.map').tinyMap('modify',{
  'marker': loc,
  'markerFitBounds': true,
  'event': {
    'idle': {
      'func': function () {
          // 取得目前地圖中心
          now = new google.maps.LatLng(current[0], current[1]);
          waypoint.length = 0;
        $('.map').tinyMap('get', 'marker', function (markers) {
            markers.forEach(function (marker) {
              var meters = 0;
              // 忽略標有 now: true 屬性的標記
              if (!marker.hasOwnProperty('now')) {
              meters = google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(),now);
              distance.push(meters);
              marker.infoWindow.setContent(marker.infoWindow.getContent() + '<div>距離: ' + Math.round(meters) + ' 公尺</div>'+'<a href="javascript:ctoe(\''+marker.BentoID+'\')" class="findOrders">訂單</div>'
                  );
              console.log(meters);
            }
              else distance.push(0);
          });
              Farthest = distance.indexOf(Math.max.apply(Math, distance));
              if (false !== Farthest && -1 !== Farthest) {
                  if ('undefined' !== typeof markers[Farthest].infoWindow) {
                    // 開啟此標記的 infoWindow
                    markers[Farthest].infoWindow.open(this, markers[Farthest]);
                      // 移動此標記至地圖中心
                      this.panTo(markers[Farthest].position);
                      markers[Farthest].endpoint = true;
                      endoint=markers[Farthest].position;
                  }
              }
              markers.forEach(function (marker) {
                if(!marker.hasOwnProperty('now')&&!marker.hasOwnProperty('endpoint'))
                waypoint.push(marker.addr);
              })
          });
        },'once': true // 僅執行一次
      }
    },
    });
}
///////drawDirection/////////////
function drawDirection(){
    $('.map').tinyMap('clear', 'direction');
    $('.map').tinyMap('modify',{
    'center': current,
    'zoom': 10,
    'direction': [
        {
            'from': now,
            'to': endoint,
            'waypoint':waypoint,
            'travel': 'driving',
            'optimize': true,
            'suppressMarkers': true, // 單純畫路線，不要顯示 marker
            //'renderAll': true,
            //'requestExtra': {
            //  'provideRouteAlternatives': true,
            //}
        }
    ]
});
}

/////////////////getNowPosition//////////////////
function getNowPosition(){
  var onSuccess = function(position) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
    current=[position.coords.latitude,position.coords.longitude];
    setlatlon();
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          $('#position_p').text(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
          console.error('Geocoder failed due to: ' + status);
      }
    });
    $('.map').tinyMap('panTo',latlng);
    $('.map').tinyMap('get', 'marker', function (markers) {
        if(typeof startpoint == 'undefined' || startpoint == null || startpoint == ""){
          $('.map').tinyMap('modify', {
          'marker': [{
              'addr': [
                  position.coords.latitude,
                  position.coords.longitude
                ],
              'text':'現在位置',
              'now':true,
            }]
          });
          markers.forEach(function (marker) {
            if (marker.hasOwnProperty('now')){
              marker.set('visible', true);
              startpoint = marker;
            }
          })
        }
        else {
          markers.forEach(function (marker) {
            if (marker.hasOwnProperty('now')){
              marker.setPosition(latlng);
              marker.set('visible', true);
              startpoint = marker;
              //marker.set('visible', !marker.getVisible());
            }

          })
        }
      })


  /*var markers = map.tinyMap('get', 'marker');
    var marker = new google.maps.Marker({
          position: current,
          title:"Hello World!"
        });

    markers.push(marker);
    markers[0].setMap(map);

    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    */

    };

  function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);

}
///////////////panTOmap//////////////////

function pantomap(addrs){


  window.scrollTo(500, 100);

  setTimeout(function(){
    if(addrs !== "" && addrs !== null){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': addrs}, function(results, status) {
        if (status == 'OK') {
          $('.map').tinyMap('panTo', results[0].geometry.location);

          $('.map').tinyMap('modify', {
                   'marker': [{
                       'addr':results[0].geometry.location
                   }]
               });

          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
   }, 700);

}

////////////////setStatus/////////////////////////
function setStatus(tempid){
  if(tempid !==""){
    var database = firebase.database();
      database.ref("Orders/").child(tempid).update({
        "OrderStatus": 4,
          });
    getAddress();
   }else{
         console.error("錯誤");
       }
}
///////Sets the map on all markers in the array.
  function setMapOnAll(map) {
    var markers = $('.map').tinyMap('get', 'marker');
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
// Adds a marker to the map and push to the array.
  function addMarker(location) {
    var markers = $('.map').tinyMap('get', 'marker');
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }
  // Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
  var markers = $('.map').tinyMap('get', 'marker');
  markers = [];
}

//////////////////modal/////////////////////

function madaldisplay(temp_id){
  var query = firebase.database().ref("Orders/"+temp_id+"/OrderDetail/").orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var ref = firebase.database().ref("Orders/"+temp_id+"/OrderDetail/"+childSnapshot.key+"/OrderPeople/").orderByKey();
      ref.once("value").then(function(cchildSnapshot) {
        cchildSnapshot.forEach(function(ccchildSnapshot) {
            $(document.createTextNode(ccchildSnapshot.child("name").val()+" X "+ccchildSnapshot.child("number").val())).appendTo("#modal"+temp_id+" .modal-content p");
            $(document.createElement("br") ).appendTo("#modal"+temp_id+" .modal-content p");
          })
        })
      })
    })

      $('.modal').modal();
}
//////////setlatlon/////////////////
function setlatlon() {
  var database = firebase.database();
    database.ref("Deliverys/").child(deliveryMid).update({
      "Latitude": current[0],
      "Longitude":current[1],
        });
}
/////////////click to element///////////////////////
function ctoe(idt){
  var elmnt = document.getElementById("card"+idt);
    elmnt.scrollIntoView();
}
//////////autolocation//////////////
var myVar;
$('#autolo').click(function () {

    if ($('#autolo').prop("checked")){
        myVar = window.setInterval("getNowPosition()", 10000);
    } else {
       clearInterval(myVar);
    }
});
////////////////////////////////////////
$(document).ready(function(){
    $('.sidenav').sidenav();

    $('.map').tinyMap({
      'center': ['24.123783','120.685283'],
      'zoom'  : 12,
  });
  getNowPosition();
  $('.modal .bottom-sheet').modal();
});
