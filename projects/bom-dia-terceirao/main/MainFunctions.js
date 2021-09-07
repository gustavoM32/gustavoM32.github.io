function setupData() {
	// Sort arrays with elements in the form ["string", [day, month, ...]]
	students = sortDates(students);
	tests = sortDates(tests);
	holidays = sortDates(holidays);
	// Change the [hours, minutes] in arrays with elements in the form [[hours, minutes], "string", number] to the number of minutes
	for (var key in periods) {
		if (periods.hasOwnProperty(key)) {
			periods[key] = updateTimeToMinutes(periods[key]);
		}
	}
	// Convert subjects names in 'classes' to their indexes in 'subjects'
	convertNameToIds(classes);
	
	updateInfoPiecesDefPos(); // Update InfoPieces information
	for (var i = 0; i < infoPiecesDefPos.length; i++) {
		infoPiecesFunctionNames[i] = infoPiecesDefPos[i].name; // Create an array of function names for Info Pieces 
		infoPiecesFunctions[i] = window[infoPiecesDefPos[i].name]; // Create an array of functions for Info Pieces
	}
}

function dayUpdate() {
	updateMonthdaysStatus();
	updateDayType();
	countSchoolDays();
	updateTodayPeriods();
	updateNextBirthdays();
	todayBirthdaysMessages();
	updateNextTests();
	updateRemainingTests();
	dayUpdated = true;
}

function updateTimeData() {
	currentTime = new Date();
	if (customTime) {
		currentTime = new Date(customTimeDate.getTime() + millis()*customTimeSpeed)
	} else {
		currentTime = new Date(currentTime.getTime() - 89000) // Time adjustment for school
	}
	var totalTime = schoolYear[1].getTime() - schoolYear[0].getTime();
	var passedTime = currentTime.getTime() - schoolYear[0].getTime()
	var remTime = totalTime - passedTime;
	remSeconds = (remTime)/1000;
	remTotalDays = remSeconds/60/60/24;
	remSchoolDays = (5/7)*remSeconds/60/60/24;
	yearPerc = constrain(passedTime/totalTime, 0, 1);
	
	firstMonthWeekday = (new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)).getDay();
	firstYearWeekday = (new Date(currentTime.getFullYear(), 0, 1)).getDay();
	daysThisMonth = (new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0)).getDate();
	daysThisYear = (new Date(currentTime.getFullYear(), 1, 29)).getMonth() == 1 ? 366 : 365;
	
	todayInDays = getDateInDays([currentTime.getDate(), currentTime.getMonth() + 1]);
	millisToday = (currentTime.getTime() - currentTime.getTimezoneOffset()*60*1000) % (24*60*60*1000);
	minutesToday = millisToday / (60*1000);
}

function updateMonthdaysStatus() {
	// Add test days
	for (var i = 0; i < tests.length; i++) {
		monthdaysStatus[tests[i][1][1] - 1][tests[i][1][0]] = "testDay";
	}
	// Add weekends
	var yearDay;
	var firstSaturday = 7 - firstYearWeekday;
	if (firstYearWeekday == 0) {
		monthdaysStatus[0][1] = "weekendDay";
	}
	for (yearDay = firstSaturday; yearDay <= daysThisYear; yearDay += 7) {
		var saturday = new Date(currentTime.getFullYear(), 0, yearDay);
		monthdaysStatus[saturday.getMonth()][saturday.getDate()] = "weekendDay";
		var sunday = new Date(currentTime.getFullYear(), 0, yearDay + 1);
		if (sunday.getFullYear !== currentTime.getFullYear) {
			break;
		}
		monthdaysStatus[sunday.getMonth()][sunday.getDate()] = "weekendDay";
	}
	// Add holidays
	for (var i = 0; i < holidays.length; i++) {
		monthdaysStatus[holidays[i][1][1] - 1][holidays[i][1][0]] = "holiday";
	}
	var yearDay = schoolYear[0];
	yearDayLoop: 
		while (yearDay.getTime() <= schoolYear[1].getTime()) {
			for (var i = 0; i < afternoonDays.length; i++) {
				if (yearDay.getDay() == afternoonDays[i]) {
					if (monthdaysStatus[yearDay.getMonth()][yearDay.getDate()] == "testDay") {
						monthdaysStatus[yearDay.getMonth()][yearDay.getDate()] = "testAndAfternoonDay";
					} else {
						monthdaysStatus[yearDay.getMonth()][yearDay.getDate()] = "afternoonDay";
					}
					yearDay = new Date(yearDay.getFullYear(), yearDay.getMonth(), yearDay.getDate() + 1);
					continue yearDayLoop;
				}
			}
			if (monthdaysStatus[yearDay.getMonth()][yearDay.getDate()] == undefined) {
				monthdaysStatus[yearDay.getMonth()][yearDay.getDate()] = "normalDay";
			}
			yearDay = new Date(yearDay.getFullYear(), yearDay.getMonth(), yearDay.getDate() + 1);
		}
}

function updateDayType() {
	afternoonDay = false;
	testDay = false;
	schoolDay = false;
	switch (monthdaysStatus[currentTime.getMonth()][currentTime.getDate()]) {
		case "normalDay":
			todayCompletionColor = calendarColors.normalDay;
			schoolDay = true;
			break;
		case "testDay":
			todayCompletionColor = calendarColors.testDay;
			testDay = true;
			schoolDay = true;
			break;
		case "testAndAfternoonDay":
			todayCompletionColor = calendarColors.testDay;
			testDay = true;
			afternoonDay = true;
			schoolDay = true;
			break;
		case "afternoonDay":
			todayCompletionColor = calendarColors.normalDay;
			afternoonDay = true;
			schoolDay = true;
			break;
		case "holiday":
			todayCompletionColor = calendarColors.holiday;
			break;
		default:
			todayCompletionColor = 0;
			return;
	}
}

function countSchoolDays() {
	var count = 0;
	remainingAfternoonDays = 0;
	// Count from first day
	for (var i = schoolYear[0].getMonth(); i < monthdaysStatus.length; i++) {
		var startFromDay = 1;
		if (i == schoolYear[0].getMonth()) {
			startFromDay = schoolYear[0].getDate();
		}
		for (var j = startFromDay; j < monthdaysStatus[i].length; j++) {
			switch (monthdaysStatus[i][j]) {
				case "testAndAfternoonDay":
				case "afternoonDay":
					if (currentSchoolDay <= count) {
						remainingAfternoonDays++;
					}
					count++;
					break;
				case "normalDay":
				case "testDay":
					count++;
			}
			if (i == currentTime.getMonth() && j == currentTime.getDate()) {
				currentSchoolDay = count;
			}
		}
	}
	totalSchoolDays = count;
}

// Update today periods array
function updateTodayPeriods() {
	todayPeriods = [];
	if (!schoolDay) {
		todayPeriods = [[0, "noSchool", 2]];
		return;
	}
	if (customDay) {
		todayPeriods = todayPeriods.concat(periods.customDay);
		return;
	}
	if (bigTestDay) {
		todayPeriods = todayPeriods.concat(periods.bigTestDay);
	} else if (testDay) {
		todayPeriods = todayPeriods.concat(periods.testDay);
	} else {
		todayPeriods = todayPeriods.concat(periods.normalDay);
	}
	if (afternoonDay) {
		todayPeriods = todayPeriods.concat(periods.afternoonDay);
	}
}

// Get current period
function updateCurrentPeriod() {
	currentGeneralPeriod = -1;
	nextGeneralPeriod = -1;
	previousPeriod = [];
	currentPeriod = [];
	nextPeriod = [];
	// Updates the general period of the day
	for (var i = 0; i < periods.generalDay.length; i++) {
		var periodStart = periods.generalDay[i][0];
		if (minutesToday < periodStart) {
			continue;
		}
		var periodEnd = i + 1 == periods.generalDay.length ? MINUTES_IN_A_DAY : periods.generalDay[i + 1][0];
		if (minutesToday >= periodEnd) {
			continue;
		}
		currentGeneralPeriod = periods.generalDay[i];
		if (i !== periods.generalDay.length - 1) {
			nextGeneralPeriod = periods.generalDay[i + 1];
		}
		break;
	}
	// Updates the school period of the day
	for (var i = 0; i < todayPeriods.length; i++) {
		var periodStart = todayPeriods[i][0];
		if (minutesToday < periodStart) {
			continue;
		}
		var periodEnd = i + 1 == todayPeriods.length ? MINUTES_IN_A_DAY : todayPeriods[i + 1][0];
		if (minutesToday >= periodEnd) {
			continue;
		}
		if (i !== 0) {
			previousPeriod = todayPeriods[i - 1];
		}
		currentPeriod = todayPeriods[i];
		if (i !== todayPeriods.length - 1) {
			nextPeriod = todayPeriods[i + 1];
		}
		break;
	}
}

// Update main message
function updateMainMessageText() {
	if (currentPeriod[1] == "test") {
		mainMessageText = "Boa prova, Terceirão!";
	} else if (currentPeriod[1] == "after" && (millisToday - currentPeriod[0]*MILLIS_IN_A_MINUTE) < 10*MILLIS_IN_A_MINUTE) {
		if (afternoonDay && currentPeriod[2] == 1) {
			mainMessageText = "Até mais, Terceirão!";
		} else {
			mainMessageText = "Tchau, Terceirão!";
		}
	} else {
		switch (currentGeneralPeriod[2]) {
			case 1:
				mainMessageText = "Bom dia, Terceirão!";
				break;		
			case 2:
				mainMessageText = "Boa tarde, Terceirão!";
				break;		
			case 3:
				mainMessageText = "Boa noite, Terceirão!";
				break;
		}
	}
}

// Get time distance from the present from periods
function updateVisualizerValues() {
	visualizerValues = [];
	for (var i = 0; i < todayPeriods.length; i++) {
		var diff = todayPeriods[i][0]*60*1000 - ((currentTime.getTime() - currentTime.getTimezoneOffset()*60*1000) % MILLIS_IN_A_DAY);
		visualizerValues[i] = diff;
	}
}

// Get next birthdays
function updateNextBirthdays() {
	nextBirthdays = getNextEvents(students, 3);
}

// Calculate mean age 
function updateMeanAge() {
	var result = 0;
	for (var i = 0; i < students.length; i++) {
		var birthDate = new Date(students[i][1][2], students[i][1][1], students[i][1][0], 0, 0, 0, 0);
		result += (currentTime.getTime() - birthDate.getTime())/students.length/365.25/24/60/60/1000;
	}
	meanAge = result;
}

// Get next tests
function updateNextTests() {
	if (testDay) {
		nextTests = getNextEvents(tests, 4);
		todayTest = nextTests.shift(0);
	} else {
		nextTests = getNextEvents(tests, 3);
	}
}

// Filter recent info
function updateInfos() {
	var infoIds = [];
	presentInfos = [];
	for (var i = 0; i < infos.length; i++) {
		var infoStartDate = new Date(2018, infos[i][1][1] - 1, infos[i][1][0], infos[i][2][0], infos[i][2][1], 0, 0);
		var infoEndDate = new Date(2018, infos[i][3][1] - 1, infos[i][3][0], infos[i][4][0], infos[i][4][1], 0, 0);
		if (infoStartDate.getTime() <= currentTime.getTime() && infoEndDate.getTime() > currentTime.getTime()) {
			presentInfos.push(infos[i][0]);
			infoIds.push(i);
		}
	}
	if (presentInfos.length === 0) {
		currentInfoTxt = "";
		return;
	}
	currentInfo = infoIds[floor((currentTime.getTime() / timeBetweenInfos)) % presentInfos.length];
	currentInfoTxt = infos[currentInfo][0];
}

function updateDayCompl() {
	normalDayCompl = constrain((minutesToday - convertToMinutes(normalDayStart))/(convertToMinutes(normalDayEnd) - convertToMinutes(normalDayStart)), 0, 1);
	afternoonDayCompl = constrain((minutesToday - convertToMinutes(afternoonDayStart))/(convertToMinutes(afternoonDayEnd) - convertToMinutes(afternoonDayStart)), 0, 1);
}

function updateRemainingTests() {
	var nextTest = 0;
	for (var i = 0; i < tests.length; i++) {
		if ((tests[i][1][1] - 1)*31 + tests[i][1][0] > currentTime.getMonth()*31 + currentTime.getDate()) {
			nextTest = i;
			break;
		} else {
			nextTest = tests.length;
		}
	}
	remainingTests = tests.length - nextTest - 1;
}

function updateCalendarData() {
	calendarPosition = [width*0.825, height*0.79];
	calendarDaySize = height*0.018;
	calendarSpacing = height*0.008;
}

function updateThemeColor() {
	previousThemeColor = getPeriodColor(previousPeriod);
	themeColor = getPeriodColor(currentPeriod);
}

function todayBirthdaysMessages() {
	var todayBirthdays = [];
	for (var i = 0; i < nextBirthdays.length; i++) {
		if (getDateInDays(nextBirthdays[i][1]) == todayInDays) {
			todayBirthdays.push(nextBirthdays[i]);
		}
	}
	for (var i = 0; i < todayBirthdays.length; i++) {
		infos.push(
			[
				"Feliz aniversário, " + nextBirthdays[i][0] + "!",
				[nextBirthdays[i][1][0], nextBirthdays[i][1][1]], [ 0, 0],
				[nextBirthdays[i][1][0], nextBirthdays[i][1][1]], [24, 0],
			]
		);
	}
};

function updateRandomCourses() {
	for (var i = 0; i < courses.length; i++) {
		var newCourse = courses[i][floor(random()*courses[i].length)];
		while (newCourse == currentCourses[i]) {
			newCourse = courses[i][floor(random()*courses[i].length)];
			if (courses[i].length <= 1) {
				break;
			}
		}
		currentCourses[i] = newCourse;
	}
}

// Calls all update functions
function updateAll() {
	updateTimeData();
	updateCalendarData();
	dayUpdate();
	updateCurrentPeriod();
	updateMainMessageText();
	updateVisualizerValues();
	updateInfos();
	updateDayCompl();
	updateThemeColor();
}