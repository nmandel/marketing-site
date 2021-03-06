// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
// $(document).foundation();

var app = angular.module('tawnyOwlApp', [
  'ui.router'
  ]);

// switched from ngroute to ui.router
app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'client/partials/home.html'
      // add controller
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'client/partials/signup.html'
      // add controller
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/partials/login.html'
      // controller: 'UsernameCtrl'
    })
});
  
app.controller('UsernameCtrl', function($scope, $http) {
  $http.get("/checkUsername").success(function (data) {
    console.log(data);
    $scope.user = data.username;
  });
})