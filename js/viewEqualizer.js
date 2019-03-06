DJ.Equalizer = (function(app) {

	var model = DJ.Model,
	audioContext,
	masterGainNode,
	
	$equalizerWrapper = $("#equalizerWrapper");
	
	//Slider
	$eqMasterSlider = $("#masterSlider");
	$eqDrummachineSlider = $("#drummachineSlider")
	$eqttLeftSlider = $("#ttLeftSlider");
	$eqttRightSlider = $("#ttRightSlider");
	$eqttCrossfadeSlider = $("#ttCrossfadeSlider");
	$eqTrack1Slider = $("#track1Slider");
	$eqTrack2Slider = $("#track2Slider");
	$eqTrack3Slider = $("#track3Slider");
	$eqTrack4Slider = $("#track4Slider");
	var arr_slider_vertical = [$eqMasterSlider, $eqDrummachineSlider, $eqttLeftSlider, $eqttRightSlider, $eqTrack1Slider, $eqTrack2Slider, $eqTrack3Slider, $eqTrack4Slider];
	
	/*------ Buttons für Mute und Solo -----*/
	//DrumMachine
	$eq_btn_drum_mute = $("#eq_btn_drum_mute");
	$eq_btn_drum_solo = $("#eq_btn_drum_solo");
	
	//Turntables
	$eq_btn_tt_mute = $("#eq_btn_tt_mute");
	$eq_btn_tt_solo = $("#eq_btn_tt_solo");
	
	//Tracks
	$eq_btn_track1_mute = $("#eq_btn_track1_mute");
	$eq_btn_track1_solo = $("#eq_btn_track1_solo");
	$eq_btn_track2_mute = $("#eq_btn_track2_mute");
	$eq_btn_track2_solo = $("#eq_btn_track2_solo");
	$eq_btn_track3_mute = $("#eq_btn_track3_mute");
	$eq_btn_track3_solo = $("#eq_btn_track3_solo");
	$eq_btn_track4_mute = $("#eq_btn_track4_mute");
	$eq_btn_track4_solo = $("#eq_btn_track4_solo");
	
	arr_btnStatus_mute = model.arr_btnStatus_mute;
	arr_btnStatus_solo = model.arr_btnStatus_solo;
	//console.log(arr_btnStatus_mute["drum"]);
	//console.log(arr_btnStatus_mute["track1"]);
	
	
	init = function() {
		audioContext = model.getAudioContext();
		masterGainNode = audioContext.createGain();
		
		//Compressor bündelt alle Audioströme, wird mit Mastergainnode verknüpft und dieser mit der Destination
		(model.getCompressor()).connect(masterGainNode);
  		masterGainNode.connect(audioContext.destination);
		
		for (var i = 0, max = 7; i <= max; i++) {
			initSliderVertical(arr_slider_vertical[i]);
			//console.log("Init Slider: " + arr_slider_vertical[i].toString());
		}
		initSliderHorizontal($eqttCrossfadeSlider);
		
		/*----- Registrierung der -Events ----*/
		//DrumMachine
		$eq_btn_drum_mute.on('click', onEQClick);
		$eq_btn_drum_solo.on('click', onEQClick);
	
		//Turntables
		$eq_btn_tt_mute.on('click', onEQClick);
		$eq_btn_tt_solo.on('click', onEQClick);
	
		//Tracks
		$eq_btn_track1_mute.on('click', onEQClick);
		$eq_btn_track1_solo.on('click', onEQClick);
		$eq_btn_track2_mute.on('click', onEQClick);
		$eq_btn_track2_solo.on('click', onEQClick);
		$eq_btn_track3_mute.on('click', onEQClick);
		$eq_btn_track3_solo.on('click', onEQClick);
		$eq_btn_track4_mute.on('click', onEQClick);
		$eq_btn_track4_solo.on('click', onEQClick);
		
		//Eventbindung von Lautstärkeänderung
		$(DJ.Model).bind("drummachineLautstaerkeChanged", onDrummachineLautstaerkeChanged);
		$(DJ.Model).bind("ttLeftSliderLautstaerkeChanged",onttLeftSliderLautstaerkeChanged);
		$(DJ.Model).bind("ttRightSliderLautstaerkeChanged",onttRightSliderLautstaerkeChanged);
		$(DJ.Model).bind("track1SliderLautstaerkeChanged",ontrack1SliderLautstaerkeChanged);
		$(DJ.Model).bind("track2SliderLautstaerkeChanged",ontrack2SliderLautstaerkeChanged);
		$(DJ.Model).bind("track3SliderLautstaerkeChanged",ontrack3SliderLautstaerkeChanged);
		$(DJ.Model).bind("track4SliderLautstaerkeChanged",ontrack4SliderLautstaerkeChanged);
		$(DJ.Model).bind("masterSliderLautstaerkeChanged",onChangeDestinationVolume);
		//Eventbindung der Solo- und Mute-Funktionen
		$(DJ.Model).bind("setSolo",onSetSolo);
		$(DJ.Model).bind("removeSolo",onRemoveSolo);
		$(DJ.Model).bind("setMute",onSetMute);
		$(DJ.Model).bind("removeMute",onRemoveMute);
		//Eventbindung für Crossfader
		$(DJ.Model).bind("CrossfadeWertChanged",onCrossfade);
		
	},
	
	onEQClick = function(event) {
		//console.log("viewEqualizer onEQClick();")
		var button = event.currentTarget.id;
		switch(button) {
			//DrumMachine (Mute&Solo)
			case "eq_btn_drum_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_drum_solo":
				changeButtonStatusSolo(button);
				break;
				
			//Turntables (Mute&Solo)
			case "eq_btn_tt_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_tt_solo":
				changeButtonStatusSolo(button);
				break;
				
			//Tracks (Mute&Solo)
			case "eq_btn_track1_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_track1_solo":
				changeButtonStatusSolo(button);
				break;
			case "eq_btn_track2_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_track2_solo":
				changeButtonStatusSolo(button);
				break;
			case "eq_btn_track3_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_track3_solo":
				changeButtonStatusSolo(button);
				break;
			case "eq_btn_track4_mute":
				changeButtonStatusMute(button);
				break;
			case "eq_btn_track4_solo":
				changeButtonStatusSolo(button);
				break;
		}
	},
	
	changeButtonStatusMute = function(button) {
		if(model.getBtnStatus_mute(button) == false) {
			//console.log(button + " VOR klick: " + model.getBtnStatus_mute(button));
			//mute drummachine
			$("#"+button).addClass("btn_mute_clicked");
			model.setBtnStatus_mute(button, true);
			//console.log(button + " NACH klick: " + model.getBtnStatus_mute(button));
		} else if(model.getBtnStatus_mute(button) == true) {
			//console.log(button + " VOR klick: " + model.getBtnStatus_mute(button));
			//unmute drummachine
			$("#"+button).removeClass("btn_mute_clicked");
			model.setBtnStatus_mute(button, false);
			//console.log(button + " NACH klick: " + model.getBtnStatus_mute(button));
		}
		//console.log("Status von: " + button + " = " + model.getBtnStatus_mute(button));
	},
	
	changeButtonStatusSolo = function(button) {
		if(model.getBtnStatus_solo(button) == false) {
			//console.log(button + " VOR klick: " + model.getBtnStatus_solo(button));
			//mute drummachine
			$("#"+button).addClass("btn_solo_clicked");
			model.setBtnStatus_solo(button, true);
			//console.log(button + " NACH klick: " + model.getBtnStatus_solo(button));
		} else if(model.getBtnStatus_solo(button) == true) {
			//console.log(button + " VOR klick: " + model.getBtnStatus_solo(button));
			//unmute drummachine
			$("#"+button).removeClass("btn_solo_clicked");
			model.setBtnStatus_solo(button, false);
			//console.log(button + " NACH klick: " + model.getBtnStatus_solo(button));
		}
		//console.log("Status von: " + button + " = " + model.getBtnStatus_solo(button));
	},
	
	initSliderVertical = function(whichSlider) { 
		//console.log(whichSlider.attr('id'));
		$(function() {
			whichSlider.slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 10,
				value: 10,
				slide: function(event, ui) {
					var sliderName = whichSlider.attr('id');
					//console.log(sliderName + " new value: " + ui.value);
					model.setLautstaerke(sliderName, ui.value);
				}
			});
		})
	},
	
	initSliderHorizontal = function(horizontalSlider) {
		//console.log(horizontalSlider.attr('id'));
		$(function() {
			horizontalSlider.slider({
				orientation: "horizontal",
				min: 0,
				max: 10,
				value: 5,
				slide: function(event, ui) {
					//console.log(event);
					var sliderName = horizontalSlider.attr('id');
					//console.log(sliderName + " new value: " + ui.value);
					model.setCrossfadeWert(ui.value);
				}
			});
		})
	},
	
	
	
	//---------Methoden für Audioausgabe----------------
	onChangeDestinationVolume = function(){
		var volume = model.getInstrumenteArray()["masterSlider"] ;
	
		if(volume==10){
				masterGainNode.gain.value = parseInt(1);
		}
		else{
				masterGainNode.gain.value = parseFloat("0."+volume);
		}
  
	},
	onCrossfade = function(event,wert){
		if(DJ.Model.getBtnStatus_solo("eq_btn_tt_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false) {
			if( DJ.Model.getBtnStatus_mute("eq_btn_tt_mute")==false){
			changeVolume(DJ.Platten.getNodePlatteLeft(), (((10-wert)*DJ.Model.getInstrumenteArray()["ttLeftSlider"])/10));
			changeVolume(DJ.Platten.getNodePlatteRight(), ((wert*DJ.Model.getInstrumenteArray()["ttRightSlider"])/10));
			}
		}
	},
	
	ontrack4SliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_track4_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track4_mute")==false){
				changeVolume(DJ.Spuren.getNodeTrack4(), DJ.Model.getInstrumenteArray()["track4Slider"]);
		}}
	},
	ontrack3SliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_track3_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track3_mute")==false){
				changeVolume(DJ.Spuren.getNodeTrack3(), DJ.Model.getInstrumenteArray()["track3Slider"]);
		}}
	},
	ontrack2SliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_track2_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track2_mute")==false){
				changeVolume(DJ.Spuren.getNodeTrack2(), DJ.Model.getInstrumenteArray()["track2Slider"]);
		}}
	},
	ontrack1SliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_track1_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track1_mute")==false){
				changeVolume(DJ.Spuren.getNodeTrack1(), DJ.Model.getInstrumenteArray()["track1Slider"]);
		}}
	},
	onttRightSliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_tt_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
			if(DJ.Model.getBtnStatus_mute("eq_btn_tt_mute")==false){
				changeVolume(DJ.Platten.getNodePlatteRight(), ((model.getCrossfadeWert()*DJ.Model.getInstrumenteArray()["ttRightSlider"])/10));
		}}
	},
	onttLeftSliderLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_tt_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
			if(DJ.Model.getBtnStatus_mute("eq_btn_tt_mute")==false){
				changeVolume(DJ.Platten.getNodePlatteLeft(), (((10-model.getCrossfadeWert())*DJ.Model.getInstrumenteArray()["ttLeftSlider"])/10));
				
		}}
	},
	onDrummachineLautstaerkeChanged = function(){
		if(DJ.Model.getBtnStatus_solo("eq_btn_drum_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
	  		if( DJ.Model.getBtnStatus_mute("eq_btn_drum_mute")==false){
				changeVolume(DJ.DrumMachine.getNode(), DJ.Model.getInstrumenteArray()["drummachineSlider"]);
			}
		}
	},
	
	changeVolume = function( node, volume) 
	{
		//console.log("changeVolume: "+volume);
		node.gain.value = parseFloat(volume);
		//console.log(node);
	},
	
	onSetSolo = function(event, data){
		//console.log("onSetSolo: "+data);
		var array = data.split("_");
		if(DJ.Model.getBtnStatus_mute(array[0]+"_"+array[1]+"_"+array[2]+"_mute")==false){
			removeMute(data);
		}
		var array = DJ.Model.getAllBtn_notSolo();
		for(var i=0; i<array.length; i++){
			setMute(array[i]);
		}
	
	},
	onRemoveSolo = function(event, data){
		var array = DJ.Model.getAllBtn_notSolo();
		if(array.length==6){
			for(var i=0; i<array.length; i++){
				var string =array[i].split("_");
				if(DJ.Model.getBtnStatus_mute(string[0]+"_"+string[1]+"_"+string[2]+"_mute")==false){
					removeMute(array[i]);
				}
			}
		}
		else{
			setMute(data);
			//console.log("onRemoveSolo: "+data);
		}
		
	},
	setMute = function(button){
		var hilfe = matchBtnNode(button);
		changeVolume(hilfe["node"],0);
		//console.log("setMute: "+hilfe["node"]);
		if(hilfe["node2"]!=undefined){
			changeVolume(hilfe["node2"],0);
		}
	},
	onSetMute = function(event,data){
		//console.log("onsetMute: "+ data);
		setMute(data);
	},
	removeMute = function(button){
		var hilfe= matchBtnNode(button);
		//console.log("removeMuste: "+hilfe["node"]+" "+hilfe["array"]);
		
		//Fallunterscheidung wegen Crosssliderwert
		if(hilfe["node"]==DJ.Platten.getNodePlatteLeft()){
			changeVolume(hilfe["node"],(((10-model.getCrossfadeWert())*hilfe["array"])/10));
			changeVolume(hilfe["node2"],((model.getCrossfadeWert()*hilfe["array2"])/10));
		}
		else{
			changeVolume(hilfe["node"],hilfe["array"]);
		}
	},
	onRemoveMute = function(event,data){
		removeMute(data);
	},
	matchBtnNode = function(button){
		
		if(button=="eq_btn_drum_mute" || button == "eq_btn_drum_solo"){
			var hilfe = {"node":DJ.DrumMachine.getNode(), "array":DJ.Model.getInstrumenteArray()["drummachineSlider"]};
			return hilfe;
		}
		else if(button=="eq_btn_tt_mute" || button == "eq_btn_tt_solo"){
			var hilfe = {"node": DJ.Platten.getNodePlatteLeft(), "node2": DJ.Platten.getNodePlatteRight(),
			"array": DJ.Model.getInstrumenteArray()["ttLeftSlider"], "array2": DJ.Model.getInstrumenteArray()["ttRightSlider"]};
			return hilfe;
		}
		else if(button== "eq_btn_track1_mute" || button == "eq_btn_track1_solo"){
			var hilfe = {"node": DJ.Spuren.getNodeTrack1(),"array": DJ.Model.getInstrumenteArray()["track1Slider"]}
			return hilfe;
			
		}
		else if(button== "eq_btn_track2_mute" || button == "eq_btn_track2_solo"){
			var hilfe = {"node": DJ.Spuren.getNodeTrack2(),"array":DJ.Model.getInstrumenteArray()["track2Slider"] }
			return hilfe;
			
		}
		else if(button== "eq_btn_track3_mute" || button == "eq_btn_track3_solo"){
			var hilfe = {"node": DJ.Spuren.getNodeTrack3(),"array": DJ.Model.getInstrumenteArray()["track3Slider"]}
			return hilfe;
			
		}
		else if(button== "eq_btn_track4_mute" || button == "eq_btn_track4_solo"){
			var hilfe = {"node":DJ.Spuren.getNodeTrack4() ,"array": DJ.Model.getInstrumenteArray()["track4Slider"]}
			return hilfe;
			
		}
		
	};
	
	
	return {
		init: init,
	};
})(DJ);
