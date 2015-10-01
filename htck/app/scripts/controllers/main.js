'use strict';

/**
 * @ngdoc function
 * @name htckApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the htckApp
 */
angular.module('htckApp').controller('MainCtrl', function ($scope, $timeout) {
  		$scope.constants = constants;
  		
  		var paper = Raphael('paper');
  		console.log('Paper', paper);
  		var HEIGHT = paper.height, WIDTH = paper.width;

  		var elements = [];

  		function getSizeOfImage(src) {
			var fimg = new Image();
			fimg.src = src;

			var width = fimg.width;
			var height = fimg.height;

			return [width, height];
  		}

  		$scope.addImage = function(src){
  			var size = getSizeOfImage(src);
  			var ie = paper.image(src, (WIDTH - size[0])/2, (HEIGHT - size[1])/2, size[0], size[1]);
  			
  			var element = {
  				raph: ie,
  				size: 1,
  				rotation: 0,
  				id: ie.id
  			}

  			elements.push(element);
  		};
  });
