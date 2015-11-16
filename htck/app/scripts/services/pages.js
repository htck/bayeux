'use strict';

angular.module('htckApp').factory('hPages', function (hExport, hSave) {
  var scope = {};
  var pages = [];
  var currentPageIndex;

  function init(parent){
    scope = parent.$new();
    currentPageIndex = 0;
  }

  function saveCurrent() {
    scope.$parent.unfocus();
    var json = hExport.exportOneJSON(scope.$parent.paper);

    pages[currentPageIndex] = json;
  }

  function goto(idx) {
    if(pages[idx]) {
      currentPageIndex = idx;
      hSave.import(pages[idx]);
    }
    // TODO else Error ?
  }

  function next() {
    saveCurrent();
    goto(currentPageIndex + 1);
  }
  function prev() {
    saveCurrent();
    goto(currentPageIndex - 1);
  }

  function create(json) {
    saveCurrent();
    pages.splice(currentPageIndex+1, 0, json);
    goto(currentPageIndex+1);
  }

  function createByCopy() {
    saveCurrent();
    create(pages[currentPageIndex]);
  }

  function createNew() {
    saveCurrent();
    create(hExport.exportOneJSON(scope.$parent.paper, true));
  }

  function deletePage () {
    pages.splice(currentPageIndex, 1);
    currentPageIndex = (currentPageIndex <= 0) ? (0) : (currentPageIndex - 1);
    goto(currentPageIndex);
  }

  function getIndex (){
    return currentPageIndex;
  }

  return {
    init: init,
    pages: pages,
    getIndex: getIndex,

    saveCurrent: saveCurrent,
    goto: goto,
    create: create,
    delete: deletePage,
    next: next,
    prev: prev,
    createByCopy: createByCopy,
    createNew: createNew
  };
});