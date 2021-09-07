/* Display functions */
// Draws background color
function themeColorBackground() {
	var alpha = 100;
	
	background(themeColor[0], themeColor[1], themeColor[2]); // Opaque background (current)
	noStroke();
}

// The main program's message ended with ", Terceirão!"
function mainMessage() {
	var x = width*0.5;
	var y = height*0.125;
	var size = height*0.13;
	textSize(size);
	fill(textColor);
	boldText("Bom dia, Terceirão!", x, y);
}

// Time, date and weekday
function mainTime() {
	var x = width*0.5;
	var y = height*0.5;
	var size = height*0.125;
	
	textFont("Calibri");
	noStroke();
	fill(textColor);
	textSize(size*0.4);
	textStyle(BOLD);
	text("32/13/2052", x, y - size*0.7); // Date
	textSize(size);
	text("25:63:69", x, y); // Time
	textSize(size*0.3);
	text("Sétima-feira", x, y + size*0.7); // WeekDay
	textStyle(NORMAL);
}

function periodsVisualizer() {
	var x = width*0.5;
	var y = height*0.24;
	var thickness = height*0.025;
	
	rectMode(CORNERS);
	fill(0, 0, 0, 50);
	rect(0, y - thickness*0.5 + 1, width, y + thickness*0.5)
	
	stroke(0, 0, 0);
	strokeWeight(2);
	line(x, y - thickness*0.75, x, y + thickness*0.75); // Present center line
	strokeWeight(1);
	rectMode(CENTER);
}


// Custom info
function customInfo() {
	var x = width*0.5;
	var y = height*0.33;
	var size = height*0.04;
	
	noStroke();
	fill(textColor);
	var txtSize = height*0.04;
	textSize(txtSize);
	text("Lorem ipsum", x, y);
}

// Remaining time for the school year to end
function remainingTime() {
	var x = width*0.175;
	var y = height*0.8;
	var size = height*0.04;
		
	var txtSize = height*0.04;
	noStroke();
	fill(textColor);
	
	textSize(txtSize*1.6);
	boldText("Terceirão 2018", x, y - txtSize*4.2);
	textSize(txtSize);
	
	testsRem = "Várias";// TEMP
	totalSeconds = "Vários";
	totalDays = "Vários";
	schoolDays = "Vários";
	
	textAlign(LEFT, CENTER);
	text("segundos", x + textWidth(" ")*0.5, y - txtSize*2.4)
	text("dias totais", x + textWidth(" ")*0.5, y - txtSize*1.2)
	text("dias letivos", x + textWidth(" ")*0.5, y)
	text("provas", x + textWidth(" ")*0.5, y + txtSize*1.2);
	text((1.5*100).toFixed(6) + "%", x - textWidth(floor(1.5*100)) - textWidth(".")*0.5, y + txtSize*2.4);
	textAlign(RIGHT, CENTER);
	text(totalSeconds, x - textWidth(" ")*0.5, y - txtSize*2.4)
	text(totalDays, x - textWidth(" ")*0.5, y - txtSize*1.2)
	text(schoolDays, x - textWidth(" ")*0.5, y)
	text(testsRem, x - textWidth(" ")*0.5, y + txtSize*1.2);
	textAlign(CENTER, CENTER);
}

// Next tests dates and subjects
function testsList() {
	var x = width*0.825;
	var y = height*0.47;
	var size = height*0.03;

	var txtSize = height*0.03;

	var nextTests = [
		["Matemática", [34, 35, 18]],
		["Inglês", [21, 57, 28]],
		["Japonês", [78, 13, 58]],
	];
	
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
			var displayText = list[i][0] + " (" + list[i][1][0] + "/" + list[i][1][1] + ")";
			text(displayText, x, y + txtSize*YPos*1.25);
		}
	}
}

function courseList() {
	var x = width*0.175;
	var y = height*0.47;
	var txtSize = height*0.03;

	fill(textColor);
	
	var listTitle = "Cursos possíveis";
	var list = [listTitle, "Engenharia", "Matemática", "Física"];
	

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

// Day completion, two circles for afternoon days
function dayCompletion() {
	var x = width*0.5;
	var y = height*0.8;
	var size = min(height*0.125, width*0.1);
	
	var hue = 220;
	var sat = 80;
	var startLightness = 70;
	var finalLightness = 50;
	var alpha = 50;
	//stroke(todayCompletionColor, 80, 55);

	fill(hue, sat, startLightness, alpha);
	ellipse(x, y, size, size);
	fill(hue, sat, finalLightness, 80);
	completionCircle(x, y, size, 0.5);
}

// Month calendar, filled with day completion circles
function calendar() {
	var x = width*0.825;
	var y = height*0.79;
	var size = height*0.79;
	
	var transparentL = 0;
	var textColor = color(0, 0, 100);
	fill(0, 0, transparentL, 20);
	rect(x, y - height*0.005, height*0.38, height*0.38, height*0.1, height*0.1);
	
	var dayAreaSize = height*0.018;
	var spacing = height*0.008;
	var rows = 6;
	var cols = 7;
	textSize(height*0.05);
	fill(0, 0, 0);
	
	// Month name
	boldText("Onzembro", x, y - height*0.160)
	textSize(dayAreaSize*1.5);
	
	noStroke();
	
	var weekDaysMin = ["A", "B", "C", "D", "E", "F", "G"];
	
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			// Position of the circle
			var xPos = x + map(i, 0, cols - 1, -(cols - 1)*0.5, (cols - 1)*0.5) * (dayAreaSize*2 + spacing);
			var yPos = y + map(j, 0, rows - 1, -(rows - 1)*0.5, (rows - 1)*0.5) * (dayAreaSize*2 + spacing) + height*0.01;
			var fillColor;
			var dayNumber = (j - 1)*(cols) + i - 0 + 1;
			// Weekdays first letter
			if (j == 0) {
				noStroke();
				fill(0, 0, transparentL, 40);
				ellipse(xPos, yPos, dayAreaSize, dayAreaSize);
				fill(textColor);
				boldText(weekDaysMin[i], xPos, yPos);
				
			}
			// Days of the month
			else if (dayNumber > 0 && dayNumber <= 32) {
				var lightness = 55;
				var alpha = 100;
				
				fillColor = color(220, 80, lightness, alpha);
				noStroke();
				
				if (dayNumber == 16) {
					fill(0, 0, 100, 50)
					ellipse(xPos, yPos, dayAreaSize*1.25, dayAreaSize*1.25);
				}
				fill(fillColor);
				
				ellipse(xPos, yPos, dayAreaSize, dayAreaSize);
				fill(textColor);
				boldText(dayNumber, xPos, yPos);
				if (dayNumber <= 16) {
					strokeWeight(2);
					stroke(0, 0, 0, 60);
					var lineLenght = dayAreaSize*0.55;
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
