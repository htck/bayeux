'use strict';

/* globals constants */
angular.module('htckApp').factory('hTextEdit', function ($document, $log, $interval) {
  var scope = {};

  function init(parent){
    $document.on('keypress', handleKeyPress);
    $document.on('keydown', handleKeyDown);
    scope = parent.$new();
  }

  function destroy(){
    $interval.cancel(caretBlinker);
    $document.off('keypress', handleKeyPress);
    $document.off('keydown', handleKeyDown);
  }

  function blinkCaret(){
    if(scope.$parent.caretPointer){
      scope.$parent.caretPointer.attr({'fill-opacity': 1 - scope.$parent.caretPointer.attr('fill-opacity')});
    }
  }

  var caretBlinker = $interval(blinkCaret, 500);

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

  function handleKeyDown(evt) {
    var forward = false;
    if(evt.keyCode === 32) {
      evt.key = ' ';
      forward = true;
    }
    else if(evt.keyCode === 8 || evt.keyCode === 37 || evt.keyCode === 39){
      forward = true;
    }
    if(forward){
      handleKeyPress(evt);
    }
  }

  function handleKeyPress (evt) {
    if(!evt.key){ // chrome
      evt.key = String.fromCharCode(evt.which);
    }
    if(!scope.$parent.current || scope.$parent.current.type !== 'text'){
      return;
    }
    $log.debug(evt);
    if(evt.key === 'Backspace' || evt.keyCode === 8) {
      evt.preventDefault();
      if(scope.$parent.current[0].textContent.length && scope.$parent.caret > 0){
        scope.$parent.current.attr({text: scope.$parent.current[0].textContent.substr(0,scope.$parent.caret-1)+scope.$parent.current[0].textContent.substr(scope.$parent.caret)});
        scope.$parent.caret--;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    if(evt.key === 'ArrowLeft' || evt.keyCode === 37) {
      if(scope.$parent.caret > 0){
        scope.$parent.caret--;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    if(evt.key === 'ArrowRight' || evt.keyCode === 39) {
      if(scope.$parent.caret < scope.$parent.current[0].textContent.length){
        scope.$parent.caret++;
        updateCaretPosition();
      }
      evt.stopPropagation();
      evt.preventDefault();
      return;
    }
    // Check if allowed character
    if((!evt.key.match(constants.ENABLED_CHARACTERS)) && (evt.key !== ' ') || evt.key.length > 1){
      return;
    }
    var k = (evt.key === ' ') ? ' ' : (scope.$parent.font.uppercase ? evt.key.toUpperCase() : evt.key);

    //scope.$parent.current[0].textContent = scope.$parent.current[0].textContent.substr(0,scope.$parent.caret)+k+scope.$parent.current[0].textContent.substr(scope.$parent.caret);
    scope.$parent.current.attr({text: scope.$parent.current[0].textContent.substr(0,scope.$parent.caret)+k+scope.$parent.current[0].textContent.substr(scope.$parent.caret)});
    scope.$parent.caret++;
    updateCaretPosition();

    evt.stopPropagation();
    evt.preventDefault();
  }

  function popChar (textElement) {
    if(!textElement || textElement.type !== 'text'){
      return;
    }

    textElement.attr({text: textElement[0].textContent.substr(0,scope.$parent.caret-1)+textElement[0].textContent.substr(scope.$parent.caret)});
    textElement.caret--;
    updateCaretPosition();
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

  function toUpperCase(textElement) {
    if(!textElement || textElement.type !== 'text'){
      return;
    }
    textElement.attr({text: textElement[0].textContent.toUpperCase()});
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
    removeCaret: removeCaret,
    popChar: popChar,
    toUpperCase: toUpperCase
  };
});