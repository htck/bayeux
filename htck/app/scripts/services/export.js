'use strict';

/* globals $ */
/* globals canvg */
/* globals saveAs */
/* globals constants */
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

  function exportOnePNG(raphaelPaperId, canvasId, fileName, paper){
    paper.setSize(constants.W+'px',constants.H+'px');
    // Get the svg element created by Raphael
    var svg = document.getElementById(raphaelPaperId).children[0];
    var svgStr = svgfix(svg.outerHTML);

    paper.setSize('100%','100%');


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

  function exportOneJSON(paper) {
    // Serialize as json
    var json = paper.toJSON(function(el, data){ // For each element

      if(el.handle){
        return;
      }

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
    return json;
  }

  return {
    exportOnePNG: exportOnePNG,
    exportOneJSON: exportOneJSON
  };
});