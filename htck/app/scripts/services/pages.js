'use strict';

/* globals constants */
angular.module('htckApp').factory('hPages', function (hExport, hSave, hElement, $timeout, $mdDialog, $log) {
  var scope = {};
  this.pages = [];
  this.pngPages = [];
  this.currentPageIndex=0;
  this.gifInterval = 1;
  this.gifWidth = constants.W / 2;

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

  this.clearPage = function() {
    scope.$parent.unfocus();

    var elemList = [];
    scope.$parent.paper.forEach(function (elem) {
      if (elem.ft && !elem.background && !elem.tmpClone) {
        elemList.push(elem);
      }
    });
    for (var i = 0; i < elemList.length ; ++i) {
      hElement.remove(elemList[i]);
    }
  };

  this.deletePage = function() {
    this.pages.splice(this.currentPageIndex, 1);
    this.pngPages.splice(this.currentPageIndex, 1);
    this.currentPageIndex = (this.currentPageIndex <= 0) ? (0) : (this.currentPageIndex - 1);
    this.goto(this.currentPageIndex);
  };

  function gifDialogController($scope, hPages){
    $scope.hPages = hPages;
    $scope.constants = constants;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function() {
      $mdDialog.hide({});
    };
  }

  this.exportGIF = function(ev) {
    if(this.pages.length <= 1){
      return;
    }
    this.saveCurrent();
    var hPages = this;
    $mdDialog.show({
      controller: gifDialogController,
      templateUrl: 'views/gifsettings.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals : {
      }
    })
    .then(function() {
      scope.$parent.exportGIFRunning = true;
      hExport.exportManyGIF(hPages.pngPages, 'TheLegendaryTaleOfBayeux.gif', 'canvas', hPages.gifWidth, hPages.gifWidth * constants.H / constants.W, hPages.gifInterval, function(){
        scope.$parent.exportGIFRunning = false;
      });
    }, function() {
      $log.debug('Cancel');
    });
    /*
    $timeout(function(){
      hExport.exportManyGIF(hPages.pngPages, 'TheLegendaryTaleOfBayeux.gif', 'canvas');
    },200);*/
  };

  return {
    init: this.init,
    pages: this.pages,
    pngPages: this.pngPages,
    currentPageIndex: this.currentPageIndex,
    gifInterval: this.gifInterval,
    gifWidth: this.gifWidth,

    saveCurrent: this.saveCurrent,
    goto: this.goto,
    create: this.create,
    delete: this.deletePage,
    next: this.next,
    prev: this.prev,
    createByCopy: this.createByCopy,
    createNew: this.createNew,
    exportGIF: this.exportGIF,
    clearPage: this.clearPage
  };
});