const SVGO = require('svgo');
const cheerio = require('cheerio');

svgo = new SVGO({
  plugins: [{
    cleanupAttrs: true,
  }, {
    removeDoctype: true,
  },{
    removeXMLProcInst: true,
  },{
    removeComments: true,
  },{
    removeMetadata: true,
  },{
    removeTitle: true,
  },{
    removeDesc: true,
  },{
    removeUselessDefs: true,
  },{
    removeEditorsNSData: true,
  },{
    removeEmptyAttrs: true,
  },{
    removeHiddenElems: true,
  },{
    removeEmptyText: true,
  },{
    removeEmptyContainers: true,
  },{
    removeViewBox: false,
  },{
    cleanupEnableBackground: true,
  },{
    convertStyleToAttrs: true,
  },{
    convertColors: true,
  },{
    convertPathData: true,
  },{
    convertTransform: true,
  },{
    removeUnknownsAndDefaults: true,
  },{
    removeNonInheritableGroupAttrs: true,
  },{
    removeUselessStrokeAndFill: true,
  },{
    removeUnusedNS: true,
  },{
    cleanupIDs: true,
  },{
    cleanupNumericValues: true,
  },{
    moveElemsAttrsToGroup: true,
  },{
    moveGroupAttrsToElems: true,
  },{
    collapseGroups: true,
  },{
    removeRasterImages: false,
  },{
    mergePaths: true,
  },{
    convertShapeToPath: true,
  },{
    sortAttrs: true,
  },{
    removeDimensions: true,
  },{
    removeAttrs: {attrs: '(stroke|fill)'},
  }]
});

module.exports = function(content, path) {

  return Promise.resolve(
    svgo.optimize(content).then(function(result) {
      
      const $ = cheerio.load(result.data);
      var $svg = $('svg'); // eslint-disable-line no-var
      var $newSvg = $('<svg aria-hidden="true" focusable="false" role="presentation" class="icon" />'); 

      var viewBoxAttr = $svg.attr('viewbox');

      var fileNameIndex = path.lastIndexOf("/") + 1;
      var filename = path.substr(fileNameIndex);
      var fileName = filename.replace('.svg', '');
      if (viewBoxAttr) {
        var width = parseInt(viewBoxAttr.split(' ')[2], 10); // eslint-disable-line no-var
        var height = parseInt(viewBoxAttr.split(' ')[3], 10); // eslint-disable-line no-var
        var widthToHeightRatio = width / height; // eslint-disable-line no-var
        if (widthToHeightRatio >= 1.5) {
          $newSvg.addClass('icon--wide');
        }
        $newSvg.attr('viewBox', viewBoxAttr);
      }
      $newSvg
        .addClass(fileName)
        .append($svg.contents());
      return cheerio.html($newSvg);
    })
  )

}