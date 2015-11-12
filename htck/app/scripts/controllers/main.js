'use strict';

/* globals constants */
/* globals Raphael */
/* globals $ */
angular.module('htckApp').controller('MainCtrl', function ($scope, $timeout, $log, $document, $mdSidenav, hExport, hTextEdit, hHotkeys, hElement, hTools, hSave) {
      // Constants
      constants.ELEMENT_TEXT_HANDLE_DISTANCE = 7;

      constants.ELEMENT_SCALE_MIN = 0.2;
      constants.ELEMENT_SCALE_MAX = 5; 
      constants.SHOWHANDLES=true;
      constants.ELEMENT_DEFAULT_HEIGHT=1;
      constants.ELEMENT_DEFAULT_WIDTH=1;
      constants.ELEMENT_DEFAULT_ROTATION=0;
      constants.ELEMENT_DEFAULT_KEEPRATIO=true;
      constants.ELEMENT_DISPLACEMENT=3;
      constants.RAPHAEL_PAPER='paper';
      constants.W = 900;
      constants.H = 675;
      constants.TEXT_DEFAULT_SIZE = '30px';
      constants.TEXT_DEFAULT_FONT_COLOR = '#000000';
  		$scope.constants = constants;

      $scope.font = (constants.fonts && constants.fonts.length) ? constants.fonts[0] : undefined;
      $scope.fontColor = (constants.colors && constants.colors.length) ? constants.colors[0] : constants.TEXT_DEFAULT_FONT_COLOR;

      var paper = new Raphael(constants.RAPHAEL_PAPER, constants.W, constants.H);
      $scope.paper = paper;
  		$log.debug('Paper', paper);
  		var HEIGHT = paper.height, WIDTH = paper.width;
      paper.setViewBox(0,0,WIDTH,HEIGHT,true);
      paper.setSize('100%', '100%');

      function setCurrent(newCurrent) {
        if($scope.current && newCurrent && $scope.current.id === newCurrent.id){
          return;
        }
        if($scope.current && $scope.current.type === 'text' && !$scope.current[0].textContent.length) {
          hElement.remove($scope.current);
        }
        if($scope.current && $scope.current.ft){
          $scope.current.ft.hideHandles();
        }
        
        $scope.current = newCurrent;

        if($scope.current) {
          $scope.current.ft.showHandles();
        }
        if($scope.current && $scope.current.type === 'text') {
          hTextEdit.addCaret();
        }
        else{
          hTextEdit.removeCaret();
        }
      }

      // Triggers when an element is clicked
  		$scope.elementMouseDown = function (/*evt, x, y*/){
  			// TODO
  			$log.debug('Click');
        setCurrent(this);
  			//this.toFront();
        $scope.$apply();
  		};

      // Should be called when creating a raphael element
      function addElement(ie){
        ie.mousedown($scope.elementMouseDown);

        var ft = paper.freeTransform(ie, {}, function(ft, events) {
          $scope.handleFtChanged(ft, events);
        });
        
        // to make this work free_transform plugin must implement range.scale for x AND y 
        //ft.setOpts({range: {scale: [$scope.constants.ELEMENT_SCALE_MIN*ft.attrs.size.x, $scope.constants.ELEMENT_SCALE_MAX*ft.attrs.size.y] } });

        ie.ft = ft;
        setCurrent(ie);

        // set default values
        ft.attrs.y=constants.ELEMENT_DEFAULT_HEIGHT;
        hElement.setHeight($scope.current, ft.attrs.y);

        ft.attrs.x=constants.ELEMENT_DEFAULT_WIDTH;
        hElement.setWidth($scope.current, ft.attrs.x);

        ft.attrs.rotate=constants.ELEMENT_DEFAULT_ROTATION;
        hElement.setRotation($scope.current, ft.attrs.rotate);

        $scope.current.opacity = 1;

        $scope.current.keepratio = constants.ELEMENT_DEFAULT_KEEPRATIO;
        $scope.elementSetKeepRatio();

        ft.setOpts({'drag':['self']});

        return ie;
      }

      $scope.handleFtChanged = function (ft, events) {
        if (events.indexOf('rotate') >= 0) {
          $scope.elementChangedRotation(ft.attrs.rotate);
          $scope.$apply();
        }
        if (events.indexOf('scale') >= 0) {
          $scope.elementChangedHeight(ft.attrs.scale.y);
          $scope.elementChangedWidth(ft.attrs.scale.x);
          $scope.$apply();
        }
        hTextEdit.updateCaretPosition();
      };

      // Unselects an element
      function unfocus(){
        $log.debug('Unfocus');
        //$scope.current = null;
        hTextEdit.removeCaret();
        setCurrent(null);
      }
      $scope.unfocus = unfocus;

      //
      $scope.isFlipped = function() {
        var dir = ($scope.current.mirror) ? -1 : 1;
        return dir;
      };

      // Adds an image as a raphael element from its url
  		$scope.addImage = function(src, x, y){
  			var size = hTools.getSizeOfImage(src);
        x=(x)?x:(WIDTH - size.w)/2;
        y=(y)?y:(HEIGHT - size.h)/2;
        if(size.h === 0 || size.w === 0){
          return;
        }
        $log.debug(size);
  			var ie = paper.image(src, x, y, size.w, size.h);  // TODO
  			return addElement(ie);
  		};

      // Removes an element
      $scope.remove = function() {
        if($scope.current) {
          hElement.remove($scope.current);
          unfocus();
        }
      };

      $scope.bringToFront = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.toFront();
      };

      $scope.bringToBack = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.toBack();
        background.toBack();
      };


      //modified by sliders 
      $scope.elementSetHeight = function(){
        if(!$scope.current) {
          return;
        }        
        
        if($scope.current.keepratio) {
          $scope.current.ft.attrs.scale.x = hElement.elementRatio($scope.current) * $scope.current.height;
          $scope.elementChangedWidth($scope.current.ft.attrs.scale.x);
          $scope.current.ft.attrs.scale.y = $scope.current.height;
        } else {
          $scope.current.ft.attrs.scale.y = $scope.current.height;
          $scope.current.ft.attrs.ratio = hElement.elementRatio($scope.current);
        }                       
        $scope.current.ft.apply();
        hTextEdit.updateCaretPosition();
      };

      //modified by sliders 
      $scope.elementSetWidth = function(){
        if(!$scope.current) {
          return;
        }        
        if($scope.current.keepratio){
          $scope.current.ft.attrs.scale.y = $scope.isFlipped() * $scope.current.width / hElement.elementRatio($scope.current);
          $scope.elementChangedHeight($scope.current.ft.attrs.scale.y);
          $scope.current.ft.attrs.scale.x = $scope.isFlipped() * $scope.current.width;
        } else {
          $scope.current.ft.attrs.scale.x = $scope.isFlipped() * $scope.current.width;
          $scope.current.ft.attrs.ratio = hElement.elementRatio($scope.current);
        }        
        $scope.current.ft.apply();
        hTextEdit.updateCaretPosition();
      };

      //modified by handles 
      $scope.elementChangedHeight = function(height){
        if(!$scope.current) {
          return;
        }
        hElement.setHeight($scope.current, height);
        hTextEdit.updateCaretPosition();
      };

      //modified by handles 
      $scope.elementChangedWidth = function(width){
        if(!$scope.current) {
          return;
        }
        hElement.setWidth($scope.current, width);
        hTextEdit.updateCaretPosition();
      };

      //modified by handles 
      $scope.elementChangedRotation = function(angle){
        if(!$scope.current) {
          return;
        }
        angle=Math.floor(angle);
        hElement.setRotation($scope.current, angle);
        hTextEdit.updateCaretPosition();
      };

      $scope.elementSetRotation = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.ft.attrs.rotate=$scope.current.rotation;
        $scope.current.ft.apply();
        hTextEdit.updateCaretPosition();
      };

      $scope.elementSetKeepRatio = function(){
        hElement.setKeepRatio($scope.current);
      };

      $scope.elementSetMirror = function() {
        if(!$scope.current) {
          return;
        }
        hElement.setMirror($scope.current);
        hTextEdit.updateCaretPosition();
      };

      $scope.elementSetOpacity = function(){
        if(!$scope.current) {
          return;
        }
        $scope.current.attr({opacity: $scope.current.opacity}); 
      };
      
      $scope.elementChangeFont = function() {
        if(!$scope.current || $scope.current.type !== 'text') {
          return;
        }

        $scope.current.attr({'text-anchor': 'start', 'font-family': $scope.font.font, 'font-size': $scope.font.size+'px' || constants.TEXT_DEFAULT_SIZE, 'fill': $scope.fontColor});
        $timeout(hTextEdit.updateCaretPosition,10);
      };

      function scaleFactors(x, y){
        var paperElement = $('#paper');
        var pw = paperElement.width(), ph = pw / constants.W * constants.H, actualHeight = paperElement.height();
        return [x / pw * constants.W, (y / ph * constants.H) - (actualHeight - ph)/2];
      }

      $scope.backgroundMousedownHandler = function (evt) {
        $scope.backgroundDown = true;
        if($scope.brush){
          return;
        }
        if(!$scope.font){
          return;
        }
        var sf = scaleFactors(evt.layerX, evt.layerY);
        var text = paper.text(sf[0], sf[1], 'H').attr({'text-anchor': 'start', 'font-family': $scope.font.font, 'font-size': $scope.font.size+'px', 'fill': $scope.fontColor});
        addElement(text);
        $scope.caret = 0;
        //text[0].textContent = '';
        text.attr({text: ''});
        text.inited = true;
        // set text handles size
        var tesxtFt = paper.freeTransform(text);
        tesxtFt.setOpts({distance: $scope.constants.ELEMENT_TEXT_HANDLE_DISTANCE});

        $scope.$apply();
      };

      var background = paper.rect(0, 0, WIDTH, HEIGHT);
      background.mousedown($scope.backgroundMousedownHandler);
      background.attr({'fill':'url('+constants.backgrounds[0]+')', 'fill-opacity':'1', 'stroke':'none'});
      background.background = true;
      $scope.backgroundElement = background;

      function paperUnfocus(){
        $scope.backgroundDown = false;
      }

      background.mouseup(paperUnfocus);
      //background.mouseout(paperUnfocus);

      $('#paper').mouseup(paperUnfocus);
      $('#paper').mouseleave(paperUnfocus);

      $scope.setBackground = function(imgUrl){
        background.attr({'fill':'url('+imgUrl+')', 'fill-opacity':'1', 'stroke':'none'});
      };

      // Drag & drop

      $scope.dragDropItemBank = function(event, ui) {
        var src=ui.draggable.context.currentSrc;
        var x = ui.offset.left - $('#paper').offset().left;
        var y = ui.offset.top - $('#paper').offset().top;
        var sf = scaleFactors(x, y);
        $scope.addImage(src, sf[0], sf[1]);
      };

      // Brushes

      function brushHandler(evt){
        if($scope.backgroundDown && $scope.brush){
          if(!$scope.brush.timeStamp || (evt.timeStamp - $scope.brush.timeStamp) >= $scope.brush.speed){
            $scope.brush.timeStamp = evt.timeStamp;
            $log.debug('Brush event');
            var paperOffset = $('#paper').offset();
            var img = $scope.brush.images[hTools.randInt(0, $scope.brush.images.length -1)];

            var imgSize = hTools.getSizeOfImage(img.img);

            var x = evt.pageX - paperOffset.left - imgSize.w/4;
            var y = evt.pageY - paperOffset.top - imgSize.h/4;
            var sf = scaleFactors(x,y);

            var element = $scope.addImage(img.img, sf[0], sf[1]);

            var rot = hTools.randInt(-$scope.brush.randRotationRange, $scope.brush.randRotationRange);
            hElement.setRotation(element, rot);

            var scale = $scope.brush.scale * (img.scale || 1) * ($scope.brush.randScaleRange ?  (1 - hTools.rand(-$scope.brush.randScaleRange * 100, $scope.brush.randScaleRange * 100) / 100) : 1);
            element.ft.attrs.scale.y = scale;
            $scope.elementChangedHeight(element.ft.attrs.scale.y);
            element.ft.attrs.scale.x = scale;
            $scope.elementChangedWidth(element.ft.attrs.scale.x);
            element.ft.apply();

            var mirror = ($scope.brush.mirror && !img.mirror) || (!$scope.brush.mirror && img.mirror);
            if(mirror){
              hElement.setMirror(element);
            }
            if($scope.brush.randMirror ? (hTools.randInt(0,1)) : false){
              hElement.setMirror(element);
            }
          }
        }
      }

      $scope.setBrush = function (brush){
        background.unmousemove(brushHandler);
        unfocus();
        if($scope.brush && brush.name === $scope.brush.name){
          $scope.brush.classe=undefined;
          $scope.brush = undefined;
        }
        else{
          if($scope.brush){
            $scope.brush.classe=undefined;
          }
          $scope.brush = brush;
          $scope.brush.classe='brush-active';
          //background.mousemove(brushHandler);
          $('#paper').mousemove(brushHandler);
        }
      };

      $scope.export = function(){
        $log.debug('Exporting');
        // Unfocus to remove handles from elements
        unfocus();
        hExport(constants.RAPHAEL_PAPER, 'canvas', 'TheGloriousTaleOfBayeux.png', paper);
      };

      $scope.setFontColor = function(color) {
        $scope.current.attr({ fill: color});
        $scope.fontColor = color;
        if($scope.caretPointer){
          $scope.caretPointer.attr({ fill: color});
        }
      };

      $scope.$on('$destroy', function () {
        hTextEdit.destroy();
      });

      function init(){
        hTextEdit.init($scope);
        hHotkeys($scope);
        paper.canvas.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space','preserve');
        $timeout(function(){$scope.$apply();});
      }

      $scope.save = function(){
        unfocus();
        hSave.save(paper, 'TheLegendaryManuscript.htck');
      };

      $scope.startImport = function(){
        angular.element('#import-file-chooser').trigger('click');
      };

      // triggers when file is selected
      angular.element('#import-file-chooser')[0].onchange = function (changeEvt) {
        if(!changeEvt.target.files || !changeEvt.target.files.length){
          return;
        }
        var file = changeEvt.target.files[0]; // FileList object

        var reader = new FileReader();
        reader.onloadend = function (loadEndEvt) {
            hSave.import(loadEndEvt.target.result, paper, $scope);
        };

        reader.readAsText(file);
      };

      init();
  });
