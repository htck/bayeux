'use strict';

/* globals constants */
angular.module('htckApp').factory('hHotkeys', function (hotkeys, hElement, hTextEdit, hPages) {
  function init(parent) {
    var scope = parent.$new();
    // Hotkeys
    scope.$parent.hotkeys = hotkeys;

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
      combo: 'ctrl+m',
      description: 'Mirrors currently selected element',
      callback: function(){
        scope.$parent.elementSetMirror();
        if(scope.$parent.current && scope.$parent.current.type ==='text'){
          hTextEdit.popChar(scope.$parent.current);
        }
      }
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

    hotkeys.add({
      combo: 'ctrl+left',
      description: 'Slightly rotates currently selected element counter clock-wise',
      callback: function(event) {
        event.preventDefault();
        hElement.rotate(scope.$parent.current, -constants.ELEMENT_ROTATION);
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          scope.$parent.caret = scope.$parent.current[0].textContent.length+1;
          hTextEdit.updateCaretPosition();
        }
      }
    });

    hotkeys.add({
      combo: 'ctrl+right',
      description: 'Slightly rotates currently selected element clock-wise',
      callback: function(event) {
        event.preventDefault();
        hElement.rotate(scope.$parent.current, constants.ELEMENT_ROTATION);
        if(!scope.$parent.current || scope.$parent.current.type ==='text'){
          scope.$parent.caret = scope.$parent.current[0].textContent.length;
          hTextEdit.updateCaretPosition();
        }
      }
    });


    hotkeys.add({
      combo: 'ctrl+s',
      description: 'Saves draft file for further edit',
      callback: function(evt){
        evt.preventDefault();
        scope.$parent.save();
      }
    });

    // hotkeys.add({
    //   combo: 'ctrl+o',
    //   description: 'Open previously saved file',
    //   callback: function(evt){
    //     evt.preventDefault();
    //     scope.$parent.startImport();
    //     if(scope.$parent.current && scope.$parent.current.type ==='text'){
    //       hTextEdit.popChar(scope.$parent.current);
    //     }
    //   }
    // });

    hotkeys.add({
      combo: 'ctrl+shift+s',
      description: 'Exports canvas to png',
      callback: function (event){
        event.preventDefault();
        scope.$parent.export();
      }
    });

    hotkeys.add({
      combo: 'ctrl+shift+g',
      description: 'Exports pages to gif',
      callback: function (event){
        event.preventDefault();
        // if(scope.$parent.current && scope.$parent.current.type ==='text'){
        //   hTextEdit.popChar(scope.$parent.current);
        // }
        hPages.exportGIF(null);
      }
    });

    hotkeys.add({
      combo: 'ctrl+c',
      description: 'Copies currently selected element to clipboard',
      callback: function (event){
        event.preventDefault();
        scope.$parent.copy();
      }
    });

    hotkeys.add({
      combo: 'ctrl+v',
      description: 'Pastes clipboard content',
      callback: function (event){
        event.preventDefault();
        scope.$parent.paste();
      }
    });

    hotkeys.add({
      combo: 'ctrl+h',
      description: 'Show / hide this help menu',
      callback: function (event){
        event.preventDefault();
        hotkeys.toggleCheatSheet();
      }
    });
  }

  return init;
});