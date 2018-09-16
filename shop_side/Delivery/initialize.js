
//initialize google map////////////
  $.fn.tinyMapConfigure({
    'key': 'AIzaSyBmKFudinNxKD27eVaOUsBBaqEEt9o0ONQ',
    'libraries': 'geometry,drawing,places',
    // 使用的地圖語言
    'language': 'zh‐TW',
    'geolocation': {
    maximumAge: 600000,
    timeout: 3000,
    enableHighAccuracy: false
}
});
  ////////////Initialize firebase/////////////////////
  var config = {
    apiKey: "AIzaSyBf4e-0PxENVo_TzccvPXD66Rjde1QO-jU",
    authDomain: "nchumis2017-5566.firebaseapp.com",
    databaseURL: "https://nchumis2017-5566.firebaseio.com",
    projectId: "nchumis2017-5566",
    storageBucket: "nchumis2017-5566.appspot.com",
    messagingSenderId: "501160127423"
  };
  firebase.initializeApp(config);
