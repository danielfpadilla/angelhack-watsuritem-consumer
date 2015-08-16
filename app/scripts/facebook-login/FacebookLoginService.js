'use strict';

/**
*  Module
*
* Description
*/
angular.module('facebook-login')

.service('FacebookLoginService',
         ['$q',
          '$http',
          '$location',
          '$firebaseAuth',
          function ($q,
                    $http,
                    $location,
                    $firebaseAuth) {
        // Get reference from firebase
    var ref = new Firebase("https://ahd2015watsuritem.firebaseio.com"),
        // create an instance of the authentication service
        auth = $firebaseAuth(ref),

        // customerApi
        customerApi = ApiConfig.baseUrl + 'api/customer',

        _userData;

    return {
        login: function () {
            var dfd = $q.defer();

            // login with Facebook
            auth.$authWithOAuthPopup("facebook")
                .then(function (authData) {
                    var user = {
                        id: authData.facebook.id,
                        name: authData.facebook.displayName
                    };

                    $http.post(customerApi, user)
                        .success(function () {
                             dfd.resolve(authData);
                        });
                }).catch(function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        },

        getUserData: function () {
            return _userData;
        },

        logout: function () {
            ref.unauth();
            $location.path('/');
        },

        getAuth: function (reverse) {
            var dfd = $q.defer();

            ref.onAuth(function (authData) {
                if (authData) {

                    _userData = authData;

                    if (reverse) {
                        // Force to customer page
                        $location.path('/customer');
                        dfd.reject();
                    } else {
                        dfd.resolve(authData);
                    }
                } else {
                    if (reverse) {
                        dfd.resolve();
                    } else {
                        dfd.reject('Unauthorized');
                    }
                }
            });

            return dfd.promise;
        }
    }
}]);