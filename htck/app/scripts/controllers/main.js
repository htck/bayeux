'use strict';

/**
 * @ngdoc function
 * @name htckApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the htckApp
 */
/* globals constants */
/* globals Raphael */
angular.module('htckApp').controller('MainCtrl', function ($scope, $timeout, $log) {
  		$scope.constants = constants;
  		
  		var paper = new Raphael('paper');
  		$log.debug('Paper', paper);
  		var HEIGHT = paper.height, WIDTH = paper.width;

  		var elements = [];

  		function getSizeOfImage(src) {
  			var fimg = new Image(); 
  			fimg.src = src;

  			var width = fimg.width;
  			var height = fimg.height;

  			return {w:width, h:height};
  		}

      // Triggers when an element is clicked
  		function elementMouseDown (/*evt, x, y*/){
  			// TODO
  			$log.debug('Click');
        $scope.current = this;
  			//this.toFront();
  		}

      // Triggers when an element is dragged
  		function elementDragStart () {
  			$log.debug('Start');
  			$log.debug(this);
        $scope.current = this;
  			this.ox = this.attrs.x;
        this.oy = this.attrs.y;
  		}

      // Triggers while an element is dragged
  		function elementDragMove (dx, dy) {
  			//$log.debug('Move');
  			var x = this.ox + dx;
  			var y = this.oy + dy;

        var pos = { x: x, y: y, cx: x, cy: y };
        this.attr(pos);
  		}

      // Triggers when an element drag is stopped
  		function elementDragEnd () {
  			$log.debug('End');
        // TODO
  		}

      // Should be called when creating a raphael element
      function addElement(ie){
        ie.mousedown(elementMouseDown);
        ie.drag(elementDragMove, elementDragStart, elementDragEnd);

        var element = {
          raph: ie,
          size: 1,
          rotation: 0,
          id: ie.id
        };

        $scope.current = ie;
        elements.push(element);
      }

      // Unselects an element
      function unfocus(){
        $log.debug('Unfocus');
        $scope.current = null;
      }

      // Adds an image as a raphael element from its url
  		$scope.addImage = function(src){
  			var size = getSizeOfImage(src);
  			var ie = paper.image(src, (WIDTH - size.w)/2, (HEIGHT - size.h)/2, size.w, size.h);  // TODO
  			addElement(ie);
  		};

      // Removes an element
      $scope.remove = function() {
        if(!$scope.current) {
          return;
        }
        $scope.current.remove();
        unfocus();
        // TODO : remove from array
      };

      $scope.bringToFront = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.toFront();
      };

      var background = paper.rect(0, 0, WIDTH, HEIGHT);
      background.mousedown(function() {
        // TODO add text
      });
      background.attr({'fill':'white', 'fill-opacity':'0', 'stroke':'none'});
  });
