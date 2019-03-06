DJ.Metronom = (function(app) {

	var model = DJ.Model,
	barCounter = 1,
	boolean_startedDrumMachine = false,
	
	
	//Bei 100 Schlägen in der Minute dauert ein Takt 2,4s lang
	//-->2400 ms
	barTime = 2400,
	
	//dient dazu, Tracks, die wieder geloopt werden sollen, 
	//rechtzeitig als wartend zu kennzeichnen
	waitingBufferTime = 200,
	
	sixteenthCounter = 0,
	quarterCounter = 0,
	
	//Helfer-Variablen, um die gestarteten Intervalle abfangen zu können
	sixteenthInterval,
	quarterInterval,
	
	//Hilfsvariablen, um die Latenzen(Verzögerungen) zwischen Taktende
	//und Taktanfang zu messen
	d,
	startZeit,
	
	$metronomBeat1,
	$metronomBeat2,
	$metronomBeat3,
	$metronomBeat4,
	
	$metronomWrapper,
	
	init = function() {
		$metronomBeat1 = $("#metronomBeat1");
		$metronomBeat2 = $("#metronomBeat2");
		$metronomBeat3 = $("#metronomBeat3");
		$metronomBeat4 = $("#metronomBeat4");
		
		$metronomWrapper = $("#metronomWrapper");
		
		startSessionLoop();
	},
	
	startSessionLoop = function() {
		if(boolean_startedDrumMachine == false) {
			boolean_startedDrumMachine = true;
		}
		
		window.setTimeout(function()
			{
				//Für den Loop wird die Funktion in einem bestimmten Intervall wiederholt aufgerufen.
				window.setInterval(playWaitingInstruments, barTime)
			}
			,4000);
	},
	
	//Führt den eigentlichen Loop aus. Es werden die Instrumente abgespielt, die 
	//darauf warten und nicht gerade schon abgespielt werden. Außerdem wird
	//das Zählen der Sechzehntel für diesen Takt gestartet.
	playWaitingInstruments = function() {
		window.clearInterval(sixteenthInterval);
		window.clearInterval(quarterInterval);	
		quarterCounter = 0;
		sixteenthCounter = 0;
		
		window.setTimeout( function(){
			startMetronomInterval();
		}, model.getBufferTime()+100);
		
		//countDelayTime();
        
        //Spiele DrumMachine, falls wartend und noch nicht spielend
		if(model.getWaitingInstruments()["DrumMachine"]==true) {
				if(model.getPlayingInstruments()["DrumMachine"]==false) {
					playDrumMachine();
					showSixteenthPad();
					sixteenthInterval = window.setInterval(showSixteenthPad, barTime/16);
				}
		}
		else {
			//Es muss kein Track beendet werden, da kein Sample der DrumMachine
			//einen Takt lang dauert. Die DrumMachine muss also nicht mehr "gestoppt" 
			//werden, sondern einfach nur nicht mehr abgespielt.
		}        
        
        if(barCounter%2!=0) {
			//Spiele linke Platte
			if(model.getWaitingInstruments()["TellerLeft"]==true) {
				if(model.getPlayingInstruments()["TellerLeft"]==false) {
						playRecordPlayerLeft();
				}
			}	
			else {
				stopTellerLeft();
			}
	
			//Spiele rechte Platte
			if(model.getWaitingInstruments()["TellerRight"]==true) {
				if(model.getPlayingInstruments()["TellerRight"]==false) {
						playRecordPlayerRight();
				}
			}	
			else {
				stopTellerRight();
			}		
			
			//Spiele Tracks
			for(var i=1; i<=4; i++) {
	
				if(model.getWaitingInstruments()["Track"+i]==true) {
					if(model.getPlayingInstruments()["Track"+i]==false) {
							//play Track 1 bis 4();
							window["DJ"]["Metronom"]["playTracks"](i);
					}
				}
				else {
					window["DJ"]["Metronom"]["stopTracks"](i);
				}
			}
		}
		barCounter++;	
	},
	
	//misst die Verzögerungszeit zwischen TaktEnde und Taktanfang
	countDelayTime = function() {
		d = new Date();
		//startZeit anfangs noch undefiniert, daher keine Ausgabe 
		if(startZeit) {
			console.log("Verzoegerung: "+(d.getTime()-startZeit-barTime));
		}
		startZeit = d.getTime();
	},
	
	//Die Methode showSixteenthPad() wird in einem Interval von
	//einer 16tel wiederholt aufgerufen. Am Beginn des nächsten Takts wird
	//der Aufruf neu gestartet.		
	startMetronomInterval = function() { 
		showCurrentQuarter();
		quarterInterval = window.setInterval(showCurrentQuarter, barTime/4);
	},
	
	//Die Methode zählt die Sechzehntel durch und visualisiert jede Viertelnote
	//beim Metronom selbst und jede Sechzehntel bei der Drummachine
	showSixteenthPad = function() {   
		sixteenthCounter++;
		//console.log("showSixteenthPad: "+sixteenthCounter);
		DJ.DrumMachine.showMovingPads(sixteenthCounter);
	},
	
	//Die Methode zeigt beim Metronom selbst den jeweiligen aktuellen
	//Taktschlag an. 
	showCurrentQuarter = function() {
		if(quarterCounter==0) {
			var $drummachineWrapper = $("#drummachineWrapper");
			$drummachineWrapper.find(".btn_drumMachinePad_moving").removeClass("btn_drumMachinePad_moving");
		}
		quarterCounter++;
		$metronomWrapper.find(".currentQuarter").removeClass("currentQuarter");
		$("#metronomBeat"+quarterCounter).addClass("currentQuarter");
	},
	
	//Startet einfach nur die DrumMachine, da der Status "playing" nicht gesetzt werden muss.
	playDrumMachine = function() {
		DJ.DrumMachine.playLoop();	
	},
	
	//Spielt die Tracks ab und setzt den Status kurz bevor der Track am
	//Ende ist auf nicht mehr spielend, damit der Track wieder geloopt werden kann.
	playTracks = function(pTrackId) {
		window["DJ"]["Spuren"]["playTrack"+pTrackId]();
		model.setMeAsPlaying("Track"+pTrackId);
		window.setTimeout(function()
			{
				model.setMeAsNotPlaying("Track"+pTrackId)
			},
		(1000*model.getSampleDuration()["Track"+pTrackId])-waitingBufferTime);
	},
	
	//Stoppt die Spuren und setzt sie auf nicht mehr wartend, falls der Track
	//vorzeitig beendet wurde
	stopTracks = function(pTrackId) {
		window["DJ"]["Spuren"]["stopTrack"+pTrackId]();
		model.setMeAsNotPlaying("Track"+pTrackId);
	},

	//spielt linken Plattenteller
	playRecordPlayerLeft = function() {
		DJ.Platten.playTellerLeft();
		model.setMeAsPlaying("TellerLeft");
		
		//setze Instrument, kurz bevor es das Sample fertig gespielt hat,
		//auf nicht mehr spielend
		window.setTimeout(function()
			{
				model.setMeAsNotPlaying("TellerLeft")
			},
		(1000*DJ.Platten.getDurationLeft())-waitingBufferTime);
	},
	
	//spielt rechten Plattenteller
	playRecordPlayerRight = function() {
		DJ.Platten.playTellerRight();
		model.setMeAsPlaying("TellerRight");
		
		//setze Instrument, kurz bevor es das Sample fertig gespielt hat,
		//auf nicht mehr spielend
		window.setTimeout(function()
			{
				model.setMeAsNotPlaying("TellerRight")
			},
		(1000*DJ.Platten.getDurationRight())-waitingBufferTime);
	},
		
	//stoppt den linken Teller und setzt ihn als nicht mehr spielend
	stopTellerLeft = function() {
		DJ.Platten.stopTellerLeft();
		model.setMeAsNotPlaying("TellerLeft");
	},
	
	stopTellerRight = function() {
		DJ.Platten.stopTellerRight();
		model.setMeAsNotPlaying("TellerRight");
	};
	
	return {
		init: init,
		playTracks : playTracks,
		stopTracks : stopTracks
	};
})(DJ);
