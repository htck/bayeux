'use strict';

angular.module('htckApp').factory('hPages', function (hExport, hSave, $timeout) {
  var scope = {};
  this.pages = [];
  this.pngPages = [];
  this.currentPageIndex=0;

  this.init = function(parent){
    scope = parent.$new();
    this.currentPageIndex = 0;
  };

  this.saveCurrent = function() {
    scope.$parent.unfocus();
    var json = hExport.exportOneJSON(scope.$parent.paper);
    var pageIndex = this.currentPageIndex;
    var hPages = this;
    hExport.exportOneBase64(constants.RAPHAEL_PAPER, 'canvas', scope.$parent.paper, function(base64){
      hPages.pngPages[pageIndex] = base64;
    });

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

  this.exportGIF = function() {
    this.saveCurrent();
    var hPages = this;
    $timeout(function(){
      hExport.exportManyGIF(hPages.pngPages);
    },200);
  };

  return {
    init: this.init,
    pages: this.pages,
    pngPages: this.pngPages,
    currentPageIndex: this.currentPageIndex,

    saveCurrent: this.saveCurrent,
    goto: this.goto,
    create: this.create,
    delete: this.deletePage,
    next: this.next,
    prev: this.prev,
    createByCopy: this.createByCopy,
    createNew: this.createNew,
    exportGIF: this.exportGIF
  };
});