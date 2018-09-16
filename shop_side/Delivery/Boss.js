var loc=new Array();
var bicons=["bike/green.png","bike/red.png","bike/blue.png","bike/yellow.png","bike/orange.png","bike/pink.png","bike/purple.png","bike/teal.png","bike/sky.png"];

  /////////////////初始化////////////////////
  function getAddress(){
    var count=0;
    loc.length = 0;
    $( "#collapsible1" ).empty();

    var query = firebase.database().ref("Deliverys");
    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

          var idt = childSnapshot.key;
          var lat= childSnapshot.child("Latitude").val();
          var lon= childSnapshot.child("Longitude").val();
          var telt= childSnapshot.child("phone").val();
          var name= childSnapshot.child("name").val();
          loc.push({'addr':[parseFloat(lat),parseFloat(lon)],'text':idt+'</br>姓名：'+name+'</br>電話：'+telt,'icon': {'url': bicons[count],'scaledSize': [20,20]},'ID':idt});
          if(count>9)count=0;
          $("<li><a href='#' onclick='pantomap(\""+idt+"\")'><div class='collapsible-header' style='font-size:4vw;'>"+idt+"</div></a><div class='collapsible-body'><span id='span"+idt+"'></span></div></li>").appendTo("#collapsible1");
          $('<h5 style="font-size:4vw;">歷史訂單</h5>').appendTo("#span"+idt);
          var query = firebase.database().ref("Orders/").orderByKey();
          query.once("value").then(function(snapshot) {
            snapshot.forEach(function(cchildSnapshot) {
              if(cchildSnapshot.child("deliverManID").val()==idt && cchildSnapshot.child("OrderStatus").val()=='4'){
                $('<h6 style="font-size:3vw;">'+cchildSnapshot.key+'</h6>').appendTo("#span"+idt);
              }
            })
          })
          count++;
      });
      resetMarker();
    },function(error) {
    // The Promise was rejected.
    console.error(error);
  });


     $('.collapsible').collapsible();
  }

///////////////////////Initializemap////////////////////


function resetMarker(){
  $('.map').tinyMap('clear', 'marker');
  $('.map').tinyMap('modify',{
  'marker': loc,
  'zoom': 14,
  'markerFitBounds': true,
});
}

function pantomap(temp){
  window.scrollTo(500, 100);
  var m = $('.map').data('tinyMap'),
        markers = m._markers,
        marker = {},
        i = 0;
    for (i; i < markers.length; i += 1) {
        markers[i].infoWindow.close();
    }
  var markers = $('.map').tinyMap('get', 'marker');

  setTimeout(function(){
    if(markers !== "" && markers !== null){
      markers.forEach(function(marker){
        if(marker.ID == temp){
          $('.map').tinyMap('modify',{
          'zoom': 13,
        });
          $('.map').tinyMap('panTo', marker.addr);
          var m = $('.map').data('tinyMap');
          var infoWindow = marker.infoWindow;
          infoWindow.open(m.map,marker);
        }
      })
      }
   }, 700);

}

$(document).ready(function(){
    $('.sidenav').sidenav();

      $('.map').tinyMap({
      'center': ['24.1175214', '120.6738148'],
      'zoom': 14,
      'markerFitBounds': true,
    });
  getAddress();
  var query = firebase.database().ref("Deliverys");
  query.on('child_changed', function(childSnapshot, prevChildKey){
    getAddress();
  });
  query.on('child_removed', function(childSnapshot, prevChildKey){
    getAddress();
  });

});

//window.setTimeout("resetMarker()",3000);
//window.setInterval("getcurrent()",4000);
