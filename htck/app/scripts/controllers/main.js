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
      constants.ELEMENT_DEFAULT_KEEPRATIO=true;
  		$scope.constants = constants;

      var paper = new Raphael('paper');
  		$log.debug('Paper', paper);
  		var HEIGHT = paper.height, WIDTH = paper.width;

      function setCurrent(newCurrent) {
        if($scope.current && newCurrent && $scope.current.id === newCurrent.id){
          return;
        }
        if($scope.current && $scope.current.ft){
          $scope.current.ft.hideHandles();
        }
        
        $scope.current = newCurrent;

        if($scope.current) {
          $scope.current.ft.showHandles();
        }
      }

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
        setCurrent(this);
  			//this.toFront();
        $scope.$apply();
  		}

      // Should be called when creating a raphael element
      function addElement(ie){
        ie.mousedown(elementMouseDown);

        var ft = paper.freeTransform(ie, {}, function(ft, events) {
          handleFtChanged(ft, events);
        });
        
        // to make this work free_transform plugin must implement range.scale for x AND y 
        //ft.setOpts({range: {scale: [$scope.constants.ELEMENT_SCALE_MIN*ft.attrs.size.x, $scope.constants.ELEMENT_SCALE_MAX*ft.attrs.size.y] } });

        ie.ft = ft;
        setCurrent(ie);

        // set default values
        ft.attrs.y=constants.ELEMENT_DEFAULT_HEIGHT;
        $scope.elementChangedHeight(ft.attrs.y);

        ft.attrs.x=constants.ELEMENT_DEFAULT_WIDTH;
        $scope.elementChangedWidth(ft.attrs.x);

        ft.attrs.rotate=constants.ELEMENT_DEFAULT_ROTATION;
        $scope.elementChangedRotation(ft.attrs.rotate);

        $scope.current.opacity = 1;

        $scope.current.keepratio = constants.ELEMENT_DEFAULT_KEEPRATIO;
        $scope.elementSetKeepRatio();

        ft.setOpts({'drag':['self']});
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
        //$scope.current = null;
        setCurrent(null);
      }

      //
      $scope.isFlipped = function() {
        var dir = ($scope.current.mirror) ? -1 : 1;
        return dir;
      };

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

      $scope.elementRatio = function(){
        return $scope.current.ft.attrs.scale.x / $scope.current.ft.attrs.scale.y; 
      };

      //modified by sliders 
      $scope.elementSetHeight = function(){
        if(!$scope.current) {
          return;
        }        
        
        if($scope.current.keepratio) {
          $scope.current.ft.attrs.scale.x = $scope.elementRatio() * $scope.current.height;
          $scope.elementChangedWidth($scope.current.ft.attrs.scale.x);
          $scope.current.ft.attrs.scale.y = $scope.current.height;
        } else {
          $scope.current.ft.attrs.scale.y = $scope.current.height;
          $scope.current.ft.attrs.ratio = $scope.elementRatio();
        }                       
        $scope.current.ft.apply();
      };

      //modified by sliders 
      $scope.elementSetWidth = function(){
        if(!$scope.current) {
          return;
        }        
        if($scope.current.keepratio){
          $scope.current.ft.attrs.scale.y = $scope.isFlipped() * $scope.current.width / $scope.elementRatio();
          $scope.elementChangedHeight($scope.current.ft.attrs.scale.y);
          $scope.current.ft.attrs.scale.x = $scope.isFlipped() * $scope.current.width;
        } else {
          $scope.current.ft.attrs.scale.x = $scope.isFlipped() * $scope.current.width;
          $scope.current.ft.attrs.ratio = $scope.elementRatio();
        }        
        $scope.current.ft.apply();
      };

      //modified by handles 
      $scope.elementChangedHeight = function(height){
        if(!$scope.current) {
          return;
        }
        $scope.current.height = Math.abs(height);
      };
      

      //modified by handles 
      $scope.elementChangedWidth = function(width){        
        console.log("handles Changed Width ");
        if(!$scope.current) {
          return;
        }    
        $scope.current.width = Math.abs(width);
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

      $scope.elementSetKeepRatio = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.setOpts({keepRatio: $scope.current.keepratio});
      };

      $scope.elementSetMirror = function() {
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.attrs.scale.x = - $scope.current.ft.attrs.scale.x;
        $scope.current.ft.attrs.ratio = $scope.elementRatio();
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

      // Function gotten from SVGFix
      // source : https://code.google.com/p/svgfix/
      function svgfix (text) {
        var fixed = text ;
        fixed = jQuery.trim(fixed);
        if (fixed.indexOf( 'xmlns:xlink' ) === -1 ) {
          fixed = fixed.replace ('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '); 
        }
        fixed = fixed.replace (' href', ' xlink:href'); 
        return fixed; 
      }

      $scope.export = function(){
        $log.debug('Exporting');
        // Unfocus to remove handles from elements
        unfocus();
        // Get the svg element created by Raphael
        var svg = document.getElementById("paper").children[0];
        var svgStr = svgfix(svg.outerHTML);

        // Convert to canvas using canvg
        canvg(document.getElementById('canvas'), svgStr, {
          renderCallback: function() {
            var canvas = document.getElementById('canvas');

            // Get blob from canvas image
            canvas.toBlob(function(blob){
              // Save to file using FileSaver.js
              saveAs(blob, "TheGloriousTaleOfBayeux.png");  // TODO generate random name for file
            });
          }
        });
      };
  });
