DJ.Platten = (function(app) {
	
	var model = DJ.Model,
	audioContext,
	bufferLoaderPlatten,
	$btn_startPlatteLeft,
	sourceLeft,
	sourceRight,
	globalBufferList,
	gainNodePlatteLeft,
	gainNodePlatteRight,
	filterPlatteLeft,
	filterPlatteRight,
	
	//Variablen für Plattenteller
	$plattentellerLeft = $("#plattenteller-left"),
	$plattentellerRight = $("#plattenteller-right"),
	
	$btn_ttLeft = $("#btn_ttLeft"),
	$btn_ttRight = $("#btn_ttRight"),
	//togglePlayTTLeft,
	//togglePlayTTRight,
	
	plattentellerLeftAnimationRunning = false,
	plattentellerRightAnimationRunning = false,
	leftTimer = null;
	rightTimer = null;

	
	//Variablen für SpielerArm
	$arm_left = $("#arm_left");
	$arm_right = $("#arm_right");
	$img_arm_left = $("#img_arm_left");
	$img_arm_right = $("#img_arm_right");
	arm_left_dragged = false;
	arm_right_dragged = false;
	
	//Variablen für SampleWahl
	$btn_plattenWahl = $("#plattenbox");
	
	//Variablen für Coverflow
	$plattenOverlay = $("#plattenOverlay");
	$coverflowWrapper = $("#coverflowWrapper");
	$coverflow = $("#coverflow");
	$btn_coverflow_close = $("#btn_coverflow_close");
	
	//Navigation des Coverflow
	$coverflow_prev = $(".dg-prev"),
	$coverflow_next = $(".dg-next"),

	//Initialisierung
	//Registrierung der Events onClick, onDragStart, onDragLeave, onDragEnter, ...
	init = function() {
		
		//Laden der Audioressourcen
		audioContext = DJ.Model.getAudioContext();		
		bufferLoaderPlatten = new BufferLoader(
			audioContext,
		    [	
		    	'sounds/guitar2.mp3',
		    	'sounds/organ1.mp3',
		    	'sounds/guitar1.mp3',
		    	'sounds/organ2.mp3',
		    	'sounds/organ3.mp3',
		    	'sounds/blaeser1.mp3',
		    	'sounds/bass5.mp3',
		    ],
		  	finishedLoading
		  );		    
	  	bufferLoaderPlatten.load();
	  	
	  	//Erstellen der GainNodes
	  	gainNodePlatteLeft = audioContext.createGain();
		gainNodePlatteRight = audioContext.createGain();
		
		//Overlay wird versteckt
		$plattenOverlay.hide();
		$coverflowWrapper.hide();
		$coverflow.hide();
		
		//Play-Pause-Buttons der Plattenteller
		$btn_ttLeft.on('click', onClick);
		$btn_ttRight.on('click', onClick);
		
		//SamplewahlButton
		$btn_plattenWahl.on('click', onOpenCoverflow);
		$btn_coverflow_close.on('click', onCloseCoverflow);
		
		//Drag SpielerArme
		initDraggableTonarme();
		
		$coverflow_prev.on("click", onCoverflowNavClick);
		$coverflow_next.on("click", onCoverflowNavClick);
		
		//Erstellen  des Filter Left und connecten mit Compressor
		filterPlatteLeft =  audioContext.createBiquadFilter();
		gainNodePlatteLeft.connect(filterPlatteLeft);
		filterPlatteLeft.connect(model.getCompressor());
		filterPlatteLeft.type = 0;
		filterPlatteLeft.frequency.value = 20000;
		
		//Erstellen  des Filter Right und connecten mit Compressor
		filterPlatteRight =  audioContext.createBiquadFilter();
		gainNodePlatteRight.connect(filterPlatteRight);
		filterPlatteRight.connect(model.getCompressor());
		filterPlatteRight.type = 0;
		filterPlatteRight.frequency.value = 20000;
		
		//Vorbereitung der Plattenanimation
		$plattentellerLeft.addClass("tt-rotate-animation");
		$plattentellerLeft.css("-webkit-animation-play-state", "paused");
		$plattentellerRight.addClass("tt-rotate-animation");
		$plattentellerRight.css("-webkit-animation-play-state", "paused");
	},
	
	onClick = function(event) {
		//console.log("viewPlatten onClick(): "+event.currentTarget.id);
		playStopPlatte(event.currentTarget.id);
		
	},
	playStopPlatte = function(button){
		
		switch(button) {
		
			case "btn_ttLeft":
				plattentellerLeftAnimation();
				
				/**
				 * play/stop Platte Links
				 */
				if(model.getWaitingInstruments()["TellerLeft"]==true){
					model.setMeAsNotWaiting("TellerLeft");
					$btn_ttLeft.text("Start");
				}
				else {
					model.setMeAsWaiting("TellerLeft");
					$btn_ttLeft.text("...");
				}
				break;
				
			case "btn_ttRight":
				plattentellerRightAnimation();
				
				/**
				 * play/stop Platte Links
				 */
				if(model.getWaitingInstruments()["TellerRight"]==true){
					model.setMeAsNotWaiting("TellerRight");
					$btn_ttRight.text("Start");
				}
				else {
					model.setMeAsWaiting("TellerRight");
					$btn_ttRight.text("...");
				}
				break;
				
			case "btn_leftSampleWahl":
				if(overlayShown == false) {
					$plattenOverlay.show();
					$coverflowWrapper.show();
					$coverflow.show();
					initCoverflow();
					overlayShown = true;
				} else if(overlayShown == true) {
					$plattenOverlay.hide();
					$coverflowWrapper.hide();
					$coverflow.hide();
					overlayShown = false;
				}
				break;
		}
	},
	
	onCoverflowNavClick = function(event) {
		setTimeout(updateCoverDraggable(), 300);
		//console.log($(".dg-center"));
	},
	
	onOpenCoverflow = function(event) {
		$plattenOverlay.show("scale", { percent: 100 }, 500);
		$coverflowWrapper.show();
		$coverflow.show();
		initCoverflow();
		
		updateCoverDraggable();		
	},
	
	onCloseCoverflow = function(event) {
		//console.log("onCloseCoverflow");
		$plattenOverlay.fadeOut(300);
	},
	
	playTellerLeft = function() {
		var startTime = audioContext.currentTime+model.getBufferTime();
	  	sourceLeft = audioContext.createBufferSource();
	  	//statt globalBufferList: Holen des zugewiesenen Sounds aus Array von Model
	  	sourceLeft.buffer = globalBufferList[model.getSelPlattenId()["TellerLeft"]];
  		sourceLeft.connect(gainNodePlatteLeft); 
  		//gainNodePlatteLeft.connect(audioContext.destination);
  		//gainNodePlatteLeft.gain.value = parseFloat((model.getLautstaerke("track1Slider")*model.getInstrumenteArray()["masterSlider"])/10);
  		
	  	if(DJ.Model.getBtnStatus_solo("eq_btn_tt_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
	  		if(DJ.Model.getBtnStatus_mute("eq_btn_tt_mute")==false){
	  			sourceLeft.start(startTime);
	  		}
	  		else{
		  		sourceLeft.start(startTime);
		  		gainNodePlatteLeft.gain.value= parseInt(0);
		  	}
	  	}
	  	else{
	  		sourceLeft.start(startTime);
	  		gainNodePlatteLeft.gain.value= parseInt(0);
	  	}
	  	$btn_ttLeft.text("Stop");
	},
	
	playTellerRight = function(pPlattenNr) {
		var startTime = audioContext.currentTime+model.getBufferTime();
	  	sourceRight = audioContext.createBufferSource();
	  	//statt globalBufferList: Holen des zugewiesenen Sounds aus Array von Model
	  	sourceRight.buffer = globalBufferList[model.getSelPlattenId()["TellerRight"]];
  		sourceRight.connect(gainNodePlatteRight); 
  		//gainNodePlatteRight.connect(audioContext.destination);
  		//gainNodePlatteRight.gain.value = parseFloat((model.getLautstaerke("track1Slider")*model.getInstrumenteArray()["masterSlider"])/10);
  		
  		if(DJ.Model.getBtnStatus_solo("eq_btn_tt_solo")==true ||DJ.Model.getGlobalBtnStatus_solo()==false){
	  		if(DJ.Model.getBtnStatus_mute("eq_btn_tt_mute")==false){
	  			sourceRight.start(startTime);
	  		}
	  		else{
		  		sourceRight.start(startTime);
		  		gainNodePlatteRight.gain.value= parseInt(0);
		  	}
	  	}

	  	else{
	  		sourceRight.start(startTime);
	  		gainNodePlatteRight.gain.value= parseInt(0);
	  	}
	  	$btn_ttRight.text("Stop");
	},
	
	stopTellerLeft = function() {
		if(sourceLeft) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourceLeft.noteOff(stopTime);
		}
	},
	
	stopTellerRight = function() {
		if(sourceRight) {
			var stopTime = audioContext.currentTime+model.getBufferTime();		
			sourceRight.noteOff(stopTime);
		}
	},
	
	getDurationLeft = function(pInstrument) {
		return globalBufferList[model.getSelPlattenId()["TellerLeft"]].duration;
	},
	
	getDurationRight  = function(pInstrument) {
		return globalBufferList[model.getSelPlattenId()["TellerRight"]].duration;
	},
	
	finishedLoading = function(bufferList) {
		console.log("DJ.Platten.finishedLoading");
		model.setFinishedLoading("platten", true);
		globalBufferList = bufferList;
		
		//Model: setDuration(pInstrument)
  	  	
  	  	
	  	//Um eine Verzögerung beim ersten Abspielen eines Sounds zu verhindern, 
	  	//wird hier schon eine Helfer-Source erstellt, die aber
	  	//nicht abgespielt wird.
	  	var preloadSource = audioContext.createBufferSource();
	  	preloadSource.buffer = globalBufferList[0];
	  	preloadSource.connect(audioContext.destination);
	  	
	  	//Platten mit Cover vorbelegen
	  	$("#plattenteller-left").empty();
		$("#plattenteller-left").append("<img src='images/cover/cover1.png' class='transform-record'>");
		
		$("#plattenteller-right").empty();
		$("#plattenteller-right").append("<img src='images/cover/cover2.png' class='transform-record'>");	  	
	},
	
	initDraggableTonarme = function() {
			$img_arm_left.draggable({
				containment: "#arm_left_dragzone", scroll: false,
				axis: "y",
				drag: function(event, ui) {
					if(arm_left_dragged == false) {
						//console.log("Event: " + event);
						//console.log("ui.position.left: " + ui.position.left);
						var rotateCSS = 'rotate(' + (-ui.position.left) + 'deg)';
						$arm_left.css({
			      			'-webkit-transform': rotateCSS
						});
					}
				},
				
				stop: function(event,ui) {
					arm_left_dragged = true;
				}
			});
				
			$img_arm_right.draggable({
				containment: "#arm_right_dragzone", scroll: false,
				axis: "y",
				drag: function(event, ui) {
					if(arm_right_dragged == false) {
						//console.log("Event: " + event);
						console.log("ui.position.left: " + ui.position.left);
						var rotateCSS = 'rotate(' + (-ui.position.left) + 'deg)';
						$arm_right.css({
			    			'-webkit-transform': rotateCSS
						});
					}
				},
				
				stop: function(event,ui) {
					arm_right_dragged = true;
				}
			});
	},
	
	getNodePlatteLeft = function(){
		return gainNodePlatteLeft;
	},
	
	getNodePlatteRight = function(){
		return gainNodePlatteRight;
	},	

	
	/*------------------ Drehung der Plattenteller ---------------*/
	plattentellerLeftAnimation = function() {
			arm_left_dragged = true;
			var rotateCSSLeft = 'rotate(' + (+25) + 'deg)';
					$arm_left.css({
					'-webkit-transform': rotateCSSLeft
					});
			switch(plattentellerLeftAnimationRunning) {
				case false:
					//console.log("plattentellerLeftAnimation false");
					$plattentellerLeft.css("-webkit-animation-play-state", "running");
					plattentellerLeftAnimationRunning = true;
					break;
				
				case true:
					//console.log("plattentellerLeftAnimation true");
					$plattentellerLeft.css("-webkit-animation-play-state", "paused");
					plattentellerLeftAnimationRunning = false;
					break;
			}
	},
	
	plattentellerRightAnimation = function() {
			arm_right_dragged = true;
			var rotateCSSRight = 'rotate(' + (+25) + 'deg)';
					$arm_right.css({
					'-webkit-transform': rotateCSSRight
					});
			switch(plattentellerRightAnimationRunning) {
				case false:
					//console.log("plattentellerRightAnimation false");
					$plattentellerRight.css("-webkit-animation-play-state", "running");
					plattentellerRightAnimationRunning = true;
					break;
				
				case true:
					//console.log("plattentellerRightAnimation true");
					$plattentellerRight.css("-webkit-animation-play-state", "paused");
					plattentellerRightAnimationRunning = false;
					break;
			}
	},
	
	initCoverflow = function() {
		$('#dg-container').gallery();
	},
	
	updateCoverDraggable = function() {
		$(".cover").draggable({ revert: true });
		
		$(".plattenteller").droppable({
			over: function(event, ui) {
				//console.log("droppable over");
				$(this).addClass("dragOver");
			},
			
			out: function(event, ui) {
				//console.log("droppable out");
				$(this).removeClass("dragOver");
			},
			
			drop: function(event, ui) {
				$(this).removeClass("dragOver");
				//console.log("droppable drop");
				//console.log(event);
				//console.log(ui);
				
				
				
				console.log("Platte auf die gedroppt wurde: " + event.target.id);
				
				console.log("Cover das gedroppt wurde: " + event.srcElement.id);
				
				switch(event.target.id) {
					case "plattenteller-left":
						switch(event.srcElement.id) {
							case "img_cover1":
								$("#plattenteller-left").empty();
								$("#plattenteller-left").append("<img src='images/cover/cover1.png' class='transform-record'>");
								model.setSelPlattenId("TellerLeft",1);
								break;
							case "img_cover2":
								$("#plattenteller-left").empty();
								$("#plattenteller-left").append("<img src='images/cover/cover2.png' class='transform-record'>");
								model.setSelPlattenId("TellerLeft",2);
								break;
							case "img_cover3":
								$("#plattenteller-left").empty();
								$("#plattenteller-left").append("<img src='images/cover/cover3.png' class='transform-record'>");
								model.setSelPlattenId("TellerLeft",3);
								break;
							case "img_cover4":
								$("#plattenteller-left").empty();
								$("#plattenteller-left").append("<img src='images/cover/cover4.png' class='transform-record'>");
								model.setSelPlattenId("TellerLeft",4);
								break;
							case "img_cover5":
								$("#plattenteller-left").empty();
								$("#plattenteller-left").append("<img src='images/cover/cover5.png' class='transform-record'>");
								model.setSelPlattenId("TellerLeft",5);
								break;
						}
						if(model.getWaitingInstruments()["TellerLeft"] == true) {
									$btn_ttLeft.text("...");					
						};
						break;
						
					case "plattenteller-right":
						switch(event.srcElement.id) {
							case "img_cover1":
								$("#plattenteller-right").empty();
								$("#plattenteller-right").append("<img src='images/cover/cover1.png' class='transform-record'>");
								model.setSelPlattenId("TellerRight",1);
								break;
							case "img_cover2":
								$("#plattenteller-right").empty();
								$("#plattenteller-right").append("<img src='images/cover/cover2.png' class='transform-record'>");
								model.setSelPlattenId("TellerRight",2);
								break;
							case "img_cover3":
								$("#plattenteller-right").empty();
								$("#plattenteller-right").append("<img src='images/cover/cover3.png' class='transform-record'>");
								model.setSelPlattenId("TellerRight",3);
								break;
							case "img_cover4":
								$("#plattenteller-right").empty();
								$("#plattenteller-right").append("<img src='images/cover/cover4.png' class='transform-record'>");
								model.setSelPlattenId("TellerRight",4);
								break;
							case "img_cover5":
								$("#plattenteller-right").empty();
								$("#plattenteller-right").append("<img src='images/cover/cover5.png' class='transform-record'>");
								model.setSelPlattenId("TellerRight",5);
								break;
						}
						if(model.getWaitingInstruments()["TellerRight"] == true) {
									$btn_ttRight.text("...");					
						};
						break;
				}
			}
		});
	},
	
	getFilterNodeLeft = function(){
		return filterPlatteLeft;
	},
	getFilterNodeRight = function(){
		return filterPlatteRight;
	};
	
	return {
		init: init,
		playTellerLeft : playTellerLeft,
		playTellerRight : playTellerRight,
		getDurationLeft : getDurationLeft,
		getDurationRight : getDurationRight,
		getNodePlatteLeft : getNodePlatteLeft,
		getNodePlatteRight : getNodePlatteRight,
		stopTellerLeft : stopTellerLeft,
		stopTellerRight : stopTellerRight,
		getFilterNodeLeft: getFilterNodeLeft,
		getFilterNodeRight: getFilterNodeRight,
		playStopPlatte: playStopPlatte,
	};
})(DJ);
