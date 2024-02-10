import { app, uploadToFirebase } from './config.js';

app.controller('reportctrl', ['$scope', 'authService', function($scope, authService) {
    $scope.username = authService.getCurrentUser();
    $scope.issueData = {}

    if ($scope.username) {
        $scope.issueData.username = $scope.username;
    }

    var eastzonewards = ["Anaiyur","Sambandhar Alankulam","B.B.Kulam","Meenambalpuram","Kailaasapuram","Vilangudi","Thathaneri"];
    var northzonewards = ["Kochadai","Visalakshi Nagar","Thiruppaalai","Kannanendhal","Parasuraamanpatti","Karpaga Nagar"];   
    var centralzonewards = ["Pangajam Colony", "Mariamman Theppakulam", "Iraavadhanallur", "Sinna Anuppanadi", "Anuppanadi", "Chinthamani", "Meenakshi Nagar"]; 
    var southzonewards = ["Chokkikulam", "Tallakulam", "K.K.Nagar", "Pudur", "Lourdhu Nagar", "Reserve Line"];
    var westzonewards = ["Kovalan Nagar", "T.V.S.Nagar", "Paamban Swami Nagar", "Mannar College", "Thirupparamkundram", "Haarvipatti"];

    var availablewards = [].concat(eastzonewards, northzonewards, centralzonewards, southzonewards, westzonewards);
    $scope.availableWards = availablewards;

    $scope.updateWards = function () {
        if ($scope.issueData.zone === "East Zone") {
            $scope.availableWards = eastzonewards;
        } else if ($scope.issueData.zone === "West Zone") {
            $scope.availableWards = westzonewards;
        } else if ($scope.issueData.zone === "Central Zone") {
            $scope.availableWards = centralzonewards;
        } else if ($scope.issueData.zone === "North Zone") {
            $scope.availableWards = northzonewards;
        } else if ($scope.issueData.zone === "South Zone") {
            $scope.availableWards = southzonewards;
        } else {
            $scope.availableWards = availablewards;
        }
    };

    $scope.updateZone = function () {
        var wardToZoneMap = {
            "Anaiyur": "East Zone",
            "Sambandhar Alankulam": "East Zone",
            "B.B.Kulam": "East Zone",
            "Meenambalpuram": "East Zone",
            "Kailaasapuram": "East Zone",
            "Vilangudi": "East Zone",
            "Thathaneri": "East Zone",
            "Kochadai": "North Zone",
            "Visalakshi Nagar": "North Zone",
            "Thiruppaalai": "North Zone",
            "Kannanendhal": "North Zone",
            "Parasuraamanpatti": "North Zone",
            "Karpaga Nagar": "North Zone",
            "Pangajam Colony": "Central Zone",
            "Mariamman Theppakulam": "Central Zone",
            "Iraavadhanallur": "Central Zone",
            "Sinna Anuppanadi": "Central Zone",
            "Anuppanadi": "Central Zone",
            "Chinthamani": "Central Zone",
            "Meenakshi Nagar": "Central Zone",
            "Chokkikulam": "South Zone",
            "Tallakulam": "South Zone",
            "K.K.Nagar": "South Zone",
            "Pudur": "South Zone",
            "Lourdhu Nagar": "South Zone",
            "Reserve Line": "South Zone",
            "Kovalan Nagar": "West Zone",
            "T.V.S.Nagar": "West Zone",
            "Paamban Swami Nagar": "West Zone",
            "Mannar College": "West Zone",
            "Thirupparamkundram": "West Zone",
            "Haarvipatti": "West Zone"
        };        

        $scope.issueData.zone = wardToZoneMap[$scope.issueData.ward];
    };

    $scope.uploadImageAndGenerateReportPDF = function () {
        const timestamp = new Date().getTime();
        const pdfFileName = `report_${timestamp}.pdf`;
    
        const file = document.getElementById('ward-issue-image');
        const imageFile = file.files[0];
        const imageName = `reports/${$scope.issueData.zone}/report-${$scope.issueData.ward}-${timestamp}.jpg`;

        if(file) {
            uploadToFirebase(imageFile,imageName,$scope.issueData,pdfFileName);
        }
    };         

    $scope.reportIssue = function() {
        $scope.uploadImageAndGenerateReportPDF();
        alert("Ward Issue Reported Successfully!!\nReport is being generated..");
        $scope.issueData = {};
    }
}]);