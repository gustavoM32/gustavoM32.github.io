function setup() {
	frameRate(60)
	
	// Initial config
	createCanvas(windowWidth, windowHeight);
	colorMode(HSL, 360, 100, 100, 100);
	ellipseMode(RADIUS);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	textFont("Calibri");
}

// Adjusts the canvas size when the window is resized
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// Gridlines to for design
function drawGridLines(widthDivs, heightDivs) {
	stroke(0, 0, 50);
	for (var i = 1; i <= widthDivs; i++) {
		line(i*width/widthDivs, 0, i*width/widthDivs, height);
	}
	for (var i = 1; i <= heightDivs; i++) {
		line(0, i*height/heightDivs, width, i*height/heightDivs);
	}
	textSize(16);
	for (var i = 1; i <= widthDivs; i++) {
		text(i/widthDivs, i*width/widthDivs, 0.5*height/heightDivs);
	}
	for (var i = 1; i <= heightDivs; i++) {
		text(i/heightDivs, 0.5*width/widthDivs, i*height/heightDivs);
	}
}
	
function loadjs(file) {
	var existentScript = document.getElementById("script1");
	if (existentScript !== null) {
		document.body.removeChild(existentScript);
	}
	var script = document.createElement("script");
	script.id = "script1";
	script.type = "text/javascript";
	script.src = file;
	script.onload = function() {
		ext.numObjWeek = numObjWeek;
		ext.weekObjHours = weekObjHours;
		ext.allTimeObjHours = allTimeObjHours;
		//ext.weekObjTargetHours = weekObjTargetHours;
		ext.volumeStart = volumeStart;
		ext.volumeEnd = volumeEnd;
		ext.fullCompleted = fullCompleted;
		ext.totalClasses = totalClasses;
	};
	document.body.appendChild(script);
}

	function getFormatedTime(date, displayMillis, UTC) {
		if (!(date instanceof Date)) {
			date = new Date(date);
		}
		if (date.getTime() < 0) {
			date.setTime(0);
		}
		if (UTC == undefined || UTC == true) {
			var hours = floor(date.getTime()/1000/60/60);
			var minutes = date.getUTCMinutes();
			var seconds = date.getUTCSeconds();
			var millis = date.getUTCMilliseconds();
		} else {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var millis = date.getMilliseconds();
		}
		var displayHours = hours < 10 ? "0" + hours : hours;
		var displayMinutes = minutes < 10 ? "0" + minutes : minutes;
		var displaySeconds = seconds < 10 ?  "0" + seconds : seconds;
		if (displayMillis == undefined || displayMillis == false) {
			return displayHours + ":" + displayMinutes + ":" + displaySeconds;
		}
		var displayMillis = millis < 100 ? (millis < 10 ? "00" + millis : "0" + millis) : millis;
		return displayHours + ":" + displayMinutes + ":" + displaySeconds + ":" + displayMillis;
	};
	
	function getFormatedDate(date, UTC) {
		if (UTC == undefined || UTC == true) {
			var day = date.getUTCDate();
			var month = date.getUTCMonth();
			var year = date.getUTCFullYear();
		} else {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
		}
		var displayDay = day < 10 ? "0" + day : day;
		var displayMonth = month < 10 ? "0" + month : month;
		return displayDay + "/" + displayMonth + "/" + year;
	};

	function dataUpdate() {
		loadjs("C:/Users/Pc/Google Drive/Programação/Programas/Produtividade/objData.js");
		//ext.weekObjHours = 1;
		//ext.weekObjTargetHours = 30;
		
		customTargetHours = localStorage.getItem("targetHours");
		
		curDate = new Date();
		//curDate = new Date(curDate.getTime()+3*24*millisInAHour*1.2181);
		time = curDate.getTime();
	
		var weekStart = (new Date(1970, 00, 04, 00, 00, 00, 000)).getTime();
		//if (curDate.getTimezoneOffset() == 180) {
			weekStart -= 1*60*60*1000; //(horário de verão)
		//}
		weekTime[0] = ((time - weekStart) % weekTime[2]);
		weekTime[1] = weekTime[2] - weekTime[0];
		weekPerc = weekTime[0]/weekTime[2];
		
		var equilibriumP = ((customTargetHours*millisInAHour)*weekTime[0] - (ext.weekObjHours*millisInAHour + currentTaskTimer.time)*weekTime[2]) / (weekTime[2] - customTargetHours*millisInAHour);
		var equilibriumO = ((customTargetHours*millisInAHour)*weekTime[0] - (ext.weekObjHours*millisInAHour + currentTaskTimer.time)*weekTime[2]) / (-customTargetHours*millisInAHour);
		
		var maxEqTime = 5*millisInAHour;
		//console.log(equilibriumO/millisInAHour, equilibriumP/millisInAHour);
		if (weekTime[1] <= maxEqTime) {
			maxEqTime = weekTime[1];
		}
		if (equilibriumO > maxEqTime && frameCount > 3) {
			ext.weekObjTargetHours = ((ext.weekObjHours*millisInAHour + currentTaskTimer.time)*weekTime[2])/(maxEqTime*millisInAHour + millisInAHour*weekTime[0]);
			//console.log(ext.weekObjTargetHours);
			equilibriumO = maxEqTime;
		}
		if (equilibriumP > maxEqTime && frameCount > 3) {
			ext.weekObjTargetHours = (maxEqTime*weekTime[2] + (ext.weekObjHours*millisInAHour + currentTaskTimer.time)*weekTime[2])/(millisInAHour*weekTime[0] + maxEqTime*millisInAHour)
			//console.log(ext.weekObjTargetHours);
			equilibriumP = maxEqTime;
		}
		
		localStorage.setItem("targetHours", ext.weekObjTargetHours); // Keeps the targetHours fixed
		
		var weekObjMillis = ext.weekObjHours * millisInAHour + currentTaskTimer.time;
		//console.log(weekObjMillis/millisInAHour);
		
		/*if (weekObjMillis < 5*millisInAHour) {
			ext.weekObjTargetHours = 5;
		} else if (weekObjMillis < 10*millisInAHour) {
			ext.weekObjTargetHours = 10;
		} else if (weekObjMillis < 15*millisInAHour) {
			ext.weekObjTargetHours = 15;
		} else if (weekObjMillis < 25*millisInAHour) {
			ext.weekObjTargetHours = 25;
		} else if (weekObjMillis < 50*millisInAHour) {
			ext.weekObjTargetHours = 50;
		}*/
		
		objWeekRatio = ext.weekObjTargetHours/168;
		objAllTime = ext.allTimeObjHours * millisInAHour + currentTaskTimer.time;
		var extraTime = weekObjMillis - min(weekObjMillis, ext.weekObjTargetHours*millisInAHour)
		objTime = [
			weekObjMillis - extraTime,
			0,
			(ext.weekObjTargetHours)*millisInAHour,
			extraTime
		];
		objTime[1] = objTime[2] - objTime[0];
		objPerc = objTime[0]/objTime[2];
		extraPerc = objTime[3]/objTime[2];

		
		
		for (var i = 0; i < ext.volumeStart.length; i++) {
			volumeStartTime[i] = convertExcelDatetoUTC(ext.volumeStart[i]);
			volumeEndTime[i] = convertExcelDatetoUTC(ext.volumeEnd[i]);
		}
    	
		workTimePerDay = objTime[1] / (weekTime[1]/1000/60/60/24);
		
		var percDiff = weekPerc - objPerc;
		// When producing
		if (percDiff > 0) {
			equilibrium = equilibriumP;
			late = true;
		} else {
			equilibrium = equilibriumO;
			late = false;
		}
	};
	
	var Timer = function() {
		this.time = 0;
		this.toRun = false;
		this.previousTime = 0;
	};
	Timer.prototype.run = function() {
		if (!this.toRun) {
			return;
		}
		var currentTime = millis();
		this.time += currentTime - this.previousTime;
		this.previousTime = millis();
	};
	Timer.prototype.start = function() {
		if (this.toRun) {
			return;
		}
		this.toRun = true;
		this.previousTime = millis();
	};
	Timer.prototype.pause = function() {
		if (!this.toRun) {
			return;
		}
		this.toRun = false;
	};
	Timer.prototype.reset = function() {
		this.time = 0;
		this.toRun = false;
		this.previousTime = 0;
	};
	
	currentTaskTimer = new Timer();
	
	var WeekProgressCircle = function() {};
	WeekProgressCircle.prototype.drawAll = function() {
		this.margin = min(width*0.1, height*0.1);
		// Overall radius
		this.totalRadius = min(width/2 - this.margin, height/2 - this.margin);
		// Radius of this.center circle
		this.centerRadius = this.totalRadius*(2/3);
		centerRadi = this.centerRadius;
		// Radius of the objective-reserved hours of the week
		this.objRadius = sqrt(objWeekRatio * (sq(this.totalRadius) - sq(this.centerRadius)) + sq(this.centerRadius));
		this.objCrownWidth = this.objRadius - this.centerRadius;
		this.nonObjCrownWidth = this.totalRadius - this.objRadius;
		this.center = [width*0.5, height*0.5];
		this.textColor = color(270, 100, 87.5);
		/* Circles */
		noStroke();
		// Background
		fill(260, 38, 36);
		ellipse(this.center[0], this.center[1], this.totalRadius, this.totalRadius);
		// Total week completion
		fill(260, 60, 25);
		completionCircle(this.center[0], this.center[1], this.totalRadius, weekPerc);
		// Objective hours completion
		fill(260, 74, 40);
		completionCircle(this.center[0], this.center[1], this.objRadius, objPerc);
		fill(270, 74, 35);
		completionCircle(this.center[0], this.center[1], this.objRadius, extraPerc);
		// Center
		if (currentTaskTimer.toRun) {
			fill(280, 67, 18);
		} else {
			fill(270, 67, 15);
		}
		ellipse(this.center[0], this.center[1], this.centerRadius, this.centerRadius);
		
		textSize(this.totalRadius*0.07);
		fill(260, 71, 65);
		text(ext.numObjWeek + "ª Semana de Objetivos", this.center[0], this.center[1] - this.centerRadius*0.75);
		text(getFormatedDate(curDate, false) + " " + getFormatedTime(curDate, true, false), this.center[0], this.center[1] - this.centerRadius*0.625);
		text(getFormatedTime(objAllTime, true), this.center[0], this.center[1] - this.centerRadius*0.5);
		fill(this.textColor);
		this.crownPercs();
		this.hoursData();
		this.currentTask();
		this.equilibrium();
		this.hoursPerDay();
		this.dayMarks();
	};
	WeekProgressCircle.prototype.crownPercs = function() {
		textSize(this.totalRadius*0.08);
		fill(260, 100, 90);
		text(((objPerc + extraPerc)*100).toFixed(1) + "%", this.center[0], this.center[1] - this.objRadius + this.objCrownWidth*0.5);
		fill(260, 100, 80);
		text((weekPerc*100).toFixed(1) + "%", this.center[0], this.center[1] - this.totalRadius + this.nonObjCrownWidth*0.5);
	};
	WeekProgressCircle.prototype.hoursData = function() {
		fill(0, 0, 0, 15);
		rect(this.center[0], this.center[1] - this.centerRadius*0.05, this.centerRadius*1.6, this.centerRadius*0.65);
		fill(this.textColor);
		
		text("Horas", this.center[0], this.center[1] - this.centerRadius*0.3);
		textSize(this.totalRadius*0.05);
		var leftText = "Produtivas";
		var rightText = "Ociosas";
		text(leftText + " | " + rightText, this.center[0] - (textWidth(leftText) - textWidth(rightText))*0.5, this.center[1] - this.centerRadius*0.2);
		text("Total", this.center[0], this.center[1] - this.centerRadius*0.125);
		
		textSize(this.totalRadius*0.08);
		text("Realizadas", this.center[0] - this.centerRadius*0.4, this.center[1] - this.centerRadius*0.0);
		textSize(this.totalRadius*0.05);
		
		var leftText = getFormatedTime(objTime[0] + objTime[3]);
		var rightText = getFormatedTime(weekTime[0] - objTime[0] - objTime[3]);
		text(leftText + " | " + rightText, this.center[0] - this.centerRadius*0.4 - (textWidth(leftText) - textWidth(rightText))*0.5, this.center[1] + this.centerRadius*0.125);
		text(getFormatedTime(weekTime[0]), this.center[0] - this.centerRadius*0.4, this.center[1] + this.centerRadius*0.2);
		
		textSize(this.totalRadius*0.08);
		text("Restantes", this.center[0] + this.centerRadius*0.4, this.center[1] - this.centerRadius*0.0);
		textSize(this.totalRadius*0.05);
		
		var leftText = getFormatedTime(objTime[1]);
		var rightText = getFormatedTime(max(weekTime[1] - objTime[1], 0));
		text(leftText + " | " + rightText, this.center[0] + this.centerRadius*0.4 - (textWidth(leftText) - textWidth(rightText))*0.5, this.center[1] + this.centerRadius*0.125);
		text(getFormatedTime(weekTime[1]), this.center[0] + this.centerRadius*0.4, this.center[1] + this.centerRadius*0.2);
	};
	WeekProgressCircle.prototype.currentTask = function() {
		textSize(this.totalRadius*0.08);
		text("Tarefa atual", this.center[0] - this.centerRadius*0.4, this.center[1] + this.centerRadius*0.4);
		textSize(this.totalRadius*0.05);
		currentTaskTimer.run();
		text(getFormatedTime(currentTaskTimer.time, true), this.center[0] - this.centerRadius*0.4, this.center[1] + this.centerRadius*0.5);
	};
	WeekProgressCircle.prototype.equilibrium = function() {
		textSize(this.totalRadius*0.08);
		if (late) {
			text("Equilíbrio (P)", this.center[0] + this.centerRadius*0.4, this.center[1] + this.centerRadius*0.4);
		} else if (equilibrium !== 0) {
			text("Equilíbrio (O)", this.center[0] + this.centerRadius*0.4, this.center[1] + this.centerRadius*0.4);
		} else {
			text("Equilíbrio!", this.center[0] + this.centerRadius*0.4, this.center[1] + this.centerRadius*0.4);
		}
		textSize(this.totalRadius*0.05);
		text(getFormatedTime(abs(equilibrium), true), this.center[0] + this.centerRadius*0.4, this.center[1] + this.centerRadius*0.5);
	};
	WeekProgressCircle.prototype.hoursPerDay = function() {
		textSize(this.totalRadius*0.08);
		text("Horas por dia", this.center[0], this.center[1] + this.centerRadius*0.75);
		textSize(this.totalRadius*0.05);
		text(getFormatedTime(workTimePerDay, true), this.center[0], this.center[1] + this.centerRadius*0.85);
	};
	WeekProgressCircle.prototype.dayMarks = function() {
		textSize(this.totalRadius*0.08);
		for (var i = 0; i < 7; i ++) {
			push();
			
			translate(this.center[0], this.center[1]);
			rotate(2*PI*0.5/7 + 2*PI*i/7);
			// Rotates the upside-down words
			if (i >= 2 && i <= 4) {
				translate(0, -this.totalRadius*1.04);
				rotate(PI);
				translate(0, +this.totalRadius*1.04);
			};
			translate(-this.center[0], -this.center[1]);
			
			if (i == curDate.getDay()) {
				fill(260, 17, 76);
			}
			else {
				fill(260, 25, 8);
			}
			text(weekDays[i], this.center[0], this.center[1] - this.totalRadius*1.04);
			pop();
		}
	};
			
	weekProgressCircle = new WeekProgressCircle();
	

function mousePressed() {
	if (sqrt(sq(mouseX - weekProgressCircle.center[0]) + sq(mouseY - weekProgressCircle.center[1])) < weekProgressCircle.centerRadius) {
		if (currentTaskTimer.toRun) {
			currentTaskTimer.pause();
		} else {
			currentTaskTimer.start();
		}
	}
}

function keyPressed() {
	if (key.toString() == "s" || key.toString() == "S") {
		currentTaskTimer.start();
	}
	if (key.toString() == "p" || key.toString() == "P") {
		currentTaskTimer.pause();
	}
	if (key.toString() == "r" || key.toString() == "R") {
		currentTaskTimer.reset();
	}
    if (key.toString() == "d" || key.toString() == "D") {
		if (isLooping) {
			noLoop();
			isLooping = false;
		} else {
			loop();
			isLooping = true;
		}
	}
	if (key.toString() == "f" || key.toString() == "F") {
		if (lowFrameRate) {
			frameRate(60);
			lowFrameRate = false;
		} else {
			frameRate(1);
			lowFrameRate = true;
		}
	}
}

function draw() {
	//drawGridLines(20, 20);
	dataUpdate();
	background(260, 38, 47);
	weekProgressCircle.drawAll();
    //console.log(volumeStartTime + " " + volumeEndTime + " " + time);
    //console.log(ext.basicCompleted + " " + ext.fullCompleted + " " + ext.totalClasses);
}