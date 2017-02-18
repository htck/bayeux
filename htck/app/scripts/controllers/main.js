'use strict';

/* globals constants */
/* globals Raphael */
/* globals $ */
angular.module('htckApp').controller('MainCtrl', function ($scope, $timeout, $log, $document, $mdSidenav, hExport, hTextEdit, hHotkeys, hElement, hTools, hSave, hPages) {
  		$scope.constants = constants;

      $scope.setCurrent = function(newCurrent) {
        if($scope.current && newCurrent && $scope.current.id === newCurrent.id){
          return;
        }
        if($scope.current && $scope.current.type === 'text' && !$scope.current[0].textContent.length) {
          hElement.remove($scope.current);
        }
        if($scope.current && $scope.current.ft){
          hElement.handles($scope.current);
        }
        
        $scope.current = newCurrent;

        if($scope.current) {
          hElement.handles($scope.current, true);
        }
        if($scope.current && $scope.current.type === 'text') {
          hTextEdit.addCaret();
        }
        else{
          hTextEdit.removeCaret();
        }
      };

      $scope.provisionElement = function(ie) {
        var ft = $scope.paper.freeTransform(ie, {}, hTools.debounce(freeTransformCallback), $scope.constants.DEBOUNCE);
        
        // to make this work free_transform plugin must implement range.scale for x AND y 
        //ft.setOpts({range: {scale: [$scope.constants.ELEMENT_SCALE_MIN*ft.attrs.size.x, $scope.constants.ELEMENT_SCALE_MAX*ft.attrs.size.y] } });

        ie.ft = ft;
        $scope.setCurrent(ie);

        // set default values
        ft.attrs.y=constants.ELEMENT_DEFAULT_HEIGHT;
        hElement.setHeight($scope.current, ft.attrs.y);

        ft.attrs.x=constants.ELEMENT_DEFAULT_WIDTH;
        hElement.setWidth($scope.current, ft.attrs.x);

        ft.attrs.rotate=constants.ELEMENT_DEFAULT_ROTATION;
        hElement.setRotation($scope.current, ft.attrs.rotate);

        ie.opacity = 1;

        ie.keepratio = constants.ELEMENT_DEFAULT_KEEPRATIO;
        $scope.elementSetKeepRatio();

        ft.setOpts({'drag':['self']});

        if(ie.type === 'text'){
          ft.setOpts({distance: $scope.constants.ELEMENT_TEXT_HANDLE_DISTANCE});
        }

        ie.ft.handles.y.line.handle=true;
        ie.ft.handles.x.line.handle=true;
        ie.ft.handles.x.disc.handle=true;
        ie.ft.handles.y.disc.handle=true;

      };

      // Callback for freeTransform
      function freeTransformCallback(ft, events) {
        $scope.setCurrent(ft.subject);
        $scope.handleFtChanged(ft, events);
      }

      // Should be called when creating a raphael element
      function addElement(ie){
        $scope.provisionElement(ie);
        return ie;
      }

      $scope.handleFtChanged = function (ft, events) {
        if (events.indexOf('rotate') !== -1) {
          hElement.setRotation($scope.current, ft.attrs.rotate);
        }
        if (events.indexOf('scale') !== -1) {
          $scope.elementChangedHeight(ft.attrs.scale.y);
          $scope.elementChangedWidth(ft.attrs.scale.x);
        }
        hTextEdit.updateCaretPosition();
      };

      // Unselects an element
      function unfocus(){
        $log.debug('Unfocus');
        //$scope.current = null;
        hTextEdit.removeCaret();
        $scope.setCurrent(null);
      }
      $scope.unfocus = unfocus;

      //
      $scope.isFlipped = function() {
        var dir = ($scope.current.mirror) ? -1 : 1;
        return dir;
      };

      // Adds an image as a raphael element from its url
  		function addImage (src, x, y){
  			var size = hTools.getSizeOfImage(src);
        x=(x)?x:(constants.W - size.w)/2;
        y=(y)?y:(constants.H - size.h)/2;
        if(size.h === 0 || size.w === 0){
          return;
        }
        $log.debug(size);
  			var ie = $scope.paper.image(src, x, y, size.w, size.h);  // TODO
  			return addElement(ie);
  		}

      $scope.addImage = function(src, x, y){
        $scope.setBrush(undefined);
        addImage(src, x, y);
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
        $scope.backgroundElement.toBack();
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
        hElement.setHeight($scope.current, height);
      };

      //modified by handles 
      $scope.elementChangedWidth = function(width){
        hElement.setWidth($scope.current, width);
      };

      // modified by slider
      $scope.elementSetRotation = function(){
        hElement.setRotation($scope.current, $scope.current.rotation);
        hTextEdit.updateCaretPosition();
      };

      $scope.elementSetKeepRatio = function(){
        hElement.setKeepRatio($scope.current);
      };

      $scope.elementSetMirror = function() {
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
        if($scope.font.uppercase){
          hTextEdit.toUpperCase($scope.current);
        }
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
        var text = $scope.paper.text(sf[0], sf[1], 'H').attr({'text-anchor': 'start', 'font-family': $scope.font.font, 'font-size': $scope.font.size+'px', 'fill': $scope.fontColor});
        addElement(text);
        $scope.caret = 0;
        //text[0].textContent = '';
        text.attr({text: ''});
        text.inited = true;

        $scope.$apply();
      };

      $scope.paperUnfocus = function (){
        $scope.backgroundDown = false;
      };

      $scope.setBackground = function(imgUrl){
        $scope.backgroundElement.attr({'fill':'url('+imgUrl+')', 'fill-opacity':'1', 'stroke':'none'});
      };

      // Drag & drop

      $scope.dragDropItemBank = function(event, ui) {
        var src = ui.draggable[0].src;
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

            var element = addImage(img.img, sf[0], sf[1]);

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
        $scope.backgroundElement.unmousemove(brushHandler);
        unfocus();
        if($scope.brush && brush && brush.name === $scope.brush.name){
          $scope.brush.classe=undefined;
          $scope.brush = undefined;
        }
        else{
          if($scope.brush){
            $scope.brush.classe=undefined;
          }
          $scope.brush = brush;
          if($scope.brush){
            $scope.brush.classe='brush-active';
            //background.mousemove(brushHandler);
            $('#paper').mousemove(brushHandler);
          }
        }
      };

      $scope.export = function(){
        $log.debug('Exporting');
        // Unfocus to remove handles from elements
        unfocus();
        $scope.exportPNGRunning = true;
        hExport.exportOnePNG(constants.RAPHAEL_PAPER, 'canvas', 'TheGloriousTaleOfBayeux.png', $scope.paper, function(){
          $scope.exportPNGRunning = false;
        });
      };

      $scope.exportAll = function(){
        hExport.exportManyPNG($scope, constants.RAPHAEL_PAPER, 'canvas', 'TheGloriousTaleOfBayeux');
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

      $scope.save = function(){
        unfocus();
        hSave.save(hPages.pages, 'TheLegendaryManuscript.htck');
      };

      $scope.startImport = function(){
        angular.element('#import-file-chooser').trigger('click');
      };

      $scope.paste = function(){
        if(!$scope.clipboard){
          return;
        }

        var c = hElement.clone($scope.clipboard, $scope.provisionElement);
        // Put out of sight
        hElement.move(c, -constants.W * 2, 0);
        if(c.type === 'text'){
            hTextEdit.addCaret();
        }
      };

      function testSame(first, copy){
        return first &&
               copy &&
               first.id === copy.origId &&
               first.keepratio === copy.keepratio &&
               first.height === copy.height &&
               first.width === copy.width &&
               first.rotation === copy.rotation &&
               first.opacity === copy.opacity;
      }

      $scope.copy = function(){
        var element = $scope.current;
        if(!element || ($scope.clipboard && testSame(element, $scope.clipboard)) || (element.type === 'text' && !element[0].textContent.length)){
          return;
        }
        // Erase clipboard
        if($scope.clipboard){
          hElement.remove($scope.clipboard);
          delete $scope.clipboard;
        }

        var c = hElement.clone(element, $scope.provisionElement);
        // Put out of sight
        hElement.move(c, constants.W * 2, 0);

        $scope.clipboard = c;
        $scope.clipboard.tmpClone = true;
        $timeout(function(){$scope.setCurrent(element);},5);

        $log.debug('Copied to clipboard');
      };

      $scope.initBackground = function(background) {
        $scope.backgroundElement = background;
        $scope.backgroundElement.background = true;
        $scope.backgroundElement.mousedown($scope.backgroundMousedownHandler);
        $scope.backgroundElement.mouseup($scope.paperUnfocus);
      };

      function init(){
        $scope.font = (constants.fonts && constants.fonts.length) ? constants.fonts[0] : undefined;
        $scope.fontColor = (constants.colors && constants.colors.length) ? constants.colors[0] : constants.TEXT_DEFAULT_FONT_COLOR;
        
        $scope.headerStyle = {};
        if($scope.font){
          $scope.headerStyle = {
            'font-family': $scope.font.font,
            'text-transform': $scope.font.uppercase ? 'uppercase' : 'none'
          };
        }

        var paper = new Raphael(constants.RAPHAEL_PAPER, constants.W, constants.H);
        $scope.paper = paper;
        $log.debug('Paper', paper);
        paper.setViewBox(0,0,constants.W,constants.H,true);
        paper.setSize('100%', '100%');
        paper.canvas.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space','preserve');

        var background = $scope.paper.rect(0, 0, constants.W,constants.H);
        background.attr({'fill':'url('+constants.backgrounds[0]+')', 'fill-opacity':'1', 'stroke':'none'});
        $scope.initBackground(background);

        $('#paper').mouseup($scope.paperUnfocus);
        $('#paper').mouseleave($scope.paperUnfocus);

        hTextEdit.init($scope);
        hSave.init($scope);
        hHotkeys($scope);
        hPages.init($scope);

        $scope.hPages = hPages;

        $timeout(function(){$scope.$apply();});
        $timeout(function(){$('#itembank').redraw();},20);    // Chrome redraw for itembank
        $timeout(function(){$('#itembank').redraw();},1000);  // Chrome redraw for itembank
      }


      init();
  });
