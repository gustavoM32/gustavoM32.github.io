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

var textColor = [0, 0, 0, 90];
var currentSubject = 0;
var increments = 1;

function draw() {
	themeColor = [subjects[currentSubject][1], subjects[currentSubject][2], subjects[currentSubject][3]];
	themeColorBackground();
	mainMessage();
	mainTime();
	periodsVisualizer();
	customInfo();
	remainingTime();
	testsList();
	courseList();
	calendar();
	dayCompletion();
	
	fill(0, 0, 0);
	text(subjects[currentSubject][0], width*0.5, height*0.75);
	text(themeColor.join(", "), width*0.5, height*0.8);
	text("Hue: 'Q'/'A'; Saturation: 'W'/'S'; Lightness: 'E'/'D", width*0.5, height*0.85);
	text(increments + " increments, \"H\" to change", width*0.5, height*0.90);
}

function mousePressed() {
	if (mouseButton == LEFT) {
		currentSubject = (currentSubject + 1) % subjects.length;
	} else {
		currentSubject = mod(currentSubject - 1, subjects.length);
	}
}

function keyTyped() {
	switch ((key.toString()).toUpperCase()) {
		case "H":
			if (increments == 1) {
				increments = 10;
			} else {
				increments = 1;
			}
			break;
		case "Q":
			subjects[currentSubject][1] = constrain(subjects[currentSubject][1] + increments, 0, 360);
			break;
		case "A":
			subjects[currentSubject][1] = constrain(subjects[currentSubject][1] - increments, 0, 360);
			break;
		case "W":
			subjects[currentSubject][2] = constrain(subjects[currentSubject][2] + increments, 0, 100);
			break;
		case "S":
			subjects[currentSubject][2] = constrain(subjects[currentSubject][2] - increments, 0, 100);
			break;
		case "E":
			subjects[currentSubject][3] = constrain(subjects[currentSubject][3] + increments, 0, 100);
			break;
		case "D":
			subjects[currentSubject][3] = constrain(subjects[currentSubject][3] - increments, 0, 100);
			break;
	}
}
