'use strict';

/**
*  Module
*
* Description
*/
angular.module('facebook-login')

.controller('FacebookLoginCtrl',
            ['$scope',
             '$location',
             'FacebookLoginService',
             function ($scope,
                       $location,
                       FacebookLoginService) {

    $scope.login = function () {
        FacebookLoginService.login()
            .then(function (userData) {
                console.log(userData);

                $location.path('/customer');
            })
            .catch(function (error) {
                console.log(error);
            });
    };
}]);