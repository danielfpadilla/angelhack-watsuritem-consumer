'use strict';

/**
* facebook-login Module
*
* Description
*   - Handles the facebook login and send persist to server
*/
angular.module('facebook-login', [])

.config(['$routeProvider',
         function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'scripts/facebook-login/partials/facebook-login.html',
            controller: 'FacebookLoginCtrl',
            resolve: {
                Auth: [
                    'FacebookLoginService',
                    function (FacebookLoginService) {
                        return FacebookLoginService.getAuth(true);
                    }
                ]
            }
        });
}]);