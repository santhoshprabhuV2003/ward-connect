import { app, signOutWardConnect } from './config.js';

app.controller("indexctrl",['$scope', '$http', '$window','authService', function($scope, $http, $window, authService) {
    $scope.username = authService.getCurrentUser();
    $scope.services = [];

    $http.get('https://ap-south-1.aws.data.mongodb-api.com/app/ward-connect-bnhaj/endpoint/services').then(function(response) {
        $scope.services = response.data;
    });

    $scope.logout = function() {
        signOutWardConnect($window);
        authService.setCurrentUser('');
    }; 
}]);