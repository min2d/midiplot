#include 'data.jsx';
(function () {
  // mmからpointに変換するための値
  var mm = 2.834645;

  var list = [] 
  for(var i=0;i<pagedPlots.length; i++){
    list.push(i+1);
  }

  var window= new Window ('dialog', 'ページ選択'); 
  window.margins= 20;
  window.list= window.add('listbox', undefined, list, {multiselect: true});
  window.list.selection= 0;
  var btnObj= window.add( 'button', undefined, 'OK');
  btnObj.onClick = function() { window.close(); }
  window.show();

  var selection = window.list.selection;
  var pageIndexes = []
  for(i=0; i< selection.length; i++){
    pageIndexes.push(selection[i].index +0)
  }
  pageIndexes.sort(function(a,b){return a - b});

  var documentPreset = new DocumentPreset();
  documentPreset.units = RulerUnits.Millimeters;
  documentPreset.width = w * mm;
  documentPreset.height = h* mm;
  documentPreset.colorMode = DocumentColorSpace.CMYK;

  var color = new RGBColor();
  color.red = 0;
  color.green = 0;
  color.blue = 0;

  for (var i = 0; i < pageIndexes.length; i++) {
    var doc = app.documents.addDocument("", documentPreset, false);
    doc.artboards[0].artboardRect = [0, 0, w*mm, -h*mm];
    doc.views[0].centerPoint = [w*mm / 2, -h*mm / 2];

    var plots = pagedPlots[pageIndexes[i]];
    for (var j = 0; j < plots.length; j++) {
      var plot = plots[j];
      var rect = doc.pathItems.rectangle(-plot.y*mm, plot.x*mm, plot.w*mm, plot.h*mm);
      // rect.fillColor = color;
      rect.Color = color;
    }
  }
  redraw();
})();