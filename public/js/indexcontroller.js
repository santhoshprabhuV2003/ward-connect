import { app, signOutWardConnect } from './config.js';

app.controller("indexctrl",['$scope', '$http', '$window','authService', function($scope, $http, $window, authService) {
    $scope.username = authService.getCurrentUser();
    $scope.services = [];

    $http.get('https://ward-connect.onrender.com/api/services').then(function(response) {
        $scope.services = response.data;
    });

    $scope.logout = function() {
        signOutWardConnect($window);
        authService.setCurrentUser('');
    }; 
}]);