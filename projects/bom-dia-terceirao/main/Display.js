function setup() {
	frameRate(60)
	
	// Initial config
	createCanvas(windowWidth, windowHeight);
	colorMode(HSL, 360, 100, 100, 100);
	ellipseMode(RADIUS);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	textFont("Calibri");
	
	// Updates all input data for compatibility
	setupData();
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

// Draw all info pieces in InfoPieces.js
function drawInfoPieces() {
	for (var i = 0; i < infoPiecesFunctions.length; i++) {
		curPos = infoPiecesCurPos[i];
		if (!curPos.draw) {
			continue;
		}
		infoPiecesFunctions[i]();
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		toggleFullScreen();
	}
}

function keyPressed() {
	// ["espace", "f", "f11"]
	if ([32, 70, 122].includes(keyCode)) {
		toggleFullScreen();
	}
}

function draw() {
	updateAll();
	updateInfoPiecesDefPos();
	animate();
	drawInfoPieces();
	//drawGridLines(20, 20);
	// console.log(customTimeSpeed);
	if (millis() > 16000) {
		//if (customTimeSpeed < 1000) {
			// customTimeSpeed = customTimeSpeed*1.04;
		//}
	}
}