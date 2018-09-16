<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
    .map {
        width: 640px;
        height: 480px;
    }
    .labels {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px
}
    </style>

  </head>
<body>
  <script src="https://www.gstatic.com/firebasejs/4.12.0/firebase.js"></script>
  <script src="jquery-3.3.1.js"></script>
  <script src="jquery.tinyMap.js"></script>
  <div class="map"></div>
<script>
  //initialize google map////////////
  $.fn.tinyMapConfigure({
    'key': 'AIzaSyBmKFudinNxKD27eVaOUsBBaqEEt9o0ONQ',
    // 使用的地圖語言
    'language': 'zh‐TW',
});
  ////////////////////////////////
  // Initialize
  var config = {
    apiKey: "AIzaSyDd2rFHwPXyIkq0iRSinBBfzg31NYJLapE",
    authDomain: "nchumis2017-5566.firebaseapp.com",
    databaseURL: "https://nchumis2017-5566.firebaseio.com",
    projectId: "nchumis2017-5566",
    storageBucket: "nchumis2017-5566.appspot.com",
    messagingSenderId: "501160127423"
  };
  firebase.initializeApp(config);
  var loc=new Array();

  /////////////////初始化////////////////////
function getAddress(){
  var query = firebase.database().ref("Deliverys").orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var ref = firebase.database().ref("Deliverys/"+childSnapshot.key);
      ref.orderByKey().once("value")
        .then(function(snapshot) {
        loc.push({'addr':[snapshot.child("Latitude").val(),snapshot.child("Longitude").val()],
        'text':'文字標籤',
        'newLabel': snapshot.key,
        'newLabelCSS': 'labels',
        'icon': {
                'url': 'bike/jiche-4.png',
                'scaledSize': [40, 40]
            },
        'animation': 'DROP',
          })
      });
    });
  });
}
///////////////////////Initializemap////////////////////


  $('.map').tinyMap({
  'center': ['24.1175214', '120.6738148'],
  'zoom': 10,
});

function resetMarker(){
  $('.map').tinyMap('modify',{
  'marker': loc,
  'markerFitBounds': true
});
}

function getcurrent(){
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          pan(lat,lon);
   })
 }else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function pan(lat,lon){
  $('.map').tinyMap('panTo', [lat,lon]);
}

getAddress();
window.setTimeout("resetMarker()",3000);
//window.setInterval("getcurrent()",4000);
  /////////////////////////////////////
  </script>
  </body>
</html>
