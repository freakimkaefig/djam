DJ.Spuren = (function(app) {
	
	var model = DJ.Model,
	
	gainNodeTrack1,
	gainNodeTrack2,
	gainNodeTrack3,
	gainNodeTrack4,
	
	audioContext,
	startTime,
	globalBufferList,
	bufferLoaderSpuren,
	
	sourcePlatte1,
	sourcePlatte2,
	sourcePlatte3,
	sourcePlatte4,
	
	filterTrack1,
	filterTrack2,
	filterTrack3,
	filterTrack4,
	
	arr_SpurenStrings = ["Bass Sample 1","Bass Sample 2","Bass Sample 3","Bass Sample 4",
							"Synth Sample 1","Synth Sample 2","Synth Sample 3","Synth Sample 4",
							"Fx Sample 1","Fx Sample 2","Fx Sample 3","Fx Sample 4",
							"Brass Sample 1","Brass Sample 2","Brass Sample 3","Brass Sample 4",
							"String Sample 1","String Sample 2","String Sample 3","String Sample 4"],
							
	$Wahl_Track1 = $("#Wahl_Track1"),
	$Wahl_Track2 = $("#Wahl_Track2"),
	$Wahl_Track3 = $("#Wahl_Track3"),
	$Wahl_Track4 = $("#Wahl_Track4"),
	
	//Buttons
	$btn_track1Wahl = $("#track1Select");
	$btn_track2Wahl = $("#track2Select");
	$btn_track3Wahl = $("#track3Select");
	$btn_track4Wahl = $("#track4Select");
	
	$btn_track1previous = $("#btn_track1previous");
	$btn_track2previous = $("#btn_track2previous");
	$btn_track3previous = $("#btn_track3previous");
	$btn_track4previous = $("#btn_track4previous");
	
	$btn_track1next = $("#btn_track1next");
	$btn_track2next = $("#btn_track2next");
	$btn_track3next = $("#btn_track3next");
	$btn_track4next = $("#btn_track4next");
	
	$dropdown = $("#dropdown");
	$btn_dropdown_close = $("#btn_dropdown_close");
	$dropdown_samples = $(".list-items");
	
	
	$btn_track1_play =$("#btn_track1_play");
	$btn_track2_play =$("#btn_track2_play");
	$btn_track3_play =$("#btn_track3_play");
	$btn_track4_play =$("#btn_track4_play");

	init = function() {
		
		$dropdown.hide();
		
		audioContext = model.getAudioContext();
		
		bufferLoaderSpuren = new BufferLoader(
			audioContext,
		    [	
		    	'sounds/bass1.mp3',
		    	'sounds/bass2.mp3',
		    	'sounds/bass3.mp3',
		    	'sounds/bass4.mp3',
		    	
		    	'sounds/synth1.mp3',
		    	'sounds/synth2.mp3',
		    	'sounds/synth3.mp3',
		    	'sounds/synth4.mp3',
		    	
		    	'sounds/synth5.mp3',
		    	'sounds/synth6.mp3',
		    	'sounds/synth7.mp3',
		    	'sounds/synth8.mp3',
		    	
		    	'sounds/blaeser1.mp3',
		    	'sounds/blaeser2.mp3',
		    	'sounds/blaeser3.mp3',
		    	'sounds/blaeser4.mp3',
		    	
		    	'sounds/strings1.mp3',
		    	'sounds/strings2.mp3',
		    	'sounds/strings3.mp3',
		    	'sounds/strings4.mp3',
		    	
		    	'sounds/piano1.mp3',
		    	'sounds/piano2.mp3',
		    	'sounds/organ1.mp3',
		    	'sounds/organ2.mp3',
		    ],
		  	finishedLoadingT
		  );		    
	  	bufferLoaderSpuren.load();
	
		gainNodeTrack1 = audioContext.createGain();
		gainNodeTrack2 = audioContext.createGain();
		gainNodeTrack3 = audioContext.createGain();
		gainNodeTrack4 = audioContext.createGain();
	
		$btn_track1Wahl.on('click', onSelect);
		$btn_track2Wahl.on('click', onSelect);
		$btn_track3Wahl.on('click', onSelect);
		$btn_track4Wahl.on('click', onSelect);
		
		$btn_track1previous.on('click', onPreviousClick);
		$btn_track2previous.on('click', onPreviousClick);
		$btn_track3previous.on('click', onPreviousClick);
		$btn_track4previous.on('click', onPreviousClick);
		
		$btn_track1next.on('click', onNextClick);
		$btn_track2next.on('click', onNextClick);
		$btn_track3next.on('click', onNextClick);
		$btn_track4next.on('click', onNextClick);
		
		$btn_dropdown_close.on('click', onCloseDropdown);
		$dropdown_samples.on('click', onListItemClick);
		
		
		$btn_track1_play.on('click', onPlayStopTrack);
		$btn_track2_play.on('click', onPlayStopTrack);
		$btn_track3_play.on('click', onPlayStopTrack);
		$btn_track4_play.on('click', onPlayStopTrack);
		
		// Erstellen der Filter, Defaultwerte und Verbindung mit Compressor
		filterTrack1 =  audioContext.createBiquadFilter();
		filterTrack2 =  audioContext.createBiquadFilter();
		filterTrack3 =  audioContext.createBiquadFilter();
		filterTrack4 =  audioContext.createBiquadFilter();
		
		gainNodeTrack1.connect(filterTrack1);
		gainNodeTrack2.connect(filterTrack2);
		gainNodeTrack3.connect(filterTrack3);
		gainNodeTrack4.connect(filterTrack4);
		
		filterTrack1.connect(model.getCompressor());
		filterTrack2.connect(model.getCompressor());
		filterTrack3.connect(model.getCompressor());
		filterTrack4.connect(model.getCompressor());
		
		filterTrack1.type = 0;
		filterTrack2.type = 0;
		filterTrack3.type = 0;
		filterTrack4.type = 0;
		filterTrack1.frequency.value = 20000;
		filterTrack2.frequency.value = 20000;
		filterTrack3.frequency.value = 20000;
		filterTrack4.frequency.value = 20000;
	}, 
	
	finishedLoadingT = function(bufferList) {
		console.log("DJ.Spuren.finishedLoading");
		model.setFinishedLoading("spuren", true);
		globalBufferList = bufferList;
		
	  	//Um eine Verzögerung beim ersten Abspielen eines Sounds zu verhindern, 
	  	//wird hier schon eine Helfer-Source erstellt, die aber
	  	//nicht abgespielt wird.
	  	var preloadSource = audioContext.createBufferSource();
	  	preloadSource.buffer = globalBufferList[0];
	  	preloadSource.connect(audioContext.destination);
	},
	
	//OnPlayStopFunktion für Statusunterscheidung
	onPlayStopTrack = function(event) {
		playStopTrack(event.currentTarget.id);
	},
	playStopTrack = function(track){
		var int_trackId;
		switch (track) {
			case "btn_track1_play": 
				int_trackId = 1;
				$btn_track1_play.text("...");
				break;
			case "btn_track2_play": 
				int_trackId = 2;
				$btn_track2_play.text("...");
				break;
			case "btn_track3_play": 
				int_trackId = 3;
				$btn_track3_play.text("...");
				break;
			case "btn_track4_play": 
				int_trackId = 4;
				$btn_track4_play.text("...");
				break;
		}		
		/**
		 * play/stop Tracks
		 */
		if(model.getWaitingInstruments()["Track"+int_trackId]==true){
			model.setMeAsNotWaiting("Track"+int_trackId);
			$('#btn_track'+int_trackId+'_play').text("Start");
			//$btn_track1_play

		}
		else {
			model.setMeAsWaiting("Track"+int_trackId);
			model.setSampleDuration("Track"+int_trackId, 
									globalBufferList[model.getSelSpurenNumber()["Track"+int_trackId]].duration);
			$('#btn_track'+int_trackId+'_play').text("...");
		}		
	},
	
	//PlayFunktionen für die einzelnen Spuren
	playTrack1 = function(){
		startTime = audioContext.currentTime+model.getBufferTime();
		sourcePlatte1 = audioContext.createBufferSource();
		//zahl des lieds für bestimmte Spur aus array(mussnoch definiert werden) holen
	  	sourcePlatte1.buffer = globalBufferList[model.getSelSpurenNumber()["Track1"]];
  		sourcePlatte1.connect(gainNodeTrack1); 
  		//gainNodeTrack1.connect(audioContext.destination);
  		//gainNodeTrack1.gain.value = parseFloat((model.getLautstaerke("track1Slider")*model.getInstrumenteArray()["masterSlider"])/10);
	  	if(DJ.Model.getBtnStatus_solo("eq_btn_track1_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track1_mute")==false){
	  			sourcePlatte1.start(startTime);
	  		}
	  		else{
		  		sourcePlatte1.start(startTime);
		  		gainNodeTrack1.gain.value= parseInt(0);
		  	}
	  	}
	  	else{
	  		sourcePlatte1.start(startTime);
	  		gainNodeTrack1.gain.value= parseInt(0);
	  	}
	  	$btn_track1_play.text("Stop");
	},
	
	playTrack2 = function(){
		startTime = audioContext.currentTime+model.getBufferTime();
		sourcePlatte2 = audioContext.createBufferSource();
		//zahl des lieds für bestimmte Spur aus array(mussnoch definiert werden) holen
	  	sourcePlatte2.buffer = globalBufferList[model.getSelSpurenNumber()["Track2"]];
  		sourcePlatte2.connect(gainNodeTrack2); 
  		//gainNodeTrack2.connect(audioContext.destination);
  		//gainNodeTrack2.gain.value = parseFloat((model.getLautstaerke("track2Slider")*model.getInstrumenteArray()["masterSlider"])/10);
	  	if(DJ.Model.getBtnStatus_solo("eq_btn_track2_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track2_mute")==false){
	  			sourcePlatte2.start(startTime);
	  		}
	  		else{
		  		sourcePlatte2.start(startTime);
		  		gainNodeTrack2.gain.value= parseInt(0);
		  	}
	  	}
	  	else{
	  		sourcePlatte2.start(startTime);
	  		gainNodeTrack2.gain.value= parseInt(0);
	  	}
	  	$btn_track2_play.text("Stop");
	},
	playTrack3 = function(){
		startTime = audioContext.currentTime+model.getBufferTime();
		sourcePlatte3 = audioContext.createBufferSource();
		//zahl des lieds für bestimmte Spur aus array(mussnoch definiert werden) holen
	  	sourcePlatte3.buffer = globalBufferList[model.getSelSpurenNumber()["Track3"]];
  		sourcePlatte3.connect(gainNodeTrack3); 
  		//gainNodeTrack3.connect(audioContext.destination);
  		//gainNodeTrack3.gain.value = parseFloat((model.getLautstaerke("track3Slider")*model.getInstrumenteArray()["masterSlider"])/10);
	  	if(DJ.Model.getBtnStatus_solo("eq_btn_track3_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track3_mute")==false){
	  			sourcePlatte3.start(startTime);
	  		}
	  		else{
		  		sourcePlatte3.start(startTime);
		  		gainNodeTrack3.gain.value= parseInt(0);
		  	}
	  	}
	  	else{
	  		sourcePlatte3.start(startTime);
	  		gainNodeTrack3.gain.value= parseInt(0);
	  	}
	  	$btn_track3_play.text("Stop");
	},
	playTrack4 = function(){
		startTime = audioContext.currentTime+model.getBufferTime();
		sourcePlatte4 = audioContext.createBufferSource();
		//zahl des lieds für bestimmte Spur aus array(mussnoch definiert werden) holen
	  	sourcePlatte4.buffer = globalBufferList[model.getSelSpurenNumber()["Track4"]];
  		sourcePlatte4.connect(gainNodeTrack4); 
  		//gainNodeTrack4.connect(audioContext.destination);
  		//gainNodeTrack4.gain.value = parseFloat((model.getLautstaerke("track4Slider")*model.getInstrumenteArray()["masterSlider"])/10);
	  	if(DJ.Model.getBtnStatus_solo("eq_btn_track4_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false ){
			if( DJ.Model.getBtnStatus_mute("eq_btn_track4_mute")==false){
	  			sourcePlatte4.start(startTime);
	  		}
	  		else{
		  		sourcePlatte4.start(startTime);
		  		gainNodeTrack4.gain.value= parseInt(0);
		  	}
	  	}
	  	else{
	  		sourcePlatte4.start(startTime);
	  		gainNodeTrack4.gain.value= parseInt(0);
	  	}
	  	$btn_track4_play.text("Stop");
	},
	//StopFunktionen für die einzelnen Spuren
	stopTrack1 = function(){
		if(sourcePlatte1) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourcePlatte1.noteOff(stopTime);
		}
	},
	stopTrack2 = function(){
		if(sourcePlatte2) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourcePlatte2.noteOff(stopTime);
		}
	},
	stopTrack3 = function(){
		if(sourcePlatte3) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourcePlatte3.noteOff(stopTime);
		}
	},
	stopTrack4 = function(){
		if(sourcePlatte4) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourcePlatte4.noteOff(stopTime);
		}
	},
	
	onSelect = function(event) {
		//console.log(event);
		//console.log(event.currentTarget.id);
		switch(event.currentTarget.id) {
			case "track1Select":
				$dropdown.show();
				model.setTrackSelected(event);
				$(".trackWahl-wrapper").addClass("unselectedTrack");
				$btn_track1Wahl.removeClass("unselectedTrack");
				$btn_track1Wahl.addClass("selectedTrack");
				break;
			case "track2Select":
				$dropdown.show();
				model.setTrackSelected(event);
				$(".trackWahl-wrapper").addClass("unselectedTrack");
				$btn_track2Wahl.removeClass("unselectedTrack");
				$btn_track2Wahl.addClass("selectedTrack");
				break;
			case "track3Select":
				$dropdown.show();
				model.setTrackSelected(event);
				$(".trackWahl-wrapper").addClass("unselectedTrack");
				$btn_track3Wahl.removeClass("unselectedTrack");
				$btn_track3Wahl.addClass("selectedTrack");
				break;
			case "track4Select":
				$dropdown.show();
				model.setTrackSelected(event);
				$(".trackWahl-wrapper").addClass("unselectedTrack");
				$btn_track4Wahl.removeClass("unselectedTrack");
				$btn_track4Wahl.addClass("selectedTrack");
				break;
		}
	},
	
	initDropdown = function() {
		$dropdown.fadeIn(300);
	},
	
	onCloseDropdown = function(event) {
		$dropdown.hide();
		$(".trackWahl-wrapper").removeClass("selectedTrack");
		$(".trackWahl-wrapper").addClass("unselectedTrack");
	},
	
	onListItemClick = function(event) {
		//console.log(event.currentTarget.innerHTML);
		
		var selectedTrack = model.getTrackSelected();
		//console.log("selected Track: " + selectedTrack);
		//console.log(selectedTrack.currentTarget.childNodes[1].innerHTML);
		selectedTrack.currentTarget.childNodes[1].innerHTML = event.currentTarget.innerHTML;
		switch(selectedTrack.currentTarget.id) {
			case "track1Select":
				model.setSelSpurenNumber("Track1", parseInt(event.currentTarget.id));
				if(model.getWaitingInstruments()["Track1"] == true) {
					$btn_track1_play.text("...");					
				}
				break;
			case "track2Select":
				model.setSelSpurenNumber("Track2", parseInt(event.currentTarget.id));
				if(model.getWaitingInstruments()["Track2"] == true) {
					$btn_track2_play.text("...");					
				}
				break;
			case "track3Select":
				model.setSelSpurenNumber("Track3", parseInt(event.currentTarget.id));
				if(model.getWaitingInstruments()["Track3"] == true) {
					$btn_track3_play.text("...");					
				}
				break;
			case "track4Select":
				model.setSelSpurenNumber("Track4", parseInt(event.currentTarget.id));
				if(model.getWaitingInstruments()["Track4"] == true) {
					$btn_track4_play.text("...");					
				}
				break;
		}
		onCloseDropdown();
	},
		
	onPreviousClick = function(event) {
		//console.log("onPreviousClick-Event: ");
		//console.log(event.currentTarget.id);
		switch(event.currentTarget.id) {
			case "btn_track1previous":
				var currentTrack=model.getSelSpurenNumber()["Track1"];
				if(currentTrack==0){
					currentTrack = 20;
				}
				model.setSelSpurenNumber("Track1",parseInt(currentTrack)-1);
				$Wahl_Track1.text(arr_SpurenStrings[parseInt(currentTrack)-1]);
				if(model.getWaitingInstruments()["Track1"] == true) {
					$btn_track1_play.text("...");					
				}
				break;
			case "btn_track2previous":
				var currentTrack=model.getSelSpurenNumber()["Track2"];
				if(currentTrack==0){
					currentTrack = 20;
				}
				model.setSelSpurenNumber("Track2",parseInt(currentTrack)-1);
				$Wahl_Track2.text(arr_SpurenStrings[parseInt(currentTrack)-1]);
				if(model.getWaitingInstruments()["Track2"] == true) {
					$btn_track2_play.text("...");					
				}
				break;
			case "btn_track3previous":
				var currentTrack=model.getSelSpurenNumber()["Track3"];
				if(currentTrack==0){
					currentTrack = 20;
				}
				model.setSelSpurenNumber("Track3",parseInt(currentTrack)-1);
				$Wahl_Track3.text(arr_SpurenStrings[parseInt(currentTrack)-1]);
				if(model.getWaitingInstruments()["Track3"] == true) {
					$btn_track3_play.text("...");					
				}
				break;
			case "btn_track4previous":
				var currentTrack=model.getSelSpurenNumber()["Track4"];
				if(currentTrack==0){
					currentTrack = 20;
				}
				model.setSelSpurenNumber("Track4",parseInt(currentTrack)-1);
				$Wahl_Track4.text(arr_SpurenStrings[parseInt(currentTrack)-1]);
				if(model.getWaitingInstruments()["Track4"] == true) {
					$btn_track4_play.text("...");					
				}
				break;
		}
	},
	
	onNextClick = function(event) {
		//console.log("onNextClick-Event: ");
		//console.log(event.currentTarget.id);
		
		switch(event.currentTarget.id) {
			case "btn_track1next":
				var currentTrack=model.getSelSpurenNumber()["Track1"];
				if(currentTrack==19){
					currentTrack = -1;
				};
				 model.setSelSpurenNumber("Track1",parseInt(currentTrack)+1);
				 $Wahl_Track1.text(arr_SpurenStrings[parseInt(currentTrack)+1]);
				 if(model.getWaitingInstruments()["Track1"] == true) {
					$btn_track1_play.text("...");					
				}
				break;
			case "btn_track2next":
				var currentTrack=model.getSelSpurenNumber()["Track2"];
				if(currentTrack==19){
					currentTrack = -1;
				}
				model.setSelSpurenNumber("Track2",parseInt(currentTrack)+1);
				 $Wahl_Track2.text(arr_SpurenStrings[parseInt(currentTrack)+1]);
				 if(model.getWaitingInstruments()["Track2"] == true) {
					$btn_track2_play.text("...");					
				}
				break;
			case "btn_track3next":
				var currentTrack=model.getSelSpurenNumber()["Track3"];
				if(currentTrack==19){
					currentTrack = -1;
				}
				model.setSelSpurenNumber("Track3",parseInt(currentTrack)+1);
				 $Wahl_Track3.text(arr_SpurenStrings[parseInt(currentTrack)+1]);
				 if(model.getWaitingInstruments()["Track3"] == true) {
					$btn_track3_play.text("...");					
				}
				break;
			case "btn_track4next":
				var currentTrack=model.getSelSpurenNumber()["Track4"];
				if(currentTrack==19){
					currentTrack = -1;
				}
				model.setSelSpurenNumber("Track4",parseInt(currentTrack)+1);
				 $Wahl_Track4.text(arr_SpurenStrings[parseInt(currentTrack)+1]);
				 if(model.getWaitingInstruments()["Track4"] == true) {
					$btn_track4_play.text("...");					
				}
				break;
		}
	},
	
	
	getNodeTrack1 = function(){
		return gainNodeTrack1;
	},
	getNodeTrack2 = function(){
		return gainNodeTrack2;
	},
	getNodeTrack3 = function(){
		return gainNodeTrack3;
	},
	getNodeTrack4 = function(){
		return gainNodeTrack4;
	},
	
	getFilterNodeTrack1 = function(){
		return filterTrack1;
	},
	getFilterNodeTrack2 = function(){
		return filterTrack2;
	},
	getFilterNodeTrack3 = function(){
		return filterTrack3;
	},
	getFilterNodeTrack4 = function(){
		return filterTrack4;
	};
	
	return {
		init: init,
		getNodeTrack1: getNodeTrack1,
		getNodeTrack2: getNodeTrack2,
		getNodeTrack3: getNodeTrack3,
		getNodeTrack4: getNodeTrack4,
		playTrack1 : playTrack1,
		playTrack2 : playTrack2,
		playTrack3 : playTrack3,
		playTrack4 : playTrack4,
		stopTrack1 : stopTrack1,
		stopTrack2 : stopTrack2,
		stopTrack3 : stopTrack3,
		stopTrack4 : stopTrack4,
		getFilterNodeTrack1: getFilterNodeTrack1,
		getFilterNodeTrack2: getFilterNodeTrack2,
		getFilterNodeTrack3: getFilterNodeTrack3,
		getFilterNodeTrack4: getFilterNodeTrack4,
		playStopTrack: playStopTrack,
	};
})(DJ);


