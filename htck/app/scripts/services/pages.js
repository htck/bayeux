'use strict';

angular.module('htckApp').factory('hPages', function (hExport, hSave) {
  var scope = {};
  this.pages = [];
  this.currentPageIndex=0;

  this.init = function(parent){
    scope = parent.$new();
    this.currentPageIndex = 0;
  };

  this.saveCurrent = function() {
    scope.$parent.unfocus();
    var json = hExport.exportOneJSON(scope.$parent.paper);

    this.pages[this.currentPageIndex] = json;
  };

  this.goto = function(idx) {
    if(this.pages[idx]) {
      scope.$parent.setBrush(undefined);
      this.currentPageIndex = idx;
      hSave.import(this.pages[idx]);
    }
    // TODO else Error ?
  };

  this.next = function() {
    this.saveCurrent();
    this.goto(this.currentPageIndex + 1);
  };

  this.prev = function() {
    this.saveCurrent();
    this.goto(this.currentPageIndex - 1);
  };

  this.create = function(json) {
    this.saveCurrent();
    this.pages.splice(this.currentPageIndex+1, 0, json);
    this.goto(this.currentPageIndex+1);
  };

  this.createByCopy = function() {
    this.saveCurrent();
    this.create(this.pages[this.currentPageIndex]);
  };

  this.createNew = function() {
    this.saveCurrent();
    this.create(hExport.exportOneJSON(scope.$parent.paper, true));
  };

  this.deletePage = function() {
    this.pages.splice(this.currentPageIndex, 1);
    this.currentPageIndex = (this.currentPageIndex <= 0) ? (0) : (this.currentPageIndex - 1);
    this.goto(this.currentPageIndex);
  };

  return {
    init: this.init,
    pages: this.pages,
    currentPageIndex: this.currentPageIndex,

    saveCurrent: this.saveCurrent,
    goto: this.goto,
    create: this.create,
    delete: this.deletePage,
    next: this.next,
    prev: this.prev,
    createByCopy: this.createByCopy,
    createNew: this.createNew
  };
});