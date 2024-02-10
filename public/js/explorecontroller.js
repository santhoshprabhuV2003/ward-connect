import { app } from './config.js';

app.controller('explorectrl', ['$scope', '$http', 'authService', function($scope, $http, authService) {
    $scope.username = authService.getCurrentUser();
    $scope.landmarks = [];

    $http.get('https://ward-connect.onrender.com/api/landmarks').then(function(response) {
        $scope.landmarks = response.data;
        $scope.applyFilters();
    });

    $scope.wards = ["Ismailpuram","Harveypatti","Sellur","Pudhur","Anaiyur","Meenakshi Nagar","Villapuram","Kaitharinagar","Austinpatti"];

    // Land Mark Filter
    $scope.selectedlandmark = "";
    $scope.landmarkFilter = function (landmark) {
        if (!$scope.selectedlandmark) {
            return true;
        }
        var lm = {
            "phcc": landmark.type == "Primary Health Care Centre",
            "gh": landmark.type == "Hospital",
            "fs": landmark.type == "Fire Station",
        };
        return lm[$scope.selectedlandmark];
    };

    // Applying Filters
    $scope.applyFilters = function () {
        $scope.filteredLandMarks = $scope.landmarks
            .filter(function (landmark) {
                return $scope.landmarkFilter(landmark);
            });
    };

    $scope.$watchGroup(['selectedlandmark'], function () {
        $scope.applyFilters();
    });
}]);

app.directive('landmark', function () {
    return {
        restrict: 'E',
        scope: {
            landmark: '='
        },
        template: `
            <div class="product-container">
                <picture class="thumbnail"><img class="product-image" ng-src="{{landmark.imgsrc}}" alt="{{landmark.name}}"></picture>
                <div class="product-content">
                    <h3>{{landmark.name | uppercase}}</h3>
                    <h4>{{landmark.type | uppercase}}</h4>
                    <p>Ward Number: {{landmark.wardnumber | number}}</p>
                    <p>Zone: {{landmark.zone}}</p>
                    <p>{{landmark.address}}</p>
                    <p>{{landmark.contact}}</p>
                </div>
            </div>
        `
    };
});