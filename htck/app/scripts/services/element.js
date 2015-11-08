'use strict';

angular.module('htckApp').factory('hElement', function() {

  function elementRatio(element){
    return element.ft.attrs.scale.x / element.ft.attrs.scale.y; 
  }

  // Moves the element
  function move(element, dx, dy) {
    if(!element) {
      return;
    }

    element.ft.attrs.translate.x += dx;
    element.ft.attrs.translate.y += dy;

    element.ft.apply();
  }

  function remove(element) {
    if(!element) {
      return;
    }
    element.ft.unplug();
    element.remove();
  }

  function setHeight(element, height){
    if(!element){
      return;
    }
    element.height = Math.abs(height);
  }

  function setWidth(element, width){
    if(!element){
      return;
    }
    element.width = Math.abs(width);
  }

  function setRotation(element, angle){
    if(!element){
      return;
    }
    element.rotation = angle;
    element.ft.attrs.rotate=element.rotation;
    element.ft.apply();
  }

  function setKeepRatio(element){
    if(!element) {
      return;
    }
    element.ft.setOpts({keepRatio: element.keepratio});
  }

  function setMirror(element) {
    if(!element) {
      return;
    }
    element.ft.attrs.scale.x = - element.ft.attrs.scale.x;
    element.ft.attrs.ratio = elementRatio(element);
    element.ft.apply();
  }

  return {
    move: move,
    remove: remove,
    setHeight: setHeight,
    setWidth: setWidth,
    setRotation: setRotation,
    setKeepRatio: setKeepRatio,
    setMirror: setMirror,
    elementRatio: elementRatio
  };
});