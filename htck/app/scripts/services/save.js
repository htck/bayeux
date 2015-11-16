'use strict';

/* globals saveAs */
angular.module('htckApp').factory('hSave', function (hElement) {
  var scope = {};

  function init(parent){
    scope = parent.$new();
    // triggers when file is selected
    angular.element('#import-file-chooser')[0].onchange = changeEventHandler;
  }

  function changeEventHandler(changeEvt) {
    if(!changeEvt.target.files || !changeEvt.target.files.length){
      return;
    }
    var file = changeEvt.target.files[0]; // FileList object

    var reader = new FileReader();
    reader.onloadend = function (loadEndEvt) {
        importFromJson(loadEndEvt.target.result);
    };

    reader.readAsText(file);
  }

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

  function importFromJson(json){
    scope.$parent.paper.clear();
    // Deserialize from json
    scope.$parent.paper.fromJSON(json, function (el, data){
      // Restore properties
      el.height = data.height;
      el.width = data.width;
      el.rotation = data.rotation;
      el.opacity = data.opacity;
      el.keepratio = data.keepratio;
      el.mirror = data.mirror;

      // Restore event handlers
      if(data.background){
        scope.$parent.initBackground(el);
      } else if(data.ft){
        el.mousedown(scope.$parent.elementMouseDown);

        // Restore freeTransform
        var ft = scope.$parent.paper.freeTransform(el, {}, function(ft, events) {
          scope.$parent.setCurrent(ft.subject);
          scope.$parent.handleFtChanged(ft, events);
        });

        el.ft = ft;
        el.ft.attrs = data.ft;

        hElement.setHeight(el, ft.attrs.y);
        hElement.setWidth(el, ft.attrs.x);
        hElement.setRotation(el, ft.attrs.rotate);
        hElement.setKeepRatio(el);

        ft.setOpts({'drag':['self']});

        if(el.type === 'text'){
          ft.setOpts({distance: scope.$parent.constants.ELEMENT_TEXT_HANDLE_DISTANCE});
          el.inited = true;
        }
        hElement.handles(el);
      }

      return el;
    });
  }

  return {
    init: init,
    save: save,
    import: importFromJson
  };
});