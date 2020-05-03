#include 'data.jsx';
(function () {
  var documentPreset = new DocumentPreset();
  documentPreset.units = RulerUnits.Millimeters;
  documentPreset.width = w;
  documentPreset.height = h;
  documentPreset.colorMode = DocumentColorSpace.CMYK;

  var color = new RGBColor();
  color.red = 0;
  color.green = 0;
  color.blue = 0;

  for (var i = 0; i < pagedPlots.length; i++) {
    var doc = app.documents.addDocument("", documentPreset, false);

    doc.artboards[0].artboardRect = [0, 0, w, -h];
    doc.views[0].centerPoint = [w / 2, -h / 2];

    var plots = pagedPlots[i];
    for (var j = 0; j < plots.length; j++) {
      var plot = plots[j];
      var rect = doc.pathItems.rectangle(-plot.y, plot.x, plot.w, plot.h);
      // rect.fillColor = color;
      rect.Color = color;
    }
  }
  redraw();
})();