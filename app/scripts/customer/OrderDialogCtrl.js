'use strict';

angular.module('customer')

.controller('OrderDialogCtrl',
            ['$scope',
             '$timeout',
             '$filter',
             '$mdDialog',
             'Order',
             'CustomerService',
             function ($scope,
                       $timeout,
                       $filter,
                       $mdDialog,
                       Order,
                       CustomerService) {
    var intervalId,
        pollRequest = function () {
            stopPoll();

            intervalId = setInterval(function () {
                CustomerService.getOrder(Order.id)
                    .then(function (order) {
                        var oldData = angular.toJson($scope.order),
                            newData = angular.toJson(order);

                        if (oldData != newData) {
                            $timeout(function () {
                                $scope.order = order;
                            });
                        }
                    });
            }, 6000);
        },
        stopPoll = function () {
            if (intervalId !== undefined) {
                clearInterval(intervalId);
            }
        },

        updateOrder = function (order) {
            return CustomerService.updateOrder(order);
        };

    $scope.item = {};

    if (Order) {
        $scope.currentDate = Order.dateLabel;
        $scope.order = Order;

        pollRequest();
    } else {
        $scope.currentDate = $filter('date')(new Date(),'yyyy-MMM-dd');
        $scope.order = {
            title: '',
            items: []
        };
    }

    $scope.answer = function (answer) {
        if (answer == 'cancel') {
            $mdDialog.cancel();
        } else {
            $mdDialog.hide($scope.order);
        }
    };

    $scope.addItem = function () {
        var item = {
            quantity: $scope.item.quantity,
            description: $scope.item.description,
            status: 0
        };

        $scope.order.items.push(item);
        $scope.item = {};

        if ($scope.order.id) {
            stopPoll();

            updateOrder($scope.order)
                .then(function () {
                    pollRequest();
                })
                .catch(function () {
                    pollRequest();
                });
        }
    };

    $scope.deleteItem = function () {
        var index = this.$index;

        $scope.order.items.splice(index, 1);

        if ($scope.order.id) {
            stopPoll();

            updateOrder($scope.order)
                .then(function () {
                    pollRequest();
                })
                .catch(function () {
                    pollRequest();
                });
        }
    };

    $scope.$on('$destroy', function () {
        stopPoll();
    });
}]);