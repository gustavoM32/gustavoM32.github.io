function boldText(txt, x, y) {
	noStroke();
	textStyle(BOLD);
	text(txt, x, y);
	textStyle(NORMAL);
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
}

function mod(n, m) {
	return ((n % m) + m) % m;
}
