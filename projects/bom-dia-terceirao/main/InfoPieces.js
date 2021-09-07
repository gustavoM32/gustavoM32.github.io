function updateInfoPiecesDefPos() {
	infoPiecesDefPos = [
		{
			name: "themeColorBackground",
			draw: false,
			alpha: 0,
		},
		{
			name: "mainMessage",
			draw: false,
			x: width*0.5,
			y: height*0.125,
			size: height*0.13,
		},
		{
			name: "periodsVisualizer",
			draw: false,
			x: width*0.5,
			y: height*0.24,
			size: height*0.025,
		},
		{
			name: "mainTime",
			draw: false,
			x: width*0.5,
			y: height*0.5,
			size: height*0.125,
		},
		{
			name: "customInfo",
			draw: false,
			x: width*0.5,
			y: height*0.33,
			size: height*0.04,
		},
		{
			name: "remainingTime",
			draw: false,
			x: width*0.175,
			y: height*0.8,
			size: height*0.04,
		},
		{
			name: "testsList",
			draw: false,
			x: width*0.825,
			y: height*0.47,
			size: height*0.03,
		},
		{
			name: "leftInfo",
			draw: false,
			x: width*0.175,
			y: height*0.47,
			size: height*0.03,
		},
		{
			name: "calendar",
			draw: false,
			x: width*0.825,
			y: height*0.79,
		},
		{
			name: "dayCompletion",
			draw: false,
			x: width*0.5, 
			y: height*0.8,
			size: min(height*0.125, width*0.1),
		},
	];
}

/* Display functions */
// Draws background color
function themeColorBackground() {
	var alpha = curPos.alpha;
	
	background(themeColor[0], themeColor[1], themeColor[2]); // Opaque background (current)
	noStroke();
	rectMode(CORNERS);
	fill(previousThemeColor[0], previousThemeColor[1], previousThemeColor[2], alpha); // Old background (fade out)
	rect(0, 0, width, height);
	rectMode(CENTER);
}

// The main program's message ended with ", Terceirão!"
function mainMessage() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
	textSize(size);
	fill(textColor);
	boldText(mainMessageText, x, y);
}

// Periods bar, the center is the present, to the right is the periods to come and to the left the periods passed
function periodsVisualizer() {
	var x = curPos.x;
	var y = curPos.y;
	var thickness = curPos.size;
	
	var maxValue = visualizerScale*60*60*1000;
	rectMode(CORNERS);
	// Draws all periods rectangles
	for (var i = 0; i < visualizerValues.length; i++) {
		/** Day change is not handled */
		var startPos = visualizerValues[i]*width/(2*maxValue) + width*0.5; // Start X coordinate
		var endPos; // End X coordinate
		if ((i + 1) == visualizerValues.length) {
			endPos = width*1.1; // End X coordinate for the last period
		} else {
			endPos = visualizerValues[i + 1]*width/(2*maxValue) + width*0.5;
		}
		periodName = getPeriodName(todayPeriods[i]);
		rectColor = getPeriodColor(todayPeriods[i]);
		if (todayPeriods[i][1] == "before") {
			textPos = endPos;
		} else if (todayPeriods[i][1] == "after") {
			textPos = startPos;
		} else {
			textPos = (startPos + endPos)*0.5;
		}
		
		stroke(0, 0, 0, 30);
		fill(rectColor[0], rectColor[1], rectColor[2], 80);
		rect(startPos, y - thickness*0.5, endPos, y + thickness*0.5); // Period rectangle
		
		fill(textColor);
		textSize(thickness*0.85);
		boldText(getFormatedDayTime(todayPeriods[i][0]), startPos, y - thickness*1.4); // Period start time
		
		textSize(thickness);
		boldText(periodName, textPos, y + thickness*1.5); // Period name
	}
	
	fill(0, 0, 0, 5);
	rect(0, y - thickness*0.5 + 1, width, y + thickness*0.5)
	
	stroke(textStrokeColor);
	strokeWeight(2);
	line(x, y - thickness*0.75, x, y + thickness*0.75); // Present center line
	strokeWeight(1);
	rectMode(CENTER);
}

// Time, date and weekday
function mainTime() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
	
	noStroke();
	fill(0, 0, 0, 20);
	completionCircle(x, y, size*1.1, yearPerc);
	
	textFont("Calibri");
	noStroke();
	fill(textColor);
	textSize(size*0.4);
	textStyle(BOLD);
	text(getFormatedDate(currentTime, true, false), x, y - size*0.7); // Date
	textSize(size);
	text(getFormatedTime(currentTime, false, false), x, y); // Time
	textSize(size*0.3);
	text(weekDays[currentTime.getDay()], x, y + size*0.7); // WeekDay
	textStyle(NORMAL);
}

// Custom info
function customInfo() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
	
	noStroke();
	fill(textColor);
	var txtSize = height*0.04;
	textSize(txtSize);
	text(currentInfoTxt, x, y);
}

// Remaining time for the school year to end
function remainingTime() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
		
	var txtSize = height*0.035;
	noStroke();
	fill(textColor);
	
	textSize(txtSize*1.6);
	boldText("Terceirão 2018", x, y - txtSize*4.2);
	textSize(txtSize);
	
	var totalSeconds = max(ceil(remSeconds), 0);
	var totalDays = max(floor(remTotalDays), 0);
	var schoolDays = (totalSchoolDays - currentSchoolDay);
	if (afternoonDay) {
		if (millisToday >= schoolAfternoonPeriod[1]) {
			schoolDays -= 1;
		}
	} else if (schoolDay) {
		if (millisToday >= schoolNormalPeriod[1]) {
			schoolDays -= 1;
		}
	}
	var testsRem = remainingTests;
	if (millisToday < testEndTime && testDay) {
		testsRem += 1;
	}
	
	testsRem += 1;// TEMP Prova de física adiada

	
	textAlign(LEFT, CENTER);
	text(pluralAdjust(totalSeconds, "segundo", "segundos"), x + textWidth(" ")*0.5, y - txtSize*2.4)
	text(pluralAdjust(totalDays, "dia total", "dias totais"), x + textWidth(" ")*0.5, y - txtSize*1.2)
	text(pluralAdjust(schoolDays, "dia letivo", "dias letivos"), x + textWidth(" ")*0.5, y)
	text(pluralAdjust(testsRem, "prova", "provas"), x + textWidth(" ")*0.5, y + txtSize*1.2);
	text((yearPerc*100).toFixed(6) + "%", x - textWidth(floor(yearPerc*100)) - textWidth(".")*0.5, y + txtSize*2.4);
	textAlign(RIGHT, CENTER);
	text(totalSeconds, x - textWidth(" ")*0.5, y - txtSize*2.4)
	text(totalDays, x - textWidth(" ")*0.5, y - txtSize*1.2)
	text(schoolDays, x - textWidth(" ")*0.5, y)
	text(testsRem, x - textWidth(" ")*0.5, y + txtSize*1.2);
	textAlign(CENTER, CENTER);
}

// Next tests dates and subjects
function testsList() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;

	var txtSize = height*0.03;

	if (nextTests.length == 0) {
		var listTitle = "Várias provas"; // "Não há provas" TEMP
	} else if (nextTests.length == 1) {
		var listTitle = "Prova";
	} else {
		var listTitle = "Provas";
	}
	var list = [listTitle, ...nextTests];
	
	fill(textColor);

	for (var i = 0; i < list.length; i++) {
		if (list.length == 1) {
			var YPos = 0;
		} else {
			var YPos = map(i, 0, list.length - 1, -(list.length - 1)*0.5, (list.length - 1)*0.5);
		}
		if (i == 0) {
			textSize(txtSize*1.8);
			boldText(list[0], x, y + txtSize*YPos*1.25 - txtSize*0.5);
		} else {
			textSize(txtSize);
			var displayText = list[i][0] + " (" + leadZeros(list[i][1][0], 2) + "/" + leadZeros(list[i][1][1], 2) + ")";
			text(displayText, x, y + txtSize*YPos*1.25);
		}
	}
}


/* Start of left pieces */

// Caller
function leftInfo() {
	var defData = infoPiecesDefPos[7]; // BUG ALERT
	changeLeftInfo[0] = currentLeftInfo;
	
	currentLeftInfoID = floor((currentTime.getTime() / timeBetweenLeftInfos)) % 2;
	
	switch (currentLeftInfoID) {
		case 0:
			currentLeftInfo = "birthdaysList";
			break;
		case 1:
			currentLeftInfo = "courseList";
			break;
	}
	
	if (!changeLeftInfo[2] && changeLeftInfo[0] !== "" && changeLeftInfo[0] !== currentLeftInfo) {
		changeLeftInfo[1] = currentTime.getTime();
		changeLeftInfo[2] = true;
	}
	
	var duration = 2000;
	
	if (changeLeftInfo[2]) {
		var timePassed = currentTime.getTime() - changeLeftInfo[1];
		if (timePassed > duration) {
			changeLeftInfo[2] = false;
		} else if (timePassed > duration*0.5) {
			curPos.x = easeInOutSine(timePassed - duration*0.5, -defData.x, defData.x, duration*0.5);
		} else {
			currentLeftInfo = changeLeftInfo[0];
			curPos.x = easeInOutSine(timePassed, defData.x, -defData.x, duration*0.5);
		}
	}
	
	switch (currentLeftInfo) {
		case "birthdaysList":
			birthdaysList();
			break;
		case "courseList":
			if (changeLeftInfo[0] !== "courseList") {
				updateRandomCourses();
			}
			courseList();
			break;
	}
}

// Next birthdays and ages
function birthdaysList() {
	var x = curPos.x;
	var y = curPos.y;
	var txtSize = curPos.size;

	fill(textColor);

	if (nextBirthdays.length == 0) {
		var listTitle = "Não há aniversários";
	} else if (nextBirthdays.length == 1) {
		var listTitle = "Aniversário";
	} else {
		var listTitle = "Aniversários";
	}
	var list = [listTitle, ...nextBirthdays];
	

	for (var i = 0; i < list.length; i++) {
		if (list.length == 1) {
			var YPos = 0;
		} else {
			var YPos = map(i, 0, list.length - 1, -(list.length - 1)*0.5, (list.length - 1)*0.5);
		}
		if (i == 0) {
			textSize(txtSize*1.8);
			boldText(list[0], x, y + txtSize*YPos*1.25 - txtSize*0.5);
		} else {
			textSize(txtSize);
			var displayText = list[i][0] + " (" + leadZeros(list[i][1][0], 2) + "/" + leadZeros(list[i][1][1], 2) + ")";
			text(displayText, x, y + txtSize*YPos*1.25);
		}
	}
}

function courseList() {
	var x = curPos.x;
	var y = curPos.y;
	var txtSize = curPos.size;

	fill(textColor);
	
	var listTitle = "Cursos possíveis";
	var list = [listTitle, ...currentCourses];
	

	for (var i = 0; i < list.length; i++) {
		if (list.length == 1) {
			var YPos = 0;
		} else {
			var YPos = map(i, 0, list.length - 1, -(list.length - 1)*0.5, (list.length - 1)*0.5);
		}
		if (i == 0) {
			textSize(txtSize*1.8);
			boldText(list[0], x, y + txtSize*YPos*1.25 - txtSize*0.5);
		} else {
			textSize(txtSize);
			var displayText = list[i];
			text(displayText, x, y + txtSize*YPos*1.25);
		}
	}
}

/* End of left pieces */

// Day completion, two circles for afternoon days
function dayCompletion() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
	
	var hue = todayCompletionColor;
	var sat = 80;
	var startLightness = 70;
	var finalLightness = 50;
	var alpha = 50;
	//stroke(todayCompletionColor, 80, 55);
	if (afternoonDay) {
		if (afternoonDayCompl == 0) {
			fill(hue, sat, startLightness, alpha);
			ellipse(x, y, size, size);
			fill(hue, sat, finalLightness, 80);
			completionCircle(x, y, size, normalDayCompl);
		} else {
			fill(hue, sat, finalLightness, alpha);
			ellipse(x, y, size, size);
			fill(hue, sat, finalLightness, 80);
			completionCircle(x, y, size, afternoonDayCompl);
		}
	} else {
		fill(hue, sat, startLightness, alpha);
		ellipse(x, y, size, size);
		fill(hue, sat, finalLightness, 80);
		completionCircle(x, y, size, normalDayCompl);
	}
	
	if (isTimeBetween(millisToday, schoolNormalPeriod[1] - 10*1000, schoolNormalPeriod[1] + 10*10000)) {
		var time = constrain(ceil((schoolNormalPeriod[1] - millisToday)/1000), 0, 10);
		fill(textColor);
		textSize(size*1.5);
		text(time, x, y - size*0.06);
	} else if (afternoonDay && isTimeBetween(millisToday, schoolAfternoonPeriod[1] - 10*1000, schoolAfternoonPeriod[1] + 10*10000)) {
		var time = constrain(ceil((schoolAfternoonPeriod[1] - millisToday)/1000), 0, 10);
		fill(textColor);
		textSize(size*1.5);
		text(time, x, y - size*0.06);
	}
}

// Month calendar, filled with day completion circles
function calendar() {
	var x = curPos.x;
	var y = curPos.y;
	var size = curPos.size;
	
	var transparentL = 0;
	var textColor = color(0, 0, 100);
	fill(0, 0, transparentL, 20);
	rect(x, y - height*0.005, height*0.38, height*0.38, height*0.1, height*0.1);
	
	var dayAreaSize = calendarDaySize;
	var spacing = calendarSpacing;
	var rows = calendarRows;
	var cols = calendarCols;
	textSize(height*0.05);
	fill(0, 0, 0);
	
	// Month name
	boldText(monthNames[currentTime.getMonth()], x, y - height*0.160)
	textSize(dayAreaSize*1.5);
	
	noStroke();
	
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			// Position of the circle
			var xPos = x + map(i, 0, cols - 1, -(cols - 1)*0.5, (cols - 1)*0.5) * (dayAreaSize*2 + spacing);
			var yPos = y + map(j, 0, rows - 1, -(rows - 1)*0.5, (rows - 1)*0.5) * (dayAreaSize*2 + spacing) + height*0.01;
			var fillColor;
			var dayNumber = (j - 1)*(cols) + i - firstMonthWeekday + 1;
			// Weekdays first letter
			if (j == 0) {
				noStroke();
				fill(0, 0, transparentL, 40);
				ellipse(xPos, yPos, dayAreaSize, dayAreaSize);
				fill(textColor);
				boldText(weekDaysMin[i], xPos, yPos);
				
			}
			// Days of the month
			else if (dayNumber > 0 && dayNumber <= daysThisMonth) {
				var lightness = 55;
				var alpha = 100;
				switch (monthdaysStatus[currentTime.getMonth()][dayNumber]) {
					case "normalDay":
					case "afternoonDay":
						fillColor = color(calendarColors.normalDay, 80, lightness, alpha);
						break;
					case "testDay":
					case "testAndAfternoonDay":
						fillColor = color(calendarColors.testDay, 80, lightness, alpha);
						break;
					case "holiday":
						fillColor = color(calendarColors.holiday, 80, lightness, alpha);
						break;
					default:
						fillColor = color(0, 0, transparentL, 20);
				}
				noStroke();
				
				if (dayNumber == currentTime.getDate()) {
					fill(0, 0, 100, 50)
					ellipse(xPos, yPos, dayAreaSize*1.25, dayAreaSize*1.25);
				}
				fill(fillColor);
				
				ellipse(xPos, yPos, dayAreaSize, dayAreaSize);
				fill(textColor);
				boldText(dayNumber, xPos, yPos);
				if (dayNumber <= currentTime.getDate()) {
					strokeWeight(2);
					var alpha = 60;
					if (dayNumber == currentTime.getDate()) {
						var lastPeriod = todayPeriods[todayPeriods.length - 1][0];
						var lastPeriodStart = lastPeriod*MILLIS_IN_A_MINUTE;
						if (lastPeriodStart == 0) {
							alpha = 0;
						} else {
							var timePassed = millisToday - lastPeriodStart;
							alpha = easeInOutSine(timePassed, 0, 60, 1000);
						}
					}
					stroke(0, 0, 0, alpha);
					var lineLenght = calendarDaySize*0.55;
					line(xPos - lineLenght, yPos - lineLenght, xPos + lineLenght, yPos + lineLenght);
					line(xPos - lineLenght, yPos + lineLenght, xPos + lineLenght, yPos - lineLenght);
					strokeWeight(1);
				}
			}
			// Empty slots
			else {
				noStroke();
				fill(0, 0, transparentL, 10);
				ellipse(xPos, yPos, dayAreaSize, dayAreaSize);
			}
		}
	}
}
