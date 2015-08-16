'use strict';

/**
*  Module
*
* Description
*/
angular.module('customer')

.service('CustomerService',
         ['$q',
          '$http',
          '$filter',
          'FacebookLoginService',
          function ($q,
                    $http,
                    $filter,
                    FacebookLoginService) {
    var ordersApi = ApiConfig.baseUrl + 'api/orders/customer/',
        orderApi = ApiConfig.baseUrl + 'api/order/id/',
        addOrderApi = ApiConfig.baseUrl + 'api/order/',

        mapToArray = function (mapOrders) {
            var orders = [];

            angular.forEach(mapOrders, function (value, key) {
                value.dateLabel = moment(new Date(parseInt(value.date) * 1000)).fromNow();
                orders.push(value);
            });

            return orders;
        };

    return {
        getOrders: function () {
            var dfd = $q.defer(),
                userData = FacebookLoginService.getUserData();

            $http.get(ordersApi + userData.facebook.id)
                .success(function (result) {
                    if (result.status == 'success') {
                        dfd.resolve(mapToArray(result.orders));
                    } else {
                        dfd.reject('Failed to get data');
                    }
                })
                .error(function (error) {
                    dfd.reject('Failed to get data');
                });

            return dfd.promise;
        },

        getOrder: function (orderId) {
            var dfd = $q.defer();

            $http.get(orderApi + orderId)
                .success(function (result) {
                    if (result.status == 'success') {
                        dfd.resolve(result.order);
                    } else {
                        dfd.reject('Failed to get data');
                    }
                })
                .error(function (error) {
                    dfd.reject('Failed to get data');
                });

            return dfd.promise;
        },

        addOrder: function (order) {
            var dfd = $q.defer(),
                userData = FacebookLoginService.getUserData();

            order.customer = {
                id: userData.facebook.id,
                name: userData.facebook.displayName
            };

            $http.post(addOrderApi, order)
                .success(function (newOrder) {
                     dfd.resolve(newOrder);
                })
                .error(function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        },

        updateOrder: function (order) {
            var dfd = $q.defer();

            $http.put(orderApi + order.id, order)
                .success(function (result) {
                    if (result.status == 'success') {
                        dfd.resolve(result.order);
                    } else {
                        dfd.reject('Failed to get data');
                    }
                })
                .error(function (error) {
                    dfd.reject('Failed to get data');
                });

            return dfd.promise;
        },

        deleteOrder: function () {
            var dfd = $q.defer();

            $http.delete(orderApi + order.id)
                .success(function (result) {
                    if (result.status == 'success') {
                        dfd.resolve();
                    } else {
                        dfd.reject('Failed to get delete');
                    }
                })
                .error(function (error) {
                    dfd.reject('Failed to get data');
                });

            return dfd.promise;
        }
    }
}]);