DJ.Controller = (function(app) {
	var $bg = document.getElementsByTagName("html"),
	model = DJ.Model,
	
	init = function() {
		
		//app.Platten.hideOverlays();
		app.LoadingScreen.init();
		app.audioBuffer.init();
		app.Model.init();
		app.DrumMachine.init();
		app.Equalizer.init();
		app.Metronom.init();
		app.Platten.init();
		app.Spuren.init();
		app.Groovy.init();
		app.Filter.init();
		app.Keyboard.init();
	};
	
	return {
		init: init
	};
})(DJ);
