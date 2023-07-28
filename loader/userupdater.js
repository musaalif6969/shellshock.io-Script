(function() {
  'use strict';

  // Check if the script is already injected
  if (window.krunkerOnlineCounterInjected) {
    console.log("Updating Online User Counter...");
    return;
  }

  // Set the injected flag
  window.krunkerOnlineCounterInjected = true;

  // Load the Firebase SDK
  var script = document.createElement('script');
  script.src = "https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js";
  document.head.appendChild(script);

  // Wait for the Firebase SDK to be loaded
  script.onload = function () {
    // Replace with your Firebase project's configuration
    var firebaseConfig = {
    apiKey: "AIzaSyDU2WRUxuLrUXOMX6fmJi3U8SdKHp_Qx0k",
    authDomain: "countershell-shell.firebaseapp.com",
    databaseURL: "https://countershell-shell-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "countershell-shell",
    storageBucket: "countershell-shell.appspot.com",
    messagingSenderId: "1050030424507",
    appId: "1:1050030424507:web:d3922d937aae81da5cc49e",
    measurementId: "G-DS94Z8TVHY"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Load the Firebase Realtime Database SDK
    var databaseScript = document.createElement('script');
    databaseScript.src = "https://www.gstatic.com/firebasejs/8.9.1/firebase-database.js";
    document.head.appendChild(databaseScript);

    // Wait for the Firebase Realtime Database SDK to be loaded
    databaseScript.onload = function () {
      // Get a reference to the online users count in the database
      var counterRef = firebase.database().ref("online_users");

      // Initialize previous text
      var previousText = "";

      // Increase the count when a user opens the page
      counterRef.transaction(function (currentCount) {
        return (currentCount || 0) + 1;
      });

      // Decrease the count when a user closes the page
      window.onbeforeunload = function () {
        counterRef.transaction(function (currentCount) {
          return (currentCount || 0) - 1;
        });
      };

      // Find the element with id "UserCounter" and update the count
      function updateCounter(count) {
        var counterElement = document.getElementById("UserCounter");
        if (counterElement) {
          var newText = "Online users: " + count;
          if (previousText !== newText) {
            counterElement.textContent = newText;
          }
          previousText = newText;
        } else {
          console.log("Element with id 'UserCounter' not found. Searching again in 1 second...");
          setTimeout(function () {
            updateCounter(count);
          }, 1000);
        }
      }

      // Listen for changes in the counter and update the element text
      counterRef.on("value", function (snapshot) {
        var count = snapshot.val();
        updateCounter(count);
      });
    };
  };
})();
