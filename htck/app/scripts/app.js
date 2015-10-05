'use strict';

/**
 * @ngdoc overview
 * @name htckApp
 * @description
 * # htckApp
 *
 * Main module of the application.
 */
angular
  .module('htckApp', [
    'ngAnimate',
    'ngAria',
    'ngRoute',
    'ngTouch',
    'ngMaterial',
    'ngDragDrop'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
