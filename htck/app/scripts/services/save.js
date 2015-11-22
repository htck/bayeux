'use strict';

/* globals saveAs */
angular.module('htckApp').factory('hSave', function (hElement, $timeout) {
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
      scope.$parent.hPages.pages = JSON.parse(loadEndEvt.target.result);
      scope.$parent.hPages.goto(0);
       // importFromJson(loadEndEvt.target.result);
    };

    reader.readAsText(file);
  }

  function save(pages, fileName){
    scope.$parent.hPages.saveCurrent();
    var json = JSON.stringify(pages);

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

        ft.handles.y.line.handle=true;
        ft.handles.x.line.handle=true;
        ft.handles.x.disc.handle=true;
        ft.handles.y.disc.handle=true;
        
        hElement.handles(el);
      }

      return el;
    });
    $timeout(scope.$parent.unfocus, 1);
  }

  return {
    init: init,
    save: save,
    import: importFromJson
  };
});