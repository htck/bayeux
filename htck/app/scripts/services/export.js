'use strict';

/* globals $ */
/* globals canvg */
/* globals saveAs */
angular.module('htckApp').factory('hExport', function() {
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

  function exportRaphael(raphaelPaperId, canvasId, fileName){
    // Get the svg element created by Raphael
    var svg = document.getElementById(raphaelPaperId).children[0];
    var svgStr = svgfix(svg.outerHTML);

    // Convert to canvas using canvg
    canvg(document.getElementById(canvasId), svgStr, {
      renderCallback: function() {
        var canvas = document.getElementById(canvasId);

        // Get blob from canvas image
        canvas.toBlob(function(blob){
          // Save to file using FileSaver.js
          saveAs(blob, fileName);  // TODO generate random name for file
        });
      }
    });
  }
  return exportRaphael;
});