import { app, signUpWardConnect } from './config.js';

app.controller('signupctrl', ['$scope', '$window', function($scope,$window) {
    $scope.userData = {};

    $scope.signup = function() {
        if ($scope.userData.password !== $scope.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const { email, password, username } = $scope.userData;
        signUpWardConnect(email,password,username,$window);
        $scope.userData = {};
    };
}]);