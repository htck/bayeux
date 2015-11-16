'use strict';

angular.module('htckApp').factory('hPages', function (hElement) {
  var scope = {};
  var pages = [];
  var currentPageIndex;

  function init(parent){
    scope = parent.$new();
    currentPageIndex = 0;
  }

  return {
    init: init,
    pages: pages,
    index: currentPageIndex
  };
});