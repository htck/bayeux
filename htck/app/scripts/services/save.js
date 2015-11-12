'use strict';

/* globals saveAs */
angular.module('htckApp').factory('hSave', function (hElement) {
  function save(paper, fileName){
    // Serialize as json
    var json = paper.toJSON(function(el, data){ // For each element

      if(el.background){
        data.background = true;
      }
      // Save properties
      data.height = el.height;
      data.width = el.width;
      data.rotation = el.rotation;
      data.opacity = el.opacity;
      data.keepratio = el.keepratio;
      data.mirror = el.mirror;

      if(el.ft){
        data.ft = el.ft.attrs;
      }
      return data;
    });

    var jsonBlob = new Blob([json], {type: 'text/plain;charset=utf-8'});
    saveAs(jsonBlob, fileName);
  }

  function importFromJson(json, paper, scope){
    paper.clear();
    // Deserialize from json
    paper.fromJSON(json, function (el, data){
      // Restore properties
      el.height = data.height;
      el.width = data.width;
      el.rotation = data.rotation;
      el.opacity = data.opacity;
      el.keepratio = data.keepratio;
      el.mirror = data.mirror;

      // Restore event handlers
      if(data.background){
        el.background = true;
        scope.backgroundElement = el;
        scope.backgroundElement.mousedown(scope.backgroundMousedownHandler);
        scope.backgroundElement.mouseup(scope.paperUnfocus);
      } else if(data.ft){
        el.mousedown(scope.elementMouseDown);

        // Restore freeTransform
        var ft = paper.freeTransform(el, {}, function(ft, events) {
          scope.handleFtChanged(ft, events);
        });

        el.ft = ft;
        el.ft.attrs = data.ft;

        hElement.setHeight(el, ft.attrs.y);
        hElement.setWidth(el, ft.attrs.x);
        hElement.setRotation(el, ft.attrs.rotate);
        hElement.setKeepRatio(el);

        ft.setOpts({'drag':['self']});

        if(el.type === 'text'){
          ft.setOpts({distance: scope.constants.ELEMENT_TEXT_HANDLE_DISTANCE});
          el.inited = true;
        }
        ft.hideHandles();
      }

      return el;
    });
  }

  return {
    save: save,
    import: importFromJson
  };
});