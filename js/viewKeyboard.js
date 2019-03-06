DJ.Keyboard= (function(app) {
	var model = DJ.Model,
	
	
	init = function() {
		document.onkeydown=onAction;
		//console.log("keyboard.init");
	},
	
	onAction = function(event){
		//event.preventDefault();
		//console.log("keyCode: "+event.keyCode);
		doAction(event.keyCode);
	},
	
	doAction = function(wert){
		switch(wert){
			case 49: DJ.Spuren.playStopTrack("btn_track1_play");
					 break;
			case 50: DJ.Spuren.playStopTrack("btn_track2_play");
					 break;
			case 51: DJ.Spuren.playStopTrack("btn_track3_play");
					 break;
			case 52: DJ.Spuren.playStopTrack("btn_track4_play");
					 break;
			case 37: DJ.Platten.playStopPlatte("btn_ttLeft");
					 break;	
			case 39: DJ.Platten.playStopPlatte("btn_ttRight");
					 break;
			case 40: DJ.DrumMachine.onPlayStopDrumMachine();
					 break;			 
					 
		}
	}
	
	
				
	return {
		init: init,
	};
})(DJ);
