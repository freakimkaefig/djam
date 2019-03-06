DJ.Model = (function(app) {
	var model = app.Model,
	arr_instrumenteLautstaerke,
	audioContext,
	bufferTime = 0.200,
	spurenView_trackSelected,
	crossfadeWert = 5,
	compressor,
	
	arr_instruments = ["DrumMachine", "TellerLeft", "TellerRight", "Track1", "Track2",
						"Track3", "Track4"],
	
	//Arrays für Filter
	
	//erster Wert Filtername, zweiter Wert Filter(0 oder 1), dritter Wert Filterstärke
	arr_aktuellerFilter = {"DrumMachine":0,"TellerLeft":0,"TellerRight":0,"Track1":0,
									"Track2":0,"Track3":0,"Track4":0},
	arr_filterWerte = {"filterLow": 20000,"filterHigh": 20, 0: 20000, 1: 20},
	arr_filterLowInstrumente =["DrumMachine",false,"TellerLeft",false,"TellerRight",false,"Track1",false,
									"Track2",false,"Track3",false,"Track4",false],
	arr_filterHighInstrumente =["DrumMachine",false,"TellerLeft",false,"TellerRight",false,"Track1",false,
									"Track2",false,"Track3",false,"Track4",false],

	
	
	//Instrumente, bei denen  auf Play gedrückt wurde und die darauf warten,
	//beim nächsten Takt abgespielt zu werden
	arr_waitingInstruments = {"DrumMachine" : true, "TellerLeft" : false, "TellerRight" : false, 
	"Track1" : false, "Track2" : false,	"Track3" : false, "Track4" : false},
	//Instrumente, die gerade schon spielen
	arr_playingInstruments = {"DrumMachine" : false, "TellerLeft" : false, "TellerRight" : false, 
	"Track1" : false, "Track2" : false,	"Track3" : false, "Track4" : false},
	
	//Arrays für Statusspeicherung der Mute und Solo Buttons
	arr_btnStatus_mute = {"eq_btn_drum_mute" : false, "eq_btn_tt_mute" : false,
		"eq_btn_track1_mute" : false, "eq_btn_track2_mute" : false, "eq_btn_track3_mute" : false, "eq_btn_track4_mute" : false},
	arr_btnStatus_solo = ["eq_btn_drum_solo" ,false, "eq_btn_tt_solo" , false,
		"eq_btn_track1_solo" , false, "eq_btn_track2_solo" , false, "eq_btn_track3_solo" , false, "eq_btn_track4_solo" , false],	
	
	arr_selSpurenNumber = {"Track1" : 0, "Track2" : 5, "Track3" : 18, "Track4" : 13};	
	arr_selPlattenId = {"TellerLeft" : 1, "TellerRight" : 2};
	
	arr_sampleDuration	= {"DrumMachine" : undefined, "TellerLeft" : undefined, "TellerRight" : undefined, 
	"Track1" : undefined, "Track2" : undefined,	"Track3" : undefined, "Track4" : undefined},
	
	views_finishedLoading = {"drummachine" : false, "platten" : false, "spuren" : false},
	
	
	
	init = function() {
		erstelleInstrumenteArray();
	},
	
	setAudioContext = function(pAudioContext) {
		audioContext = pAudioContext;
	},
	
	getAudioContext = function() {
		return audioContext;
	},
	
	setSelPlattenId = function(pTeller, pPlatteId) {
		arr_selPlattenId[pTeller] = pPlatteId;
	},
	
	getSelPlattenId = function() {
		return arr_selPlattenId;
	},
	
	//Wird durch Start-Klick von den jeweiligen Views ausgeführt,
	//sowie von dem Metronom, das, sobald es den Track gestartet hat,
	//den Warte-Status auf false setzt
	setMeAsWaiting = function(pInstrumentName) {
		arr_waitingInstruments[pInstrumentName] = true;
	},
	
	//Das Metronom meldet, dass das Instrument jetzt abgespielt wurde und nun
	//vorerst nicht mehr auf das Abspielen wartet, solange der Track noch dauert.
	setMeAsNotWaiting = function(pInstrumentName) {
		arr_waitingInstruments[pInstrumentName] = false;
	},
	getWaitingInstruments = function() {
		return arr_waitingInstruments;
	},
	
	//Das Metronom meldet, dass das Instrument gerade abgespielt wurde. Es wird
	//durch die zusätzliche Markierung verhindert, dass ein Sample mehrfach abgepspielt wird
	setMeAsPlaying = function(pInstrumentName) {
		arr_playingInstruments[pInstrumentName] = true;
	},
	setMeAsNotPlaying = function(pInstrumentName) {
		arr_playingInstruments[pInstrumentName] = false;
	},
	getPlayingInstruments = function() {
		return arr_playingInstruments;
	},

	
	getBufferTime = function() {
		return bufferTime;	
	},
	
	setLautstaerke= function(instrument,volume){
			//console.log("setLautstärke of: "+instrument+"lautstärke: "+volume);
			
			if(instrument=="drummachineSlider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("drummachineLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="ttLeftSlider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("ttLeftSliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="ttRightSlider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("ttRightSliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="track1Slider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("track1SliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="track2Slider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("track2SliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="track3Slider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("track3SliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="track4Slider"){
				if(volume==10){
					arr_instrumenteLautstaerke[instrument] = 1;
				}
				else{
				arr_instrumenteLautstaerke[instrument] = "0."+volume;
				}
				$(DJ.Model).trigger("track4SliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
			else if(instrument=="masterSlider"){
				arr_instrumenteLautstaerke[instrument] = volume;
				$(DJ.Model).trigger("masterSliderLautstaerkeChanged",arr_instrumenteLautstaerke);
			}
	},
	
	getLautstaerke = function(instrument){
		return arr_instrumenteLautstaerke[instrument] ;
	},
	
	erstelleInstrumenteArray = function(){
			//console.log("erstelleArray");
			arr_instrumenteLautstaerke = {"masterSlider": 5, "drummachineSlider":1,"ttLeftSlider": 1,"ttRightSlider": 1
			,"track1Slider": 1,"track2Slider": 1,"track3Slider": 1, "track4Slider": 1,"ttCrossfadeSlider": 1};
		
	},
	getInstrumenteArray = function(){
		return arr_instrumenteLautstaerke;
	},
	
	setSelSpurenNumber = function(pSpur, pTrackId) {
		arr_selSpurenNumber[pSpur] = pTrackId;	
	}, 
	getSelSpurenNumber = function() {
		return arr_selSpurenNumber;
	},
	
	//GET und GET Button Status für Mute und Solo im Equalizer
	setBtnStatus_mute = function(button, value) {
		arr_btnStatus_mute[button] = value;
		if(value==true){
			$(DJ.Model).trigger("setMute",button);
		}
		else{
			$(DJ.Model).trigger("removeMute",button);
		}
	},	
	getBtnStatus_mute = function(button) {
		return arr_btnStatus_mute[button];
	},	
	setBtnStatus_solo = function(button, value) {
		for(var i =0; i< arr_btnStatus_solo.length; i++){
			if(arr_btnStatus_solo[i] ==button){
				arr_btnStatus_solo[i+1]=value;
			}
		}
		
		if(value==true){
			$(DJ.Model).trigger("setSolo",button);
		}
		else{
			$(DJ.Model).trigger("removeSolo",button);
		}
	},	
	getBtnStatus_solo = function(button) {
		var buttonStatus;
		for(var i=0;i<arr_btnStatus_solo.length;i++){
			if(arr_btnStatus_solo[i]==button){
				buttonStatus= arr_btnStatus_solo[i+1];
			}
		}
		return buttonStatus;
	},
	
	getAllBtn_notSolo = function(){
		var array = [],
		j=0;
		for(var i=0;i<arr_btnStatus_solo.length;i++){
			if(arr_btnStatus_solo[i]==false){
				array[j]= arr_btnStatus_solo[i-1];
				j++;
			}
		}
		return array;
	},
	getGlobalBtnStatus_solo = function(){
		if(getAllBtn_notSolo().length==arr_btnStatus_solo.length/2){
			//kein SoloSchalter aktiviert
			return false;
		}
		else{
			return true;
		}
	},
	
	setTrackSelected = function(event) {
		spurenView_trackSelected = event;
	},
	
	getTrackSelected = function() {
		return spurenView_trackSelected;
	},
	
	setSampleDuration = function(pInstrumentId, pDuration) {
		arr_sampleDuration[pInstrumentId] = pDuration;
	},
	getSampleDuration = function() {
		return arr_sampleDuration;
	},
	
	setCrossfadeWert = function(wert){
		crossfadeWert=wert;
		$(DJ.Model).trigger("CrossfadeWertChanged",wert);
		
	},
	getCrossfadeWert = function(){
		return crossfadeWert;
	},
	
	setCompressor = function(pCompressor){
		compressor = pCompressor;
		
	},
	getCompressor = function(){
		//console.log("setCompressor"+compressor);
		return compressor;
	},
	
	
	setFilterWert = function(filter, wert){
		if(filter=="filterHighSlider"){
			arr_filterWerte[1]=parseInt(Math.exp(wert/4));
		}
		else{
			arr_filterWerte[0]=parseInt(Math.exp(wert/4));
		}
		
		var array = {"filter":filter,"wert":wert};
		//console.log("setFilterWert: "+array);
		$(DJ.Model).trigger("FilterWertChanged",array);
	},
	getFilterWert = function(filter){
		return arr_filterWerte[filter];
	},
	getSelectedFilterNodsInstrumente = function(sliderName){
		//console.log(sliderName);
		if(sliderName=="filterHighSlider"){
			var array=[],
			j=0;
			for(var i=0;i<arr_filterHighInstrumente.length; i++){
				if(arr_filterHighInstrumente[i]==true){
					array[j]=getFilterNode(arr_filterHighInstrumente[i-1]);
					j++;
				}
			}
			return array;
		}
		if(sliderName=="filterLowSlider"){
			
			var array=[],
			j=0;
			for(var i=0;i<arr_filterLowInstrumente.length; i++){
				if(arr_filterLowInstrumente[i]==true){
					array[j]=getFilterNode(arr_filterLowInstrumente[i-1]);
					j++;
				}
			}
			return array;
		}
	},
	getFilterNode = function(instrument){
		if(instrument=="TellerLeft"){
			return DJ.Platten.getFilterNodeLeft();
		}
		else if(instrument=="TellerRight"){
			return DJ.Platten.getFilterNodeRight();
		}
		else if(instrument=="DrumMachine"){
			return DJ.DrumMachine.getFilterNodeDrummachine();
		}
		else if(instrument=="Track1"){
			return DJ.Spuren.getFilterNodeTrack1();
		}
		else if(instrument=="Track2"){
			return DJ.Spuren.getFilterNodeTrack2();
		}
		else if(instrument=="Track3"){
			return DJ.Spuren.getFilterNodeTrack3();
		}
		else if(instrument=="Track4"){
			return DJ.Spuren.getFilterNodeTrack4();
		}
	},
	
	setAktuellenFilter = function(instrument,filter){
		arr_aktuellerFilter[instrument]=filter;
		var array = {"instrument":instrument,"filter":filter};
		$(DJ.Model).trigger("FilterChanged",array);
	},
	
	getAktuellenFilter = function(instrument){
		//console.log("getaktuellerFilter: "+instrument);
		return arr_aktuellerFilter[instrument];
	},
	
	setFilterStatus = function(instrument, filter, status){
		if(filter ==0){
			for(var i =0; i< arr_filterLowInstrumente.length;i++){
				if(arr_filterLowInstrumente[i]==instrument){	
					arr_filterLowInstrumente[i+1]= status;
				}
			}
		}
		else{
			for(var i =0; i< arr_filterHighInstrumente.length;i++){
				if(arr_filterHighInstrumente[i]==instrument){
					arr_filterHighInstrumente[i+1] = status;
				}
			}
		}
	},
	getFilterStatus = function(instrument, filter){
		if(filter ==0){
			for(var i =0; i< arr_filterLowInstrumente.length;i++){
				if(arr_filterLowInstrumente[i]==instrument){	
					return arr_filterLowInstrumente[i+1];
				}
			}
		}
		else{
			for(var i =0; i< arr_filterHighInstrumente.length;i++){
				if(arr_filterHighInstrumente[i]==instrument){
					return arr_filterHighInstrumente[i+1];
				}
			}
		}
	},
	
	setDraggedCover = function(draggedCover) {
		this.draggedCover = draggedCover;
	},
	
	getDraggedCover = function() {
		return draggedCover;
	},
	
	setFinishedLoading = function(view, value) {
		views_finishedLoading[view] = value;
	},
	
	getFinishedLoading = function() {
		return views_finishedLoading;
	};
	
	return {
		init: init,
		setAudioContext : setAudioContext,
		getAudioContext : getAudioContext,
		setBtnStatus_mute : setBtnStatus_mute,
		getBtnStatus_mute : getBtnStatus_mute,
		setBtnStatus_solo : setBtnStatus_solo,
		getBtnStatus_solo : getBtnStatus_solo,
		getInstrumenteArray: getInstrumenteArray,
		setLautstaerke: setLautstaerke,
		getLautstaerke:	getLautstaerke,
		getGlobalBtnStatus_solo: getGlobalBtnStatus_solo,
		getAllBtn_notSolo: getAllBtn_notSolo,
		setMeAsWaiting : setMeAsWaiting,
		setMeAsNotWaiting : setMeAsNotWaiting,
		getWaitingInstruments : getWaitingInstruments,
		setMeAsPlaying : setMeAsPlaying,
		setMeAsNotPlaying : setMeAsNotPlaying,
		getPlayingInstruments : getPlayingInstruments,
		getBufferTime : getBufferTime,
		setTrackSelected : setTrackSelected,
		getTrackSelected : getTrackSelected,
		setSelSpurenNumber : setSelSpurenNumber,
		getSelSpurenNumber : getSelSpurenNumber,
		getSelPlattenId : getSelPlattenId,
		setSelPlattenId : setSelPlattenId,
		setSampleDuration : setSampleDuration,
		getSampleDuration : getSampleDuration,
		getCrossfadeWert: getCrossfadeWert,
		setCrossfadeWert: setCrossfadeWert,
		getCompressor: getCompressor,
		setCompressor: setCompressor,
		setFilterWert: setFilterWert,
		getFilterWert: getFilterWert,
		getSelectedFilterNodsInstrumente: getSelectedFilterNodsInstrumente,
		getAktuellenFilter: getAktuellenFilter ,
		setAktuellenFilter :setAktuellenFilter ,
		getFilterStatus: getFilterStatus,
		setFilterStatus: setFilterStatus,
		setDraggedCover : setDraggedCover,
		getDraggedCover : getDraggedCover,
		setFinishedLoading : setFinishedLoading,
		getFinishedLoading : getFinishedLoading
	};
})(DJ);
