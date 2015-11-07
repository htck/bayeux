'use strict';

angular.module('htckApp').factory('hTextEdit', function ($document, $log, $timeout) {
  var scope = {};

  function init(parent){
    $document.on('keydown', handleKeyPress);
    scope = parent.$new();
  }

  function destroy(){
    $timeout.cancel(caretBlinker);
    $document.off('keydown', handleKeyPress);
  }

  function blinkCaret(){
    return $timeout(function (){
      if(scope.$parent.caretPointer){
        scope.$parent.caretPointer.attr({'fill-opacity': 1 - scope.$parent.caretPointer.attr('fill-opacity')});
      }
      caretBlinker = blinkCaret();
    }, 1000);
  }

  var caretBlinker = blinkCaret();

  function updateCaretPosition() {
    if(!scope.$parent.current || scope.$parent.current.type !== 'text'){
      return;
    }
    var cloneText = scope.$parent.current.clone();
    cloneText.attr({'fill':'blue'});
    var x = cloneText.attr('x');
    cloneText.attr({text: scope.$parent.current[0].textContent.substr(0, scope.$parent.caret)});
    var w = cloneText.getBBox(true).width;
    if(scope.$parent.caret === 0){
      cloneText.attr({text:''});
      w = 0;
    }

    scope.$parent.caretPointer.attr({x: x+w});

    // Transform pointer
    scope.$parent.caretPointer.transform(scope.$parent.current.transform());

    scope.$parent.caretPointer.attr({'fill-opacity': 1});

    cloneText.remove();
  }

  function handleKeyPress (evt) {
    if(!scope.$parent.current || scope.$parent.current.type !== 'text'){
      return;
    }
    $log.debug(evt);
    if(evt.key === 'Backspace') {
      if(scope.$parent.current[0].textContent.length && scope.$parent.caret > 0){
        scope.$parent.current.attr({text: scope.$parent.current[0].textContent.substr(0,scope.$parent.caret-1)+scope.$parent.current[0].textContent.substr(scope.$parent.caret)});
        scope.$parent.caret--;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    if(evt.key === 'ArrowLeft') {
      if(scope.$parent.caret > 0){
        scope.$parent.caret--;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    if(evt.key === 'ArrowRight') {
      if(scope.$parent.caret < scope.$parent.current[0].textContent.length){
        scope.$parent.caret++;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    // Check if letter key
    if((!evt.key.match('^[a-zA-Z]$')) && (evt.key !== ' ') || evt.key.length > 1){ // TODO better regex
      return;
    }
    var k = (evt.key === ' ') ? ' ' : evt.key.toUpperCase();

    //scope.$parent.current[0].textContent = scope.$parent.current[0].textContent.substr(0,scope.$parent.caret)+k+scope.$parent.current[0].textContent.substr(scope.$parent.caret);
    scope.$parent.current.attr({text: scope.$parent.current[0].textContent.substr(0,scope.$parent.caret)+k+scope.$parent.current[0].textContent.substr(scope.$parent.caret)});
    scope.$parent.caret++;
    updateCaretPosition();

    evt.stopPropagation();
    evt.preventDefault();
  }

  function addCaret() {
    removeCaret();
    scope.$parent.caret = scope.$parent.current[0].textContent.length;
    if(!scope.$parent.current.inited){
      scope.$parent.caret = 0;
    }

    var x = scope.$parent.current.attr('x');
    var y = scope.$parent.current.attr('y');
    var h = scope.$parent.current.getBBox(true).height;


    scope.$parent.caretPointer = scope.$parent.paper.rect(x-1, y-(h * 3/5), 3, h);
    scope.$parent.caretPointer.attr({'fill':scope.$parent.current.attr('fill'), 'stroke':'none'});

    updateCaretPosition();
  }

  function removeCaret() {
    if(!scope.$parent.caretPointer){
      return;
    }
    scope.$parent.caretPointer.remove();
    scope.$parent.caretPointer = null;
  }

  return {
    init:init,
    destroy:destroy,
    updateCaretPosition: updateCaretPosition,
    addCaret: addCaret,
    removeCaret: removeCaret
  };
});