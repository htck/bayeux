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

  		function elementMouseDown (/*evt, x, y*/){
  			// TODO
  			console.log('Click');
        $scope.current = this;
  			//this.toFront();
  		}

  		function elementDragStart (cx, cy) {
  			console.log('Start');
  			console.log(this);
        $scope.current = this;
  			this.ox = this.attrs.x;
        this.oy = this.attrs.y;
  		}
  		function elementDragMove (dx, dy) {
  			//console.log('Move');
  			var x = this.ox + dx;
  			var y = this.oy + dy;

        var pos = { x: x, y: y, cx: x, cy: y };
        this.attr(pos);
  		}
  		function elementDragEnd () {
  			console.log('End');
        // TODO
  		}

      function addElement(ie){
        ie.mousedown(elementMouseDown);
        ie.drag(elementDragMove, elementDragStart, elementDragEnd);

        var element = {
          raph: ie,
          size: 1,
          rotation: 0,
          id: ie.id
        }

        $scope.current = ie;
        elements.push(element);
      }

      $scope.unfocus = function(){
        $scope.current = null;
      };


  		$scope.addImage = function(src){
  			var size = getSizeOfImage(src);
  			var ie = paper.image(src, (WIDTH - size[0])/2, (HEIGHT - size[1])/2, size[0], size[1]);
  			addElement(ie);
  		};

      $scope.remove = function() {
        if(!$scope.current) {
          return;
        }
        $scope.current.remove();
        // TODO : remove from array
      }

      $scope.bringToFront = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.toFront();
      };
  });
