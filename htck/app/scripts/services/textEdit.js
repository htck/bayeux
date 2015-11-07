'use strict';

angular.module('htckApp').factory('hTextEdit', function ($document, $log) {
  var scope = {};

  function init(parent){
    $document.on('keydown', handleKeyPress);
    scope = parent.$new();
  }

  function destroy(){
    $document.off('keydown', handleKeyPress);
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
  return {
    init:init,
    destroy:destroy
  };
});