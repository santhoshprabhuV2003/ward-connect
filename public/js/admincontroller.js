import { app, uploadImage } from './config.js';

app.controller("adminctrl",['$scope', '$http', function($scope, $http) {
    $scope.landmark = {};
    $scope.landmarkdelete = {};
    $scope.updatelandmark = {};

    $scope.addlandmark = function() {
        const file = document.getElementById('landmark-img');
        const imageFile = file.files[0];
        const imageName = `landmarks/landmark-${$scope.landmark.wardnumber}.jpg`;
        uploadImage(imageFile,imageName,$scope.landmark,$http);
        $scope.landmark = {}
    }

    $scope.deletelandmark = function() {
        $http.post('https://ap-south-1.aws.data.mongodb-api.com/app/ward-connect-bnhaj/endpoint/DeleteLandmark',$scope.landmarkdelete)
            .then(function(response) {
                alert(response.data);
                $scope.landmarkdelete = {};
            })
            .catch(function(error) {
                alert(error);
            });
    }

    $scope.updateLandmark = function() {
        $http.post('https://ap-south-1.aws.data.mongodb-api.com/app/ward-connect-bnhaj/endpoint/UpdateLandmark',$scope.updatelandmark)
            .then(function(response) {
                alert(response.data);
                $scope.updatelandmark = {};
            })
            .catch(function(error) {
                alert(error);
            });
    }
}]);