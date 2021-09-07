function convertExcelDatetoUTC(dateInDays) {
	var days = dateInDays - 25569 + curDate.getTimezoneOffset()/(24*60);
	return days*24*60*60*1000;
}

function completionCircle(x, y, size, completion) {
	if (completion >= 1) {
		ellipse(x, y, size, size, -PI/2);
	} else if (completion > 0) {
		arc(x, y, size, size, -PI/2, -PI/2 + 2*PI*completion);
	}
}

function gridLines() {
	stroke(0, 0, 0);
	fill(0, 0, 100);
	for (var i = -20; i < 21; i++) {
		line(width*0.5 + weekProgressCircle.centerRadius*(i*0.2), 0, width*0.5 + weekProgressCircle.centerRadius*(i*0.2), height);
		text((i*0.2).toFixed(1), 40, height*0.5 +  weekProgressCircle.centerRadius*(i*0.2));
	}
	for (var i = -20; i < 21; i++) {
		line(0, height*0.5 + weekProgressCircle.centerRadius*(i*0.2), width, height*0.5 + weekProgressCircle.centerRadius*(i*0.2));
		text((i*0.2).toFixed(1), width*0.5 + weekProgressCircle.centerRadius*(i*0.2), 40);
	}
}

function volumeExpectedConclusions() {
	var totalPerc = [];
	var prevFullExpectedTime = [];
	var toRemove = 33333;
	fill(260, 25, 8);
	for (var i = 0; i < ext.fullCompleted.length; i++) {
		totalPerc[i] = (ext.fullCompleted[i]/ext.totalClasses[i]);
		prevFullExpectedTime[i] = fullExpectedTime[i];
		fullExpectedTime[i] = new Date(time + ((1 - totalPerc[i]) * (time - volumeStartTime[i])) / totalPerc[i]);
		if (previousFull[i] !== undefined && previousFull[i] != ext.fullCompleted[i]) {
			storedFull[i] = prevFullExpectedTime[i].getTime() - fullExpectedTime[i].getTime();
		}
		previousFull[i] = ext.fullCompleted[i];

		if (storedFull[i] >= toRemove*2) {
			fullExpectedTime[i].setTime(fullExpectedTime[i].getTime() + storedFull[i]);
			storedFull[i] -= toRemove*2;
		}
		
		var center = height*0.09*(i+1);
		text("Volume " + (i + 1), width*0.8, center-height*0.02);
		if (fullExpectedTime[i].getTime() == time) {
			text("Concluído!", width*0.8, center+height*0.02);
		} else {
			text(getFormatedDate(fullExpectedTime[i], false) + " " + getFormatedTime(fullExpectedTime[i], false, false), width*0.8, center+height*0.02);
		}

	}
}