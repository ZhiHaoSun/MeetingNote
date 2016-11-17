myApp.controller('MeetingsController', 
  ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
  function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var meetingsRef = firebase.database().ref('users/' +
          $rootScope.currentUser.$id + '/meetings');
        var meetingsInfo = $firebaseArray(meetingsRef);
        $scope.meetings = meetingsInfo;

        meetingsInfo.$loaded().then(function(data) {
          $rootScope.howManyMeetings = meetingsInfo.length;
        }); //Make sure meeting data is loaded

        meetingsInfo.$watch(function(data) {
          $rootScope.howManyMeetings = meetingsInfo.length;
        });


        $scope.addMeeting = function() {
          meetingsInfo.$add({
            name: $scope.meetingname,
            date: firebase.database.ServerValue.TIMESTAMP
          }).then(function() {
            $scope.meetingname='';
          }); //promise
        }; // addMeeting

        $scope.deleteMeeting = function(key) {
          meetingsInfo.$remove(key);
        }; // deleteMeeting

      } // User Authenticated
    }); // on Auth
}]); //Controller