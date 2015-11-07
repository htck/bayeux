'use strict';

angular.module('htckApp').factory('hElement', function() {
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

  return {
    move: move,
    remove: remove
  };
});