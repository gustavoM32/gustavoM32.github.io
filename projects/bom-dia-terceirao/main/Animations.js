/*
	Draw time
	Animation start time
	Animation duration
*/

function getData(defData, outData, startTime, endTime, duration) {
	var data = {...outData};
	var timeFromStart = millisToday - startTime;
	if (timeFromStart < 0) {
		return data;
	}
	var timeFromEnd = millisToday - endTime;
	if (timeFromEnd < 0) {
		data.draw = true;
		data.x = easeInOutSine(timeFromStart, outData.x, defData.x, duration);
		data.y = easeInOutSine(timeFromStart, outData.y, defData.y, duration);
		data.size = easeInOutSine(timeFromStart, outData.size, defData.size, duration);
	} else if (timeFromEnd < duration) {
		data.draw = true;
		data.x = easeInOutSine(timeFromEnd, defData.x, outData.x, duration);
		data.y = easeInOutSine(timeFromEnd, defData.y, outData.y, duration);
		data.size = easeInOutSine(timeFromEnd, defData.size, outData.size, duration);
	}
	return data;
}

function schoolTimeOnly(defData, outData, duration) {
	var data = outData;
	if (millisToday <= schoolAfternoonPeriod[0]) {
		data = getData(defData, outData, ...schoolNormalPeriod, duration);
	} else {
		if (afternoonDay) {
			data = getData(defData, outData, ...schoolAfternoonPeriod, duration);
		}
	}
	return data;
}

function isSchoolTime(delay = 0) {
	var result = false;
	if (isTimeBetween(millisToday, schoolNormalPeriod[0] + delay, schoolNormalPeriod[1] + delay)) {
		result = true;
	} else {
		if (afternoonDay) {
			if (isTimeBetween(millisToday, schoolAfternoonPeriod[0] + delay, schoolAfternoonPeriod[1] + delay)) {
				result = true;
			}
		}
	}
	return result;
}

function mainMessageOnly(defData, outData, duration) {
	var data = defData;
	if (!changeMainMessage[2] && changeMainMessage[0] !== "" && changeMainMessage[0] !== mainMessageText) {
		changeMainMessage[1] = currentTime.getTime();
		changeMainMessage[2] = true;
	}
	if (afternoonDay) {
		data = getData(defData, outData, schoolNormalPrePeriod, schoolAfternoonPeriod[1] + 250, duration);
	} else {
		data = getData(defData, outData, schoolNormalPrePeriod, schoolNormalPeriod[1] + 250, duration);
	}
	if (changeMainMessage[2]) {
		var timePassed = currentTime.getTime() - changeMainMessage[1];
		if (timePassed > duration) {
			changeMainMessage[2] = false;
		} else if (timePassed > duration*0.5) {
			data.x = easeInOutSine(timePassed - duration*0.5, defData.x - width, defData.x, duration*0.5);
		} else {
			mainMessageText = changeMainMessage[0];
			data.x = easeInOutSine(timePassed, defData.x, defData.x + width, duration*0.5);
		}
	}
	changeMainMessage[0] = mainMessageText;
	return data;
}

function customInfoOnly(defData, outData, duration) {
	var data = defData;
	if (!changeInfo[2] && changeInfo[0] !== "" && changeInfo[0] !== currentInfoTxt) {
		changeInfo[1] = currentTime.getTime();
		changeInfo[2] = true;
	}
	
	if (isSchoolTime()) {
		outData.x = defData.x - width;
	} else {
		outData.x = defData.x + width;
	}
	if (millisToday <= schoolAfternoonPeriod[0]) {
		data = getData(defData, outData, ...schoolNormalPeriod, duration);
	} else {
		if (afternoonDay) {
			data = getData(defData, outData, ...schoolAfternoonPeriod, duration);
		}
	}
	if (changeInfo[2]) {
		var timePassed = currentTime.getTime() - changeInfo[1];
		if (timePassed > duration) {
			changeInfo[2] = false;
		} else if (timePassed > duration*0.5) {
			data.x = easeInOutSine(timePassed - duration*0.5, outData.x, defData.x, duration*0.5);
		} else {
			currentInfoTxt = changeInfo[0];
			data.x = easeInOutSine(timePassed, defData.x, outData.x, duration*0.5);
		}
	}
	changeInfo[0] = currentInfoTxt;
	return data;
}

function animate() {
	for (var i = 0; i < infoPiecesDefPos.length; i++) {
		var defData = infoPiecesDefPos[i]; // def data of the object in this cycle of the loop
		infoPiecesCurPos[i] = {...infoPiecesDefPos[i]};
		switch (infoPiecesDefPos[i].name) {
			case "themeColorBackground": // Changes color
				var timeFromPeriodStart = millisToday - currentPeriod[0]*MILLIS_IN_A_MINUTE;
				infoPiecesCurPos[i].alpha = easeInOutSine(timeFromPeriodStart, 100, 0, 1000);
				infoPiecesCurPos[i].draw = true;
				break;
			case "yearCompletion": // Permanent
				infoPiecesCurPos[i].draw = true;
				break;
			case "mainMessage": // Slides out of screen and comes back with different text
				var outData = {
					x: defData.x,
					y: height*0.175,
					size: defData.y*1.2,
				};
				
				infoPiecesCurPos[i] = mainMessageOnly(defData, outData, 1000);
				infoPiecesCurPos[i].draw = true;
				break;
			case "periodsVisualizer": // Changes size and disappears
				var outData = {
					x: defData.x,
					y: defData.y,
					size: 0,
				};
				if (afternoonDay) {
					infoPiecesCurPos[i] = getData(defData, outData, schoolNormalPrePeriod + 500, schoolAfternoonPeriod[1], 1000);
				} else {
					infoPiecesCurPos[i] = getData(defData, outData, schoolNormalPrePeriod + 500, schoolNormalPeriod[1], 1000);
				}
				break;
			case "mainTime": // Changes size
				var outData = {
					x: defData.x,
					y: defData.y,
					size: defData.size*1.5,
				};
				infoPiecesCurPos[i] = schoolTimeOnly(defData, outData, 1000);
				
				infoPiecesCurPos[i].draw = true;
				break;
			case "customInfo": // Slides out of screen and comes back with different text
				var outData = {
					x: defData.x,
					y: defData.y,
					size: defData.size,
				};
				if (isSchoolTime(500)) {
					infoPiecesCurPos[i] = customInfoOnly(defData, outData, 1000);
					infoPiecesCurPos[i].draw = true;
				}
				break;
			case "remainingTime": // Permanent
				infoPiecesCurPos[i].draw = true;
				break;
			case "testsList": // Slides out of screen and disappears
				var outData = {
					x: width*2 - defData.x,
					y: defData.y,
					size: defData.size,
				};
				infoPiecesCurPos[i] = schoolTimeOnly(defData, outData, 1000);
				break;
			case "leftInfo": // Slides out of screen and disappears
				var outData = {
					x: -defData.x,
					y: defData.y,
					size: defData.size,
				};
				infoPiecesCurPos[i] = schoolTimeOnly(defData, outData, 1000);
				break;
			case "dayCompletion": // Changes size and position, out of and into the calendar current day
				var calendarPosition = getDayPositionCalendar(currentTime.getDate());
				var outData = {
					x: defData.x,
					y: defData.y,
					size: 0,
				};
				infoPiecesCurPos[i] = schoolTimeOnly(defData, outData, 1000);
				break;
			case "calendar": // Permanent
				infoPiecesCurPos[i].draw = true;
				break;
		}
	}
}