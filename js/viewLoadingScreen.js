DJ.LoadingScreen = (function(app) {
	var model = DJ.Model,
	arr_views_finishedLoading,
	
	init = function() {
		initLoadingSign();
		checkFinishedLoading();
	},
	
	initLoadingSign = function() {
		setTimeout(function() {
			$("#loadingSign").animate({
				"top": "32%"
			}, 1000);
			$("#loadingSign").animate({
				"top": "30%"
			}, 200);
		}, 300);
	},
	
	checkFinishedLoading = function() {
		var checkFinishedLoadingInterval = window.setInterval(function() {
			arr_views_finishedLoading = model.getFinishedLoading();
			if(arr_views_finishedLoading["drummachine"] == true && arr_views_finishedLoading["spuren"] == true && arr_views_finishedLoading["platten"] == true) {
				//alert("Alles fertig geladen!");
				window.clearInterval(checkFinishedLoadingInterval);
				//Fire Event!
				openCurtain();
			} else {
				//console.log("checkFinishedLoading noch nicht fertig!");
				//console.log(arr_views_finishedLoading);
			}
		}, 500);
	},
	
	openCurtain = function() {
		console.log("openCurtain()");
		window.setTimeout(function() {
			$("#app").removeClass("invisible");
			
			$("#curtainLeft").animate({
				"margin-left": "-70%"
			},10000);
			
			$("#curtainRight").animate({
				"margin-left": "70%"
			},10000, removeUnusedDOMObjects);
			
			$("#loadingSign").animate({
				"top": "-50%"
			}, 5000);
			
			$("#loadingOverlay").fadeOut(5000);
		}, 300);
	},
	
	removeUnusedDOMObjects = function() {
		$("#curtainLeft").remove();
		$("#curtainRight").remove();
		$("#loadingOverlay").remove();
		$("#loadingSign").remove();
		/*$(document.body).removeClass("overflow-hidden");*/
	};
	
	return {
		init: init
	};
})(DJ);