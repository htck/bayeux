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
// Constants
      constants.ELEMENT_SCALE_MIN = 0.2;
      constants.ELEMENT_SCALE_MAX = 5;
      constants.SHOWHANDLES=true;
      constants.ELEMENT_DEFAULT_HEIGHT=1;
      constants.ELEMENT_DEFAULT_WIDTH=1;
      constants.ELEMENT_DEFAULT_ROTATION=0;
  		$scope.constants = constants;

      var paper = new Raphael('paper');
  		$log.debug('Paper', paper);
  		var HEIGHT = paper.height, WIDTH = paper.width;
      var cptFtId = 0;

      var fts = [];

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
        console.log(this);
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
  		}

      // Triggers when an element drag is stopped
  		function elementDragEnd () {
  			$log.debug('End');
        // TODO
  		}

      function ftsIndexOf (ft) {
        for (var i = 0; i < fts.length; i++) {
            if (fts[i].id == ft.id) {
                return i;
            }
        }
        return -1;
      }

      // Should be called when creating a raphael element
      function addElement(ie){
        ie.mousedown(elementMouseDown);
        ie.drag(elementDragMove, elementDragStart, elementDragEnd);

        var ft = paper.freeTransform(ie, {}, function(ft, events) {
          handleFtChanged(ft, events);
        });
        
        // to make this work free_transform plugin must implement range.scale for x AND y 
        //ft.setOpts({range: {scale: [$scope.constants.ELEMENT_SCALE_MIN*ft.attrs.size.x, $scope.constants.ELEMENT_SCALE_MAX*ft.attrs.size.y] } });

        $scope.current = ie;
        $scope.current.ft = ft;
        $scope.current.ft.id = cptFtId++;

        fts.push(ft);

        // set default values
        (constants.showHandles) ? ft.showHandles() : null;
        ft.attrs.y=constants.ELEMENT_DEFAULT_HEIGHT;
        $scope.elementChangedHeight(ft.attrs.y);
        ft.attrs.x=constants.ELEMENT_DEFAULT_WIDTH;
        $scope.elementChangedWidth(ft.attrs.x);
        ft.attrs.rotate=constants.ELEMENT_DEFAULT_ROTATION;
        $scope.elementChangedRotation(ft.attrs.rotate);
        $scope.current.opacity = 1;
        $scope.$apply();
      }

      function handleFtChanged(ft, events) {
        if (events.indexOf("rotate") >= 0) {
          $scope.elementChangedRotation(ft.attrs.rotate);
          $scope.$apply();
        }
        if (events.indexOf("scale") >= 0) {
          $scope.elementChangedHeight(ft.attrs.scale.y);
          $scope.elementChangedWidth(ft.attrs.scale.x);
          $scope.$apply();
        }
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
        fts.splice(ftsIndexOf($scope.current.ft),1);
        $scope.current.ft.unplug();
        $scope.current.remove();
        unfocus();
      };

      $scope.bringToFront = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.toFront();
      };


      $scope.elementSetHeight = function(){
        if(!$scope.current) {
          return;
        }
        if($scope.current.keepratio){
          $scope.current.ft.attrs.scale.x=$scope.current.ft.attrs.scale.x*$scope.current.height/$scope.current.ft.attrs.scale.y;
        }
        $scope.current.ft.attrs.ratio=$scope.current.ft.attrs.scale.x/$scope.current.ft.attrs.scale.y;
        $scope.current.ft.attrs.scale.y=$scope.current.height;
        $scope.current.ft.apply();
      };

      $scope.elementChangedHeight = function(height){
        if(!$scope.current) {
          return;
        }
        $scope.current.height = height;
      };

      $scope.elementSetWidth = function(){
        if(!$scope.current) {
          return;
        }
        var dir;
        ($scope.current.mirror) ? dir = -1 : dir = 1;

        if($scope.current.keepratio){
          $scope.current.ft.attrs.scale.y = dir * $scope.current.ft.attrs.scale.y*$scope.current.width/$scope.current.ft.attrs.scale.x;
        }
        $scope.current.ft.attrs.ratio = dir * $scope.current.ft.attrs.scale.x/$scope.current.ft.attrs.scale.y;
        
        $scope.current.ft.attrs.scale.x = dir * $scope.current.width;
        $scope.current.ft.apply();
      };

      $scope.elementChangedWidth = function(width){
        if(!$scope.current) {
          return;
        }
        var dir;
        ($scope.current.mirror) ? dir = -1 : dir = 1;
        $scope.current.width = dir * width;
      };

      $scope.elementChangedRotation = function(angle){
        if(!$scope.current) {
          return;
        }
        angle=Math.floor(angle);
        $scope.current.rotation = angle;
      };

      $scope.elementSetRotation = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.attrs.rotate=$scope.current.rotation;
        $scope.current.ft.apply();
      };

      $scope.elementSetShowHandles = function(){
        if(!$scope.current) {
          return;
        }
        // TODO : find a way to keep drag and drop without handles!
        for (var i = 0; i < fts.length; i++) {
          ($scope.constants.SHOWHANDLES) ? fts[i].showHandles() : fts[i].hideHandles();
        }
      }

      $scope.elementSetKeepRatio = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.setOpts({keepRatio: $scope.current.keepratio});
      }

      $scope.elementSetMirror = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.attrs.scale.x = -$scope.current.ft.attrs.scale.x;
        $scope.current.ft.apply();
      };
      $scope.elementSetOpacity = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.attr({opacity: $scope.current.opacity}); 
      };
      

      var background = paper.rect(0, 0, WIDTH, HEIGHT);
      background.mousedown(function() {
        // TODO add text
      });
      background.attr({'fill':'white', 'fill-opacity':'0', 'stroke':'none'});
  });
