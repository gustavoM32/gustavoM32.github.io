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
	if (displayMillis == undefined || !displayMillis) {
		return displayHours + ":" + displayMinutes + ":" + displaySeconds;
	}
	var displayMillis = millis < 100 ? (millis < 10 ? "00" + millis : "0" + millis) : millis;
	return displayHours + ":" + displayMinutes + ":" + displaySeconds + ":" + displayMillis;
}

function getFormatedDayTime(minutes) {
	var hours = floor(minutes/60);
	var minutes = minutes - hours*60;
	var displayHours = hours < 10 ? "0" + hours : hours;
	var displayMinutes = minutes < 10 ? "0" + minutes : minutes;
	return leadZeros(hours, 2) + ":" + leadZeros(minutes, 2);
}

function getFormatedDate(date, displayYear, UTC) {
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
	if (!displayYear) {
		return displayDay + "/" + displayMonth;
	}
	return displayDay + "/" + displayMonth + "/" + (year - 2000);
}

function toggleFullScreen() {
	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		fullScreen = true;
		} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		fullScreen = false;
	}
}

function leadZeros(n, minLength) {
	var nString = n.toString();
	while (nString.length < minLength) {
		nString = "0" + nString;
	}
	return nString;
}

function convertToMinutes(time) {
	return time[0]*60 + time[1];
}

function convertToMillis(hours = 0, minutes = 0, seconds = 0, millis = 0) {
	return ((hours*60 + minutes)*60 + seconds)*1000 + millis;
}

function convertArrToMillis(timeArr = [0, 0, 0, 0]) {
	return ((timeArr[0]*60 + timeArr[1])*60 + timeArr[2])*1000 + timeArr[3];
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

// Sort an array of arrays in which each element is in the form ["string", [day, month, year]]
function sortDates(arr) {
	var unsorted = arr.slice(0);
	var sorted = [];
	for (var i = 0; i < arr.length; i++) {
		var smallest;
		for (var j = 0; j < unsorted.length; j++) {
			if (j == 0) {
				smallest = unsorted[0]; // Starts with the first element of unsorted array
			} else if (unsorted[j][1][0] + (unsorted[j][1][1] - 1)*31 < smallest[1][0] + (smallest[1][1] - 1)*31) {
				smallest = unsorted[j]; // If another element has a date more recent than smallest, change smallest to that element
			} else if (unsorted[j][1][0] + (unsorted[j][1][1] - 1)*31 == smallest[1][0] + (smallest[1][1] - 1)*31) {
				if (unsorted[j][0].localeCompare(smallest[0]) == -1) {
					smallest = unsorted[j]; // If the smallest and another element are on the same day, change smallest by alphabetical order of "string"
				}
			}
		}
		sorted.push(smallest); // Adds the smallest to sorted
		unsorted.splice(unsorted.indexOf(smallest), 1); // Remove smallest from unsorted
	}
	return sorted;
}

function getDateInDays(date) {
	return date[0] + (date[1] - 1)*31;
}

// Get next 'amount' elements from 'arr' (needs to be sorted by date);
function getNextEvents(arr, amount) {
	if (amount > arr.length) {
		amount = arr.length;
	}
	var nextEvents = [];
	for (var i = 0; i < arr.length; i++) {
		var arrDateInDays = getDateInDays(arr[i][1]);
		if (todayInDays <= arrDateInDays) {
			nextEvents.push(arr[i]);
		}
		if (nextEvents.length == amount) {
			if (nextEvents.length == 0 || (i + 1) == arr.length) {
				break;
			}
			while (getDateInDays(nextEvents[nextEvents.length - 1][1]) == getDateInDays(arr[i + 1][1])) {
				nextEvents.pop();
				if (nextEvents.length == 0) {
					break;
				}
			}
			break;
		}
	}
	return nextEvents;
}

function updateTimeToMinutes(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i][0] = convertToMinutes(arr[i][0]);
	}
	return arr;
}

// Convert classes names to indexes of subjects
function convertNameToIds(arr) {
	var subjectsNames = [];
	for (var i = 0; i < subjects.length; i++) {
		subjectsNames[i] = subjects[i][0];
	}
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			arr[i][j] = subjectsNames.indexOf(arr[i][j]);
		}
	}
}

function completionCircle(x, y, size, completion) {
	if (completion <= 0) {
		return;
	}
	if (completion >= 1) {
		ellipse(x, y, size, size);
	} else {
		arc(x, y, size, size, -PI/2, -PI/2 + 2*PI*completion);
	}
};

function getPeriodColor(period) {
	var periodColor = [];
	if (period == undefined) {
		period = [];
	}
	switch (period[1]) {
		case "class":
			periodColor[0] = subjects[classes[currentTime.getDay() - 1][period[2]-1]][1];
			periodColor[1] = subjects[classes[currentTime.getDay() - 1][period[2]-1]][2];
			periodColor[2] = subjects[classes[currentTime.getDay() - 1][period[2]-1]][3];
			break;
		case "break":
			periodColor[0] = 320;
			periodColor[1] = 75;
			periodColor[2] = 70;
			break;
		case "test":
			periodColor[0] = subjects[getSubjectId(todayTest[0])][1];
			periodColor[1] = subjects[getSubjectId(todayTest[0])][2];
			periodColor[2] = subjects[getSubjectId(todayTest[0])][3];
			break;
		case "before":
		case "after":
			periodColor[0] = todayCompletionColor;
			periodColor[1] = 60;
			periodColor[2] = 60;
			break;
		default:
			periodColor[0] = todayCompletionColor;
			periodColor[1] = 60;
			periodColor[2] = 40;
			break;
	}
	return periodColor;
}

function getPeriodName(period) {
	var periodText;
	if (period == undefined) {
		period = [];
	}
	switch (period[1]) {
		case "class":
			//console.log(currentTime);
			//console.log(period);
			//console.log(subjects[classes[currentTime.getDay() - 1][period[2] - 1]][0]);
			periodText = subjects[classes[currentTime.getDay() - 1][period[2] - 1]][0];
			break;
		case "break":
			periodText = "Intervalo";
			break;
		case "test":
			periodText = "Prova de " + todayTest[0];
			break;
		case "before":
			periodText = "Início";
			break;
		case "after":
			periodText = "Fim";
			break;
		default:
			periodText = "";
			break;
	}
	return periodText;
}

function getDayPositionCalendar(dayNumber) {
	var weekDay = (new Date(currentTime.getFullYear(), currentTime.getMonth(), dayNumber)).getDay();
	var i = weekDay;
	var j = (dayNumber + firstMonthWeekday - i - 1)/calendarCols + 1;
	var xPos = calendarPosition[0] + map(i, 0, calendarCols - 1, -(calendarCols - 1)*0.5, (calendarCols - 1)*0.5) * (calendarDaySize*2 + calendarSpacing);
	var yPos = calendarPosition[1] + map(j, 0, calendarRows - 1, -(calendarRows - 1)*0.5, (calendarRows - 1)*0.5) * (calendarDaySize*2 + calendarSpacing) + height*0.01;
	return [xPos, yPos];
}

function isTimeBetween(time, startTime, endTime) {
	return (time >= startTime && time < endTime);
}

function easeInOutSine(time, startValue, endValue, duration) {
	if (time <= 0) {
		return startValue;
	}
	if (time >= duration) {
		return endValue;
	}
	var change = endValue - startValue;
	return -change/2 * (Math.cos(Math.PI*time/duration) - 1) + startValue;
}

function periodToShow(defX, defY, defSize = 0, outX, outY, outSize = 0, startTime, endTime, duration) {
	var startMillis = convertArrToMillis(startTime);
	var endMillis = convertArrToMillis(endTime);
	var draw = false;
	var x = defX;
	var y = defY;
	var size = defSize;
	
	if (isTimeBetween(millisToday, startMillis, startMillis + duration)) {
		draw = true;
		var millisSinceStart = (millisToday - startMillis)
		x = easeInOutSine(millisSinceStart, outX, defX, duration);
		y = easeInOutSine(millisSinceStart, outY, defY, duration);
		size = easeInOutSine(millisSinceStart, outSize, defSize, duration);
	} else if (isTimeBetween(millisToday, startMillis + duration, endMillis)) {
		draw = true;
	} else if (isTimeBetween(millisToday, endMillis, endMillis + duration)) {
		draw = true;
		var millisSinceStart = (millisToday - endMillis)
		x = easeInOutSine(millisSinceStart, defX, outX, duration);
		y = easeInOutSine(millisSinceStart, defY, outY, duration);
		size = easeInOutSine(millisSinceStart, defSize, outSize, duration);
	}
	return [draw, x, y, size];
}

function boldText(txt, x, y) {
	noStroke();
	textStyle(BOLD);
	text(txt, x, y);
	textStyle(NORMAL);
}

function pluralAdjust(n, singularTxt, pluralTxt) {
	if (n == 1) {
		return singularTxt;
	}
		return pluralTxt;
}

function getSubjectId(subjectName) {
	for (var i = 0; i < subjects.length; i++) {
		if (subjects[i][0] == subjectName) {
			return i;
		}
	}
	return -1
} 