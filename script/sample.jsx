(function(){
    var fObj = File.openDialog('select', '*.mid', false)

    if (fObj == null) {
        alert('no file!');
        return;
    }


    function newRect(i){
        var rect = app.activeDocument.pathItems.rectangle(-25*i*mm,0*mm,20*mm,10*mm);
        rect.fillColor  = fillColor;
    }
	
	//mmからpointに変換するための値
	var mm = 2.834645;
	
	
	//塗り色
	var fillColor = new RGBColor();
	fillColor.red	= 0;
	fillColor.green	= 0;
	fillColor.blue	= 0;
    
    // var rect = app.activeDocument.pathItems.rectangle(-25*mm,0*mm,20*mm,10*mm);
    // rect.fillColor  = fillColor;

    // var rect2 = app.activeDocument.pathItems.rectangle(-50*mm,0*mm,20*mm,10*mm);
    // rect.fillColor  = fillColor;

    for(var i=0;i<5;i++){
        newRect(i);
    }
    

    redraw();

	
	
})();