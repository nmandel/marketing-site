
var app = angular.module('tawnyOwlApp.authControllers', [
  'ui.router'
]);

app.controller('UsernameCtrl', function($scope, $rootScope, $http) {
  $scope.currentUser = $rootScope.currentUser;
  $scope.hideOptions = true;
  $scope.domainLockedSuccessMessage = false;
  $scope.lockDomain = function(domain) {
    $http.post('/lockDomain', {
      domain: domain
    }).success(function(data) {
      $scope.domainLockedSuccessMessage = true;
    });
  }
  $scope.toggleDomainApi = function() {
    $scope.hideOptions = $scope.hideOptions === false ? true: false;
  }
})

app.controller('SignupCtrl', function($scope, $http, $rootScope, $state) {

  $scope.checkUniqueUserName = function() {
    $http.post("/checkUsernameExists", {
        username: $scope.username
      })
      .success(function(data) {
        if (data.alreadyExisting === true) {
          $scope.usernameAlreadyExistErrorMsg = "Not a unique user name!";
        }
        else {
          $scope.usernameAlreadyExistErrorMsg = "";
        }
      })
  }
  $scope.checkUniqueEmail = function() {
    $http.post("/checkEmailExists", {
        email: $scope.email
      })
      .success(function(data) {
        if (data.alreadyExisting === true) {
          $scope.emailAlreadyExistErrorMsg = "Not a unique email!";
        }
        else {
          $scope.emailAlreadyExistErrorMsg = "";
        }
      })
  }
  $scope.signUp = function(username, password, email) {
    if (!username || !password || !email) {
      //send error message
      $scope.errMsg = true;
    }
    else {
      $http.post("/signupChecker", {
        username: $scope.username,
        password: $scope.password,
        email: $scope.email
      }).success(function(data) {
        if (data === 'false') {
          $scope.errMsg = true;
        }
        else {
          $rootScope.currentUser = data.username;
          $rootScope.currentApiKey = data.apiKey;
          $scope.hasEmailBeenSent = true;
          $scope.username = "";
          $scope.password = "";
          $scope.email = "";
        }
      })
    }
  }

});

app.controller('LoginCtrl', function($scope, $http, $state, $rootScope) {
  $scope.login = function(username, password) {
    if (!username || !password) {
      //send error message
    }
    $http.post("/loginChecker", {
      username: $scope.username,
      password: $scope.password
    }).success(function(data) {
      if (data === 'false') {
        $scope.errMsg = true;
      }
      else {
        $rootScope.currentUser = data.username;
        $rootScope.currentApiKey = data.apiKey;
        $state.go('account');
      }
    }).error(function(err) {
      $scope.errMsg = true;
    })
  }
})

app.controller('ForgotPasswordCtrl', function($scope, $http) {

  $scope.hasEmailBeenSent = false;
  $scope.invalidEmail = false;

  // button can only be clicked once
  $scope.waitingForValidEmail = false;

  $scope.forgotPassword = function(email) {
    $scope.waitingForValidEmail = true;

    $http.post('/forgotPassword', {
      email: email
    }).success(function(forgotEmailObj) {
      if (forgotEmailObj.isValid) {
        $scope.email = "";
        $scope.hasEmailBeenSent = true;
        $scope.invalidEmail = false;
      }
      if (!forgotEmailObj.isValid) {
        $scope.invalidEmail = true;
        $scope.waitingForValidEmail = false;
        $scope.hasEmailBeenSent = false;
      }
    });
  }
});

app.controller('ResetPasswordCtrl', function($scope, $http, $location, $stateParams) {

  $scope.resetPassword = function(reset) {
    if ($scope.password !== $scope.verify_password) {
      $scope.differentPasswordError = true;
    }
    else {
      $http.post('/resetPassword', {
        resetId: $stateParams.resetId,
        password: $scope.password
      }).success(function(data) {

        $location.path('/');
      });
    }
  }
});