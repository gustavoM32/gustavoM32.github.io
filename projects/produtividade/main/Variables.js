var 
	ext = {
		numObjWeek: 0,
		weekObjHours: 0,
		allTimeObjHours: 0,
		weekObjTargetHours: 40,
		volumeStart: [],
		volumeEnd: [],
		fullCompleted: [],
		totalClasses: [],
	},
	weekProgressCircle,
	objWeekRatio,
	objPerc,
	extraPerc,
	weekPerc,
	curDate,
	year, month, wDay, day, hour, minute, second, millisecond,
	time,
	workTimePerDay,
	currentTaskTimer,
	equilibrium,
	late,
	objTime = [0, 0, 0, 0],
	weekTime = [0, 7*24*60*60*1000, 7*24*60*60*1000],
	objAllTime,
	millisInAHour = 60*60*1000,
	weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
	isLooping = true,
	volumeStartTime = [],
	volumeEndTime = [],
	basicExpectedTime,
	fullExpectedTime = [],
	previousFull = [],
	storedFull = [],
	lowFrameRate,
	customTargetHours;
	
if (localStorage.getItem("targetHours") == undefined) {
	//console.log("localStorage targetHours undefined, saving...");
	//localStorage.setItem("targetHours", JSON.stringify(customTargetHours));
}