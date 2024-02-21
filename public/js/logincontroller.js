import { app, loginWardConnect, loginByGoogleAuth0 } from './config.js';

app.controller('loginctrl', ['$scope', '$window', function($scope, $window) {
    $scope.userData = {};

    $scope.login = function() {
        const { email, password } = $scope.userData;
        loginWardConnect(email,password,$window)
    };

    $scope.loginByGoogle = function() {
        loginByGoogleAuth0($window);
    }
}]);