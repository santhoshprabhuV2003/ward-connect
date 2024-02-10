import { app } from './config.js';

app.controller("wardctrl",['$scope', '$http', 'authService', function($scope, $http, authService) {
    $scope.username = authService.getCurrentUser();
    $scope.wards = [];

    $http.get('https://ward-connect.onrender.com/api/wards').then(function(response) {
        $scope.wards = response.data;
        $scope.applyFilters();
    });

    $scope.zones = ["EAST ZONE", "NORTH ZONE", "CENTRAL ZONE", "SOUTH ZONE", "WEST ZONE"];

    // Ward Range Filter
    $scope.selectedWardRange = "";
    $scope.wardrangeFilter = function (ward) {
        if (!$scope.selectedWardRange) {
            return true;
        }
        var lm = {
            "lt20": ward.number < 20,
            "21-40": ward.number >= 21 && ward.number <= 40,
            "41-60": ward.number >= 41 && ward.number <= 60,
            "61-80": ward.number >= 61 && ward.number <= 80,
            "gt80": ward.number > 80
        };
        return lm[$scope.selectedWardRange];
    };

    // Sort by Ward population
    $scope.sortBy = "default";
    $scope.sortWards = function (ward) {
        if ($scope.sortBy === "lowToHigh") {
            return ward.population;
        } else if ($scope.sortBy === "highToLow") {
            return -ward.population;
        }
        return 0;
    };

    // Applying Filters
    $scope.applyFilters = function () {
        $scope.filteredWards = $scope.wards
            .filter(function (ward) {
                return $scope.wardrangeFilter(ward);
            })
            .sort(function (a, b) {
                return $scope.sortWards(a) - $scope.sortWards(b);
            });
    };

    $scope.$watchGroup(['selectedWardRange','sortBy'], function () {
        $scope.applyFilters();
    });
}]);

app.directive('ward', function () {
    return {
        restrict: 'E',
        scope: {
            ward: '='
        },
        template: `
            <div class="product-container">
                <picture class="thumbnail"><img class="product-image" ng-src="{{ward.imgsrc}}" alt="{{ward.name}}"></picture>
                <div class="product-content">
                    <h3>{{ward.name | uppercase}}</h3>
                    <h3>WARD NUMBER: {{ward.number}}</h3>
                    <p>{{ward.zone | uppercase}}</p>
                    <p>{{ward.description}}</p>
                    <p>Councillor: {{ward.counsillor}}</p>
                    <p>Population: {{ward.population | number}}</p>
                </div>
            </div>
        `
    };
});