/* global angular:false */
/* global FormData:false */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('UploadCtrl', UploadCtrl);
    UploadCtrl.$inject = ['$scope', '$location', '$timeout', 'fileUpload', '$alert'];

    function UploadCtrl($scope, $location, $timeout, fileUpload, $alert) {
        $scope.upload = function () {
            var file = $scope.csvFileInput;
            if (!file) {
                var alert = $alert({
                    title: 'Warning!',
                    content: 'Please, choose the CSV file to upload.',
                    placement: 'top-right',
                    type: 'warning',
                    duration: 3,
                    keyboard: true,
                    show: false
                });
                alert.$promise.then(alert.show);
                return;
            }
            fileUpload.uploadFileToUrl(file, '/angular/post-file', function (err, response) {
                var alert;
                if (err) {
                    alert = $alert({
                        title: 'Error',
                        content: err,
                        placement: 'top-right',
                        type: 'warning',
                        duration: 3,
                        keyboard: true,
                        show: false
                    });
                } else {
                    alert = $alert({
                        title: response.title,
                        content: response.message,
                        placement: 'top-right',
                        type: response.success ? 'info' : 'warning',
                        duration: 3,
                        keyboard: true,
                        show: false
                    });
                }
                alert.$promise.then(alert.show);
                if (response && response.success) {
                    $timeout(function () {
                        $location.path('/dashboard');
                    }, 3000);
                }
                return false;
            });
        };
    }
})();
