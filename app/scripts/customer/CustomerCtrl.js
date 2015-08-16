'use strict';

/**
*  Module
*
* Description
*/
angular.module('customer')

.controller('CustomerCtrl',
            ['$scope',
             '$location',
             '$mdDialog',
             'FacebookLoginService',
             'CustomerService',
             'Auth',
             function ($scope,
                       $location,
                       $mdDialog,
                       FacebookLoginService,
                       CustomerService,
                       Auth) {

    var imagePath = 'img/list/60.jpeg';
    $scope.userData = Auth.facebook;
    $scope.imageSrc = Auth.facebook.profileImageURL;
    $scope.cartIcon = 'img/action/svg/production/ic_shopping_cart_24px.svg';
    $scope.exitApp = 'img/action/svg/production/ic_exit_to_app_24px.svg';
    $scope.pendingOrders = [];
    $scope.okOrders = [];
    $scope.servedOrders = [];
    $scope.showProgress = true;

    function updateList () {
        CustomerService
        .getOrders()
        .then(function (orders) {
            $scope.showProgress = false;
            $scope.pendingOrders = orders.PENDING;
            $scope.okOrders = orders.OK;
            $scope.servedOrders = orders.SERVING;
        })
        .catch(function () {
            $scope.showProgress = false;
        });
    }

    $scope.logout = function () {
        FacebookLoginService.logout();
    };

    $scope.editView = function (ev) {
        var order = this.order;

        $mdDialog.show({
            controller: 'OrderDialogCtrl',
            templateUrl: 'scripts/customer/partials/order-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
               Order: order
            }
        })
        .then(function (order) {
            CustomerService.updateOrder(order)
                .then(function (newOrder) {
                    updateList();
                });
        }, function () {

        });
    };

    $scope.add = function (ev) {
        $mdDialog.show({
            controller: 'OrderDialogCtrl',
            templateUrl: 'scripts/customer/partials/order-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
               Order: undefined
            }
        })
        .then(function (order) {
            CustomerService.addOrder(order)
                .then(function (newOrder) {
                    updateList();
                });
        }, function () {

        });
    };

    updateList();
}]);