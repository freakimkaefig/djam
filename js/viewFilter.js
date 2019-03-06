DJ.Filter = (function(app) {
	var model = DJ.Model,
	$filterWrapper = $("#filterWrapper");
	
	$filterLowSlider = $("#filterLowSlider");
	$filterHighSlider = $("#filterHighSlider");
	
	//Referenzierung der Buttons
	$btn_Low_TellerLeft = $("#fl_btn_TellerLeft");
	$btn_High_TellerLeft = $("#fh_btn_TellerLeft");
	$btn_Low_TellerRight = $("#fl_btn_TellerRight");
	$btn_High_TellerRight = $("#fh_btn_TellerRight");
	$btn_Low_Drummachine = $("#fl_btn_Drummachine");
	$btn_High_Drummachine = $("#fh_btn_Drummachine");
	$btn_Low_Track1 = $("#fl_btn_Track1");
	$btn_High_Track1 = $("#fh_btn_Track1");
	$btn_Low_Track2 = $("#fl_btn_Track2");
	$btn_High_Track2 = $("#fh_btn_Track2");
	$btn_Low_Track3 = $("#fl_btn_Track3");
	$btn_High_Track3 = $("#fh_btn_Track3");
	$btn_Low_Track4 = $("#fl_btn_Track4");
	$btn_High_Track4 = $("#fh_btn_Track4");
	
	init = function() {
		initFilterHighSlider($filterHighSlider);
		initFilterLowSlider($filterLowSlider);
		
		$(DJ.Model).bind("FilterWertChanged",onChangeFilterWert);
		$(DJ.Model).bind("FilterChanged",onChangeFilter);
		
		$btn_Low_TellerLeft.on("click", changeFilter);
		$btn_High_TellerLeft.on("click",changeFilter);
		$btn_Low_TellerRight.on("click", changeFilter);
		$btn_High_TellerRight.on("click",changeFilter);
		$btn_Low_Drummachine.on("click", changeFilter);
		$btn_High_Drummachine.on("click",changeFilter);
		$btn_Low_Track1.on("click", changeFilter);
		$btn_High_Track1.on("click",changeFilter);
		$btn_Low_Track2.on("click", changeFilter);
		$btn_High_Track2.on("click",changeFilter);
		$btn_Low_Track3.on("click", changeFilter);
		$btn_High_Track3.on("click",changeFilter);
		$btn_Low_Track4.on("click", changeFilter);
		$btn_High_Track4.on("click",changeFilter);
	},
	
	initFilterHighSlider = function(horizontalSlider) {
		//console.log(horizontalSlider.attr('id'));
		$(function() {
			horizontalSlider.slider({
				orientation: "horizontal",
				range: "min",
				min: 20,
				max: 40,
				value: 20,
				slide: function(event, ui) {
					//console.log(event);
					var sliderName = horizontalSlider.attr('id');
					//console.log(sliderName + " new value: " + ui.value);
					model.setFilterWert(sliderName,ui.value);
				}
			});
		})
	},
	
	initFilterLowSlider = function(horizontalSlider) {
		//console.log(horizontalSlider.attr('id'));
		$(function() {
			horizontalSlider.slider({
				orientation: "horizontal",
				range: "max",
				min: 20,
				max: 40,
				value: 40,
				slide: function(event, ui) {
					//console.log(event);
					var sliderName = horizontalSlider.attr('id');
					//console.log(sliderName + " new value: " + ui.value);
					model.setFilterWert(sliderName,ui.value);
				}
			});
		})
	},
	
	onChangeFilterWert = function(event, data){
		//console.log("onChangeFilterWert:"+data.filter+" "+data.wert);
		var array = DJ.Model.getSelectedFilterNodsInstrumente(data.filter);
		//console.log("nods: "+array);
		for(var i=0; i<array.length;i++){
			changeFrequenz(array[i],data.wert);
		}
	},
	changeFrequenz = function(filterNode,wert){	
		//console.log("changeFrequenz: "+filterNode+" "+parseInt(Math.exp(wert/4)));
		filterNode.frequency.value = parseInt(Math.exp(wert/4));
		
		/*var numberOfOctaves = Math.log(20050 / 50)/Math.LN2;
		var multiplier = Math.pow(2, numberOfOctaves * (parseInt(wert+"000") -1.0));
		filterNode.frequency.value =  20050 * multiplier;*/
		//console.log(filterNode.frequency.value );
	},
	
	changeFilter = function(event){
		var button = event.currentTarget.id;
		switch(button) {
			case "fl_btn_TellerLeft":
				if(model.getFilterStatus("TellerLeft",0)==false){
					model.setFilterStatus("TellerLeft",0,true);
					model.setFilterStatus("TellerLeft",1,false);
					model.setAktuellenFilter("TellerLeft",0);
					$btn_Low_TellerLeft.addClass("btn_filter_clicked");
					$btn_High_TellerLeft.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("TellerLeft",0,false);
					changeFilterValue("TellerLeft","filterLow");
					$btn_Low_TellerLeft.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_TellerLeft":
				if(model.getFilterStatus("TellerLeft",1)==false){
					model.setFilterStatus("TellerLeft",1,true);
					model.setFilterStatus("TellerLeft",0,false);
					model.setAktuellenFilter("TellerLeft",1);
					$btn_High_TellerLeft.addClass("btn_filter_clicked");
					$btn_Low_TellerLeft.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("TellerLeft",1,false);
					changeFilterValue("TellerLeft","filterHigh");
					$btn_High_TellerLeft.removeClass("btn_filter_clicked");
				}
				
				break;
			
			case "fl_btn_TellerRight":
				if(model.getFilterStatus("TellerRight",0)==false){
					model.setFilterStatus("TellerRight",0,true);
					model.setFilterStatus("TellerRight",1,false);
					model.setAktuellenFilter("TellerRight",0);
					$btn_Low_TellerRight.addClass("btn_filter_clicked");
					$btn_High_TellerRight.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("TellerRight",0,false);
					changeFilterValue("TellerRight","filterLow");
					$btn_Low_TellerRight.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_TellerRight":
				if(model.getFilterStatus("TellerRight",1)==false){
					model.setFilterStatus("TellerRight",1,true);
					model.setFilterStatus("TellerRight",0,false);
					model.setAktuellenFilter("TellerRight",1);
					$btn_High_TellerRight.addClass("btn_filter_clicked");
					$btn_Low_TellerRight.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("TellerRight",1,false);
					changeFilterValue("TellerRight","filterHigh");
					$btn_High_TellerRight.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fl_btn_Drummachine":
				
				if(model.getFilterStatus("DrumMachine",0)==false){
					//console.log("test");
					model.setFilterStatus("DrumMachine",0,true);
					model.setFilterStatus("DrumMachine",1,false);
					model.setAktuellenFilter("DrumMachine",0);
					$btn_Low_Drummachine.addClass("btn_filter_clicked");
					$btn_High_Drummachine.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("DrumMachine",0,false);
					changeFilterValue("DrumMachine","filterLow");
					$btn_Low_Drummachine.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_Drummachine":
				if(model.getFilterStatus("DrumMachine",1)==false){
					model.setFilterStatus("DrumMachine",1,true);
					model.setFilterStatus("DrumMachine",0,false);
					model.setAktuellenFilter("DrumMachine",1);
					$btn_High_Drummachine.addClass("btn_filter_clicked");
					$btn_Low_Drummachine.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("DrumMachine",1,false);
					changeFilterValue("DrumMachine","filterHigh");
					$btn_High_Drummachine.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fl_btn_Track1":	
				if(model.getFilterStatus("Track1",0)==false){
					model.setFilterStatus("Track1",0,true);
					model.setFilterStatus("Track1",1,false);
					model.setAktuellenFilter("Track1",0);
					$btn_Low_Track1.addClass("btn_filter_clicked");
					$btn_High_Track1.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track1",0,false);
					changeFilterValue("Track1","filterLow");
					$btn_Low_Track1.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_Track1":
				if(model.getFilterStatus("Track1",1)==false){
					model.setFilterStatus("Track1",1,true);
					model.setFilterStatus("Track1",0,false);
					model.setAktuellenFilter("Track1",1);
					$btn_High_Track1.addClass("btn_filter_clicked");
					$btn_Low_Track1.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track1",1,false);
					changeFilterValue("Track1","filterHigh");
					$btn_High_Track1.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fl_btn_Track2":	
				if(model.getFilterStatus("Track2",0)==false){
					model.setFilterStatus("Track2",0,true);
					model.setFilterStatus("Track2",1,false);
					model.setAktuellenFilter("Track2",0);
					$btn_Low_Track2.addClass("btn_filter_clicked");
					$btn_High_Track2.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track2",0,false);
					changeFilterValue("Track2","filterLow");
					$btn_Low_Track2.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_Track2":
				if(model.getFilterStatus("Track2",1)==false){
					model.setFilterStatus("Track2",1,true);
					model.setFilterStatus("Track2",0,false);
					model.setAktuellenFilter("Track2",1);
					$btn_High_Track2.addClass("btn_filter_clicked");
					$btn_Low_Track2.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track2",1,false);
					changeFilterValue("Track2","filterHigh");
					$btn_High_Track2.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fl_btn_Track3":	
				if(model.getFilterStatus("Track3",0)==false){
					model.setFilterStatus("Track3",0,true);
					model.setFilterStatus("Track3",1,false);
					model.setAktuellenFilter("Track3",0);
					$btn_Low_Track3.addClass("btn_filter_clicked");
					$btn_High_Track3.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track3",0,false);
					changeFilterValue("Track3","filterLow");
					$btn_Low_Track3.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_Track3":
				if(model.getFilterStatus("Track3",1)==false){
					model.setFilterStatus("Track3",1,true);
					model.setFilterStatus("Track3",0,false);
					model.setAktuellenFilter("Track3",1);
					$btn_High_Track3.addClass("btn_filter_clicked");
					$btn_Low_Track3.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track3",1,false);
					changeFilterValue("Track3","filterHigh");
					$btn_High_Track3.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fl_btn_Track4":	
				if(model.getFilterStatus("Track4",0)==false){
					model.setFilterStatus("Track4",0,true);
					model.setFilterStatus("Track4",1,false);
					model.setAktuellenFilter("Track4",0);
					$btn_Low_Track4.addClass("btn_filter_clicked");
					$btn_High_Track4.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track4",0,false);
					changeFilterValue("Track4","filterLow");
					$btn_Low_Track4.removeClass("btn_filter_clicked");
				}
				
				break;
			case "fh_btn_Track4":
				if(model.getFilterStatus("Track4",1)==false){
					model.setFilterStatus("Track4",1,true);
					model.setFilterStatus("Track4",0,false);
					model.setAktuellenFilter("Track4",1);
					$btn_High_Track4.addClass("btn_filter_clicked");
					$btn_Low_Track4.removeClass("btn_filter_clicked");
				}
				else{
					model.setFilterStatus("Track4",1,false);
					changeFilterValue("Track4","filterHigh");
					$btn_High_Track4.removeClass("btn_filter_clicked");
				}
				
				break;
		}
	},
	onChangeFilter = function(event,data){
		  changeFilterValue(data.instrument, data.filter);
	},
	changeFilterValue = function(instrument, filter){
		var filterNode = getFilterNode(instrument);
		if(filter=="filterHigh"){
			filterNode.type=1;
		}
			else if(filter=="filterLow"){
				filterNode.type=0;
			}
				else{
					filterNode.type= filter;
				}
		  filterNode.frequency.value = model.getFilterWert(filter);
		  //console.log("changefiltervalue: "+filterNode+ " "+ filterNode.type +" "+model.getFilterWert(filter));
	};
				
	return {
		init: init,
	};
})(DJ);
