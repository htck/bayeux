'use strict';

/* globals constants */
angular.module('htckApp').factory('hHotkeys', function(hotkeys, hElement) {
  function init(parent) {
    var scope = parent.$new();
    // Hotkeys

    hotkeys.add({
      combo: 'del',
      description: 'Removes currently selected element',
      callback: scope.$parent.remove
    });

    hotkeys.add({
      combo: 'esc',
      description: 'Unfocuses from currently selected element',
      callback: scope.$parent.unfocus
    });

    hotkeys.add({
      combo: 'space',
      description: 'Bring currently selected element to the front',
      callback: function (event){
        event.preventDefault();
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          return;
        }
        scope.$parent.bringToFront();
      }
    });

    hotkeys.add({
      combo: 'ctrl+space',
      description: 'Puts currently selected element to the back',
      callback: function (event){
        event.preventDefault();
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          return;
        }
        scope.$parent.bringToBack();
      }
    });

    hotkeys.add({
      combo: 'ctrl+shift+s',
      description: 'Exports canvas to png',
      callback: function (event){
        event.preventDefault();
        scope.$parent.export();
      }
    });

    hotkeys.add({
      combo: 'ctrl+m',
      description: 'Mirrors currently selected element',
      callback: scope.$parent.elementSetMirror
    });

    hotkeys.add({
      combo: 'up',
      description: 'Slightly moves currently selected element up',
      callback: function(event) {
        event.preventDefault();
        hElement.move(scope.$parent.current, 0, -constants.ELEMENT_DISPLACEMENT);
      }
    });

    hotkeys.add({
      combo: 'down',
      description: 'Slightly moves currently selected element down',
      callback: function(event) {
        event.preventDefault();
        hElement.move(scope.$parent.current, 0, constants.ELEMENT_DISPLACEMENT);
      }
    });

    hotkeys.add({
      combo: 'right',
      description: 'Slightly moves currently selected element to the right',
      callback: function(event) {
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          return;
        }
        event.preventDefault();
        hElement.move(scope.$parent.current, constants.ELEMENT_DISPLACEMENT, 0);
      }
    });

    hotkeys.add({
      combo: 'left',
      description: 'Slightly moves currently selected element to the left',
      callback: function(event) {
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          return;
        }
        event.preventDefault();
        hElement.move(scope.$parent.current, -constants.ELEMENT_DISPLACEMENT, 0);
      }
    });
  }

  return init;
});