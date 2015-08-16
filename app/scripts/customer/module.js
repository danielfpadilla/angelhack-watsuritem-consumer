'use strict';

/**
* customer Module
*
* Description
*   - Handles the customer list and items
*/
angular.module('customer', [])

.config(['$routeProvider',
         function ($routeProvider) {
    $routeProvider
        .when('/customer', {
            templateUrl: 'scripts/customer/partials/customer.html',
            controller: 'CustomerCtrl',
            resolve: {
                Auth: [
                    'FacebookLoginService',
                    function (FacebookLoginService) {
                        return FacebookLoginService.getAuth();
                    }
                ]
            }
        });
}]);