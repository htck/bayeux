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
angular.module('htckApp').controller('MainCtrl', function ($scope, $timeout, $log, $document) {
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
        if($scope.current && $scope.current.type === 'text' && !$scope.current[0].textContent.length) {
          $scope.current.ft.unplug();
          $scope.current.remove();
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

        //$scope.current = ie;
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


      $scope.elementSetHeight = function(){
        if(!$scope.current) {
          return;
        }
        if($scope.current.keepratio){
          $scope.current.ft.attrs.scale.x=$scope.current.ft.attrs.scale.x*$scope.current.height/$scope.current.ft.attrs.scale.y;
          $scope.current.width=$scope.current.ft.attrs.scale.x;
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
          $scope.current.height=$scope.current.ft.attrs.scale.y;
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
      background.mousedown(function(evt, x, y) {
        var text = paper.text(evt.layerX, evt.layerY, 'H').attr({'text-anchor': 'start', 'font-family': constants.fonts[0], 'font-size': '25px', 'fill': constants.colors[0]});
        addElement(text);
        $scope.carret = 0;
        text[0].textContent = '';
        $scope.$apply();
      });
      background.attr({'fill':'white', 'fill-opacity':'0', 'stroke':'none'});

      // Function gotten from SVGFix
      // source : https://code.google.com/p/svgfix/
      function svgfix (text) {
        var fixed = text ;
        fixed = jQuery.trim(fixed);
        if (fixed.indexOf( 'xmlns:xlink' ) == -1 ) {
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

      function handleKeyPress (evt) {
        if(!$scope.current || $scope.current.type !== 'text'){
          return;
        }
        $log.debug(evt);
        if(evt.key === 'Backspace') {
          if($scope.current[0].textContent.length && $scope.carret > 0){
            console.log('REMOVE');
            $scope.current[0].textContent = $scope.current[0].textContent.substr(0,$scope.carret-1)+$scope.current[0].textContent.substr($scope.carret);
            $scope.carret--;
          }
          evt.stopPropagation();
          evt.preventDefault();
          return;
        }
        if(evt.key === 'ArrowLeft') {
          if($scope.carret > 0){
            $scope.carret--;
          }
          evt.stopPropagation();
          evt.preventDefault();
          return;
        }
        if(evt.key === 'ArrowRight') {
          if($scope.carret < $scope.current[0].textContent.length){
            $scope.carret++;
          }
          evt.stopPropagation();
          evt.preventDefault();
          return;
        }
        // Check if letter key
        if((!evt.key.match('^[a-zA-Z]$')) && (!evt.key === ' ') || evt.key.length > 1){ // TODO better regex
          return;
        }
        var k = (evt.key === ' ') ? ' ' : evt.key.toUpperCase();

        $scope.current[0].textContent = $scope.current[0].textContent.substr(0,$scope.carret)+k+$scope.current[0].textContent.substr($scope.carret);
        $scope.carret++;

        evt.stopPropagation();
        evt.preventDefault();
      };

      $document.on('keydown', handleKeyPress);

      $scope.$on('$destroy', function () {
        $document.off('keydown', handleKeyPress);
      });

      $scope.setFontColor = function(color) {
        $scope.current.attr({ fill: color});
      };
  });
