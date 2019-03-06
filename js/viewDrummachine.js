DJ.DrumMachine = (function(app) {

	var audioContext, 
	$btn = $("#btn"),
	model = DJ.Model,	
	$btn_startDrummachine = $("#btn_startDrummachine"),
	$btn_stopDrummachine = $("#btn_stopDrummachine"),
	arr_namesOfSounds = ['kick','snare','hihat','hihatOpen','specialOne','specialTwo'],
	btn_drumMachine_types,
	helper_btn_drumMachine_types = new Array(arr_namesOfSounds.length),
	arr_notenDrummachine = new Array(16),
	arr2dim_partitur = [],
	bufferLoader,
	globalBufferList,
	arr_sources = [],
	source,
	gainNode = 100,
	tempo = 100, //Zeit bei 100BPM für eine ViertelNote: 0,6s, ein Takt: 2,4s
	countOfSets = 3,
	chosenSet = 1,
	btn_set1,
	btn_set2,
	btn_set3,
	filterDrummachine,
	$btn_savePartitur_1 = $("#btn_savePartitur_1"),
	$btn_savePartitur_2 = $("#btn_savePartitur_2"),
	$btn_Partitur1 = $("#btn_Partitur1"),
	$btn_Partitur2 = $("#btn_Partitur2"),
	arr_savedPartitur ,
	arr_savedPartitur1 = new Array(),
	arr_savedPartitur2 = new Array(),
	
	init = function() {
		//console.log("Drummachine init");
	 	audioContext = DJ.Model.getAudioContext();
		 
		bufferLoader = new BufferLoader(
			audioContext,
		    [
		    	//'sounds/boomkick2.mp3',	
		    	//'sounds/bassdrum127.wav',
		    	'sounds/bassdrum127neu1.mp3',
		    	'sounds/bassdrum127neu2.mp3',
		    	'sounds/boomkick1.mp3',
		    	
		    	'sounds/distortedsnare12neu1.mp3',
		    	'sounds/boomsnare1neu2.mp3',
		    	'sounds/boomsnare2neu3.mp3',
		    	//'sounds/boomsnare3.mp3',
		    	//'sounds/boomsnare1.mp3',
		    	//'sounds/boomsnare2.mp3',
		    	
		    	'sounds/hihat16neu1.mp3',
		    	'sounds/boomhihat2.mp3',
		    	'sounds/boomhihat1.mp3',
		    			    	
		    	'sounds/boomhihatopen4.mp3',
		    	'sounds/boomhihatopen3.mp3',		    	
		    	'sounds/boomhihatopen2.mp3',		    	
		    	
		    	'sounds/boomspecial_clap2neu1.mp3',
		    	'sounds/boomspecial_clap3neu2.mp3',
		    	'sounds/boomspecial_clap1.mp3',
		    	//'sounds/boomspecial_clap1.mp3',
		    	//'sounds/boomspecial_clap3.mp3',
		    	//'sounds/boomspecial_clap2.mp3',
		    	
		    	'sounds/boomspecial_crash1.mp3',
		    	'sounds/boomspecial_crash2.mp3',
		    	'sounds/boomspecial_ethnic.mp3',
		    ],
		  finishedLoading
		  );
	    
	  	$btn_startDrummachine.on("click", onPlayStopDrumMachine);
	  	//$btn_stopDrummachine.on("click", 0.0, changeVolume);
	  	bufferLoader.load();
		  
  		setButtonReferences();
  		setExamplePartitur();
		
		//Die Noten der Drummachine werden zuerst auf false gesetzt
	 	for(var i=0; i < 16;i++)
	 	{
	 		arr_notenDrummachine[i] = false;
	 	}
	 	
	 	//Erstellen  des Filters und connecten mit Compressor
	 	gainNode = audioContext.createGain();
	 	
		filterDrummachine =  audioContext.createBiquadFilter();
		gainNode.connect(filterDrummachine);
		filterDrummachine.connect(model.getCompressor());
		filterDrummachine.type = 0;
		filterDrummachine.frequency.value = 20000;
		
		//Eventverlinkung für Partiturspeicherung
		$btn_savePartitur_1.on("click", 1,savePartitur);
		$btn_savePartitur_2.on("click", 2,savePartitur);
		$btn_Partitur1.on("click",1, changePartitur);
		$btn_Partitur2.on("click",2, changePartitur);
		$btn_Partitur1.hide();
		$btn_Partitur2.hide();
	},
	
	finishedLoading = function(bufferList) {
		console.log("DrumMachine: finishedLoading");
		model.setFinishedLoading("drummachine", true);
	  	globalBufferList = bufferList;
	    
	  	for(var i=0; i<18; i++) {
	    	arr_sources[i] = audioContext.createBufferSource();
	  		arr_sources[i].buffer = globalBufferList[i];
  	  	}
	  	
	  	
	  	//Um eine Verzögerung beim ersten Abspielen eines Sounds zu verhindern, 
	  	//wird hier schon eine Helfer-Source erstellt, die aber
	  	//nicht abgespielt wird.
	  	var preloadSource = audioContext.createBufferSource();
	  	preloadSource.buffer = globalBufferList[0];
	  	preloadSource.connect(audioContext.destination);		  	
	},
	
	changeVolume = function(pVolume) 
	{
		gainNode.gain.value = parseInt(pVolume.data);
	},
	
	setButtonReferences = function() 
	{
	 	btn_drumMachine_types = ['btn_kickOnNote','btn_snareOnNote', 'btn_hihatOnNote', 'btn_hihatOpenOnNote',
	 	'btn_specialOneOnNote', 'btn_specialTwoOnNote'];
		
		for(var i=0; i<arr_namesOfSounds.length; i++) {
			arr2dim_partitur[i] = {"nameOfSound": arr_namesOfSounds[i], 1 : false, 
			2 : false, 3 : false, 4 : false,
			5 : false, 6 : false, 7 : false, 8 : false, 9 : false, 
			10 : false, 11 : false, 12 : false,
			13 : false, 14 : false, 15 : false, 16 : false};
		}
	
		for (var j = 0; j < arr_namesOfSounds.length; j++) 
		{
			helper_btn_drumMachine_types[j] = new Object();
			for (var i = 0; i < 16; i++) 
			{	
				var param_setNote = 
						{
						"param_placeOfSound" : j,
						"param_achtelNoteId" : i+1
						};
				helper_btn_drumMachine_types[j][i] = $("#btn_"+arr_namesOfSounds[j]+"OnNote"+(i+1));
				btn_drumMachine_types[j] = $("#btn_"+arr_namesOfSounds[j]+"OnNote"+(i+1));
				btn_drumMachine_types[j].on("click", param_setNote, setNote);
			}			
		}
		
		btn_set1 = $("#btn_set1");
		btn_set1.on("click", 1, setSoundSet);
		btn_set2 = $("#btn_set2");
		btn_set2.on("click", 2, setSoundSet);
		btn_set3 = $("#btn_set3");
		btn_set3.on("click", 3, setSoundSet);
	},
	setExamplePartitur = function(){
		//Kick
		arr2dim_partitur[0][1]=true;
		helper_btn_drumMachine_types[0][0].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[0][4]=true;
		helper_btn_drumMachine_types[0][3].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[0][7]=true;
		helper_btn_drumMachine_types[0][6].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[0][9]=true;
		helper_btn_drumMachine_types[0][8].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[0][12]=true;
		helper_btn_drumMachine_types[0][11].addClass("btn_drumMachinePad_activated");
		//Snare
		arr2dim_partitur[1][5]=true;
		helper_btn_drumMachine_types[1][4].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[1][13]=true;
		helper_btn_drumMachine_types[1][12].addClass("btn_drumMachinePad_activated");
		//HiHat
		arr2dim_partitur[2][3]=true;
		helper_btn_drumMachine_types[2][2].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[2][7]=true;
		helper_btn_drumMachine_types[2][6].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[2][11]=true;
		helper_btn_drumMachine_types[2][10].addClass("btn_drumMachinePad_activated");
		arr2dim_partitur[2][15]=true;
		helper_btn_drumMachine_types[2][14].addClass("btn_drumMachinePad_activated");
		
	},

	setSoundSet = function(event) 
	{
		chosenSet = event.data;
	},
	
	setNote = function(event) 
	{
		var int_sechzehntelNoteId = event.data.param_achtelNoteId;
		var int_placeOfSound = event.data.param_placeOfSound;
		
		if
		   (arr2dim_partitur [int_placeOfSound][int_sechzehntelNoteId] == false) {
			arr2dim_partitur [int_placeOfSound][int_sechzehntelNoteId] = true;
			helper_btn_drumMachine_types[int_placeOfSound][int_sechzehntelNoteId-1].addClass("btn_drumMachinePad_activated");

		}
		else if		
		   (arr2dim_partitur [int_placeOfSound][int_sechzehntelNoteId] == true) {
			arr2dim_partitur [int_placeOfSound][int_sechzehntelNoteId] = false;
			helper_btn_drumMachine_types[int_placeOfSound][int_sechzehntelNoteId-1].removeClass("btn_drumMachinePad_activated");
		}
	},
	
	//setzt die DrumMachine auf wartend(Start) / nicht wartend (Stop)
	onPlayStopDrumMachine = function() 
	{	
		if(model.getWaitingInstruments()["DrumMachine"]==true){
			model.setMeAsNotWaiting("DrumMachine");
			$btn_startDrummachine.text("Start");
		}
		else {
			model.setMeAsWaiting("DrumMachine");
			$btn_startDrummachine.text("...");
		}
	},
	
	//Liest die im Notenarray gesetzten Noten eines Taktes aus und ermittelt daraus,
	//zu welcher Zeit die jeweiligen Sounds gespielt werden müssen 
	playLoop = function() 
	{
		var startTime = audioContext.currentTime+model.getBufferTime();	  	
	  	var sechzehntelNoteTime = (60 / tempo) / 8;		
	  	var k = chosenSet-1;  
	  	
		for(var j = 0; j<arr_namesOfSounds.length; j++)		
		{		
			for(var i = 0; i<16; i++)		{
				/**
			 	* Start bei 1(i+1), da der erste Platz des Partitur-Arrays mit 
			 	* dem Namen des Sounds belegt ist
			 	**/
				if(arr2dim_partitur[j][i+1] == true)
				{	
					playDrumMachineSound(arr_sources[k].buffer, startTime + 2 * i * sechzehntelNoteTime);
				}
			}
			k = k+3;	
		}
		$btn_startDrummachine.text("Stop");
	},
	
	//verknüpft die Sounds(Sources) mit dem GainNode und teilt letztendlich mit,
	//wann die Note ausgegeben werden soll.	 
	playDrumMachineSound = function(pBuffer, time) {	
	//console.log("playDrummachine"); 
	  	source = audioContext.createBufferSource();
	  	source.buffer = pBuffer;
	  	source.connect(gainNode);		  	
	  	//gainNode.connect(audioContext.destination);
	  	
		if(DJ.Model.getBtnStatus_solo("eq_btn_drum_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
	  		if( DJ.Model.getBtnStatus_mute("eq_btn_drum_mute")==false){
	  			source.start(time);
	  			
	  		}
	  		else{
	  			source.start(time);
	  			gainNode.gain.value= parseInt(0);
	  		}
	  	}
	  	else{
	  		source.start(time);
	  		gainNode.gain.value= parseInt(0);
	  	}
	},

	showMovingPads = function(pSechzehntelId) {
		window.setTimeout(function() 
		{	
			$drummachineWrapper = $("#drummachineWrapper");
			$drummachineWrapper.find(".btn_drumMachinePad_moving").removeClass("btn_drumMachinePad_moving");
			for(var i=0; i<arr_namesOfSounds.length;i++) {

				//console.log("showmovingPads: "+ pSechzehntelId);
				helper_btn_drumMachine_types[i][pSechzehntelId-1].addClass("btn_drumMachinePad_moving");
			}
		}, 
		model.getBufferTime()+100);
	},
	
	getNode = function(){
		return gainNode;
	},
	
	getFilterNodeDrummachine = function(){
		return filterDrummachine;
	},
	
	savePartitur = function(event){
		if(event.data==1){
			getNewNotes(arr_savedPartitur1);
			$btn_Partitur1.show();
		}
		else if(event.data==2){
			getNewNotes(arr_savedPartitur2);
			$btn_Partitur2.show();
		}

		
	},
	getNewNotes = function(arr_savedPartitur){
		for(var j = 0; j<arr2dim_partitur.length; j++){		
			arr_savedPartitur[j] = new Object();
			for(var i = 0; i<16; i++)		{
				if(arr2dim_partitur[j][i+1] == true)
				{	
					arr_savedPartitur[j][i+1]=true;
				}
				else{
					arr_savedPartitur[j][i+1]=false;
				}
				
			}	
		}
	},
	
	changePartitur = function(event){
		if(event.data==1){
			for(var j = 0; j<arr2dim_partitur.length; j++){			
				for(var i = 0; i<16; i++)		{
					if(arr_savedPartitur1[j][i+1] == true)
					{	
						arr2dim_partitur[j][i+1]=true;
						helper_btn_drumMachine_types[j][i].addClass("btn_drumMachinePad_activated");
					}
					else{
						arr2dim_partitur[j][i+1]=false;
						helper_btn_drumMachine_types[j][i].removeClass("btn_drumMachinePad_activated");
					}	
				}	
			}
		}
		else if(event.data==2){
			for(var j = 0; j<arr2dim_partitur.length; j++){			
				for(var i = 0; i<16; i++)		{
					if(arr_savedPartitur2[j][i+1] == true)
					{	
						arr2dim_partitur[j][i+1]=true;
						helper_btn_drumMachine_types[j][i].addClass("btn_drumMachinePad_activated");
					}
					else{
						arr2dim_partitur[j][i+1]=false;
						helper_btn_drumMachine_types[j][i].removeClass("btn_drumMachinePad_activated");
					}	
				}	
			}
		}
	};


	return {
		init: init,
		playLoop : playLoop,
		getNode : getNode,
		showMovingPads : showMovingPads,
		onPlayStopDrumMachine : onPlayStopDrumMachine,
		getFilterNodeDrummachine: getFilterNodeDrummachine
	};
})(DJ);
