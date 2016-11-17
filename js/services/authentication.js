myApp.factory('Authentication',
  ['$rootScope', '$firebaseAuth', '$firebaseObject',
  '$location', 'FIREBASE_URL',
  function($rootScope, $firebaseAuth, $firebaseObject,
    $location, FIREBASE_URL) {

  var auth = $firebaseAuth();

  auth.$onAuthStateChanged(function(authUser) {
    if (authUser) {
      var userRef = firebase.database().ref('users/' + authUser.uid );
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });

  var myObject = {
    login: function(user) {
      auth.$signInWithEmailAndPassword(user.email , user.password).then(function(regUser) {
        $location.path('/meetings');
      }).catch(function(error) {
       $rootScope.message = error.message;
      });
    }, //login

    logout: function() {
      return auth.$signOut();
    }, //logout

    requireAuth: function() {
      return auth.$requireSignIn();
    }, //require Authentication

    register: function(user) {

      console.log(user);

      auth.$createUserWithEmailAndPassword(user.email , user.password).then(function(regUser) {

        var regRef = firebase.database().ref('users')
        .child(regUser.uid).set({
          date: Firebase.ServerValue.TIMESTAMP,
          regUser: regUser.uid,
          firstname: user.firstname,
          lastname: user.lastname,
          email:  user.email
        }); //user info

        myObject.login(user);

      }).catch(function(error) {
        $rootScope.message = error.message;
      }); // //createUser
    } // register
  };

  return myObject;
}]); //factory
