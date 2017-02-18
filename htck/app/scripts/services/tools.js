'use strict';

/* globals $ */
angular.module('htckApp').factory('hTools', function() {
  function getSizeOfImage(src) {
    var fimg = new Image(); 
    fimg.src = src;

    var width = fimg.width;
    var height = fimg.height;

    return {w:width, h:height};
  }

  function randInt(lb, ub) {
      return Math.floor(Math.random() * (ub - lb + 1)) + lb;
  }

  function rand(lb, ub) {
      return Math.random() * (ub - lb + 1) + lb;
  }

  $.fn.redraw = function(){
    $(this).each(function(){
      this.style.display='none';
      this.offsetHeight;  /* jshint ignore:line */
      this.style.display='block';
    });
  };

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  // Function gotten from SVGFix
  // source : https://code.google.com/p/svgfix/
  function svgfix (text) {
    var fixed = text ;
    fixed = $.trim(fixed);
    if (fixed.indexOf( 'xmlns:xlink' ) === -1 ) {
      fixed = fixed.replace ('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '); 
    }
    fixed = fixed.replace (' href', ' xlink:href');
    return fixed; 
  }

  // Source:  https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  return {
    getSizeOfImage: getSizeOfImage,
    randInt: randInt,
    rand: rand,
    b64toBlob: b64toBlob,
    svgfix: svgfix,
    debounce: debounce
  };
});