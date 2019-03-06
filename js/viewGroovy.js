DJ.Groovy = (function(app) {
	var model = DJ.Model,
	
	$effects = $("#filterWrapper");
	$metronom = $("#metronomWrapper");
	$groovyWrapper = $("#groovyWrapper");
	$groovy = $("#groovyImage");
	$turntableLeft = $("#turntableLeftWrapper");
	$turntableRight = $("#turntableRightWrapper");
	$equalizer = $("#equalizerWrapper");
	$plattenbox = $("#plattenbox");
	$drummachine = $("#drummachineWrapper");
	$tracks = $("#spurenWrapper");
	
	$groovyBubble = $("#groovyImageBubble");
	$groovyInfo = $("#groovyInfo");
	
	$groovyThinkBubble = $("#groovyThinkBubble");
	$groovyThinkBubbleContent = $("#groovyThinkBubbleContent");
	
	$btn_help = $("#btn_help");
	
	var groovyInFront = true;
	
	//Variablen für Infos, die Groovy gibt!
	var info_effects = "Hier kannst du verschiedene<br>Filter auf deine Instrumente anwenden und regeln.",
	info_metronom = "Das Metronom zeigt die Position im Takt an.",
	info_groovy = "Hi, ich bin Groovy.<br>Ich gebe dir Tipps zu den einzelnen Instrumenten, wenn du mit der Maus dar&uuml;berf&auml;hrst.<br>Mich kannst du per klick ein- und ausblenden, wenn ich dir auf die Nerven gehe.",
	info_turntableLeft = "Das ist der linke Plattenspieler",
	info_turntableRight = "Das ist der rechte Plattenspieler",
	info_turntable = "Auf die Turntables kannst du Samples<br>aus der Plattenbox legen und abspielen. Klicke dazu auf die Box und ziehe das gew&uuml;nschte Sample mit gedr&uuml;ckter Maustaste auf den Plattenteller.",
	info_equalizer = "Mit dem Equalizer kannst du die<br>Lautst&auml;rken der einzelnen Instrumente anpassen und die Balance zwischen den Turntables verschieben. Mit den 'M'- und 'S'-Kn&ouml;pfen kannst du die Instrumente auf Mute bzw. Solo setzen.",
	info_plattenbox = "Bei Klick auf die Plattenbox<br>&ouml;ffnet sich ein Coverflow, aus dem du Samples per Drag&Drop auf die Turntables legen kannst. Mit den Pfeilen kannst du durch den Coverflow navigieren.",
	info_trackSelect = "Hier kannst du zus&auml;tzliche<br>Spuren zum Set hinzuf&uuml;gen. Klicke dazu auf die gr&uuml;ne Schaltfl&auml;che und w&auml;hle das gew&uuml;nschte Sample per Klick",
	info_drummachine = "Mit der Drummachine kannst du den Grundbeat deiner Session bestimmen. Klicke auf die Pads in der jeweiligen Zeile und Spalte um einen Taktschlag zu setzen bzw. zu entfernen. Mit den beiden 'Save'-Buttons kannst du zwei Patterns speichern und jederzeit wieder abrufen.",
	
	init = function() {
		
		$groovyBubble.hide();
		$groovyInfo.hide();
		$groovyThinkBubble.show();
		$groovyThinkBubbleContent.show();
		
		//Registrierung der Mouse-Events
		$effects.on('mouseenter', onMouseEnter);
		$metronom.on('mouseenter', onMouseEnter);
		$groovy.on('mouseenter', onMouseEnter);
		$turntableLeft.on('mouseenter', onMouseEnter);
		$turntableRight.on('mouseenter', onMouseEnter);
		$equalizer.on('mouseenter', onMouseEnter);
		$drummachine.on('mouseenter', onMouseEnter);
		$tracks.on('mouseenter', onMouseEnter);
		$plattenbox.on('mouseenter', onMouseEnter);
		
		$effects.on('mouseleave', onMouseLeave);
		$metronom.on('mouseleave', onMouseLeave);
		$groovy.on('mouseleave', onMouseLeave);
		$turntableLeft.on('mouseleave', onMouseLeave);
		$turntableRight.on('mouseleave', onMouseLeave);
		$equalizer.on('mouseleave', onMouseLeave);
		$drummachine.on('mouseleave', onMouseLeave);
		$tracks.on('mouseleave', onMouseLeave);
		$plattenbox.on('mouseleave', onMouseLeave);
		
		$groovy.on('click', onGroovyClick);
		
		$btn_help.on('click', onHelpClick);

		onGroovyClick();
	},
	
	onMouseEnter = function(event) {
		if(groovyInFront == true) {
			switch(event.currentTarget.id) {
				case "filterWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_effects);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "metronomWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_metronom);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "groovyImage":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_groovy);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "turntableLeftWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_turntable);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "turntableRightWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_turntable);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "equalizerWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_equalizer);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "drummachineWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_drummachine);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "spurenWrapper":
					//console.log("onMouseEnter: " + event.currentTarget.id);
					$groovyInfo.html(info_trackSelect);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
				case "plattenbox":
					$groovyInfo.html(info_plattenbox);
					$groovyBubble.fadeIn(100);
					$groovyInfo.fadeIn(100);
					break;
			}
		} else {
			//Zeigt Fragezeichenblase
		}
	},
	
	onMouseLeave = function(event) {
		if(groovyInFront == true) {
			$groovyBubble.hide();
			$groovyInfo.hide();
		} else {
			//Lässt Denkblase angezeigt
		}
		/*switch(event.currentTarget.id) {
			case "metronomWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "groovyWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "turntableLeftWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "turntableRightWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "equalizerWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "drummachineWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
			case "spurenWrapper":
				//console.log("onMouseLeave: " + event.currentTarget.id);
				$groovyBubble.fadeOut(100);
				$groovyInfo.fadeOut(100);
				break;
		}*/
	},
	
	onGroovyClick = function(event) {
		
	console.log("onGroovyClick");
		if(groovyInFront == true) {
			$groovyBubble.fadeOut(100);
			$groovyInfo.hide();
			$groovyWrapper.animate({
				"margin-top": "150px"
			}, 300);
			$groovyThinkBubble.fadeIn(200);
			$groovyThinkBubbleContent.fadeIn(300);
			groovyInFront = false;
		}
		else {
			$groovyWrapper.animate({
				"margin-top": "25px"
			}, 300);
			$groovyThinkBubble.fadeOut(100);
			$groovyThinkBubbleContent.fadeOut(50);
			groovyInFront = true;
		}
	},
	
	onHelpClick = function(event) {
		
	};
	
	
	return {
		init: init,
	};
})(DJ);
