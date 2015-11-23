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
    element.rotation = Math.floor(angle);
    element.ft.attrs.rotate=element.rotation;
    element.ft.apply();
  }

  function rotate(element, angleDiff){
    if(!element){
      return;
    }
    setRotation(element, element.rotation + angleDiff);
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

  function handles(element, show) {
    // What is quicker, this or Set.forEach ?
    element.ft.handles.x.disc.attr({opacity: show ? 1 : 0});
    element.ft.handles.y.disc.attr({opacity: show ? 1 : 0});
    element.ft.handles.x.line.attr({opacity: show ? 1 : 0});
    element.ft.handles.y.line.attr({opacity: show ? 1 : 0});
  }

  function clone(element, provisionFn){
    if(!element){
      return;
    }

    var c = element.clone();
    c.origId = element.id;
    provisionFn(c);
    c.keepratio = element.keepratio;
    c.height = element.height;
    c.width = element.width;
    c.rotation = element.rotation;
    setRotation(c, c.rotation);
    c.opacity = element.opacity;
    c.caret = element.caret;
    c.inited = element.inited;

    return c;
  }

  return {
    move: move,
    remove: remove,
    setHeight: setHeight,
    setWidth: setWidth,
    setRotation: setRotation,
    setKeepRatio: setKeepRatio,
    setMirror: setMirror,
    elementRatio: elementRatio,
    handles: handles,
    rotate: rotate,
    clone: clone
  };
});