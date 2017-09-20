/* global angular:false */
/* global FormData:false */
(function () {
    'use strict';

    angular
        .module('app')
        .directive('uiFileUpload', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.uiFileUpload);
                    var modelSetter = model.assign;
                    element.bind('change', function () {
                        scope.$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]).service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function (file, uploadUrl, callback) {
                var fd = new FormData();
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function (response) {
                    callback(null, response);
                }).error(function (data, status, headers, config) {
                    callback('failure message: ' + JSON.stringify({ data: data }));
                });
            };
        }]);
})();
