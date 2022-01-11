var tetris, autoMoveDown;
var loaded = false;
var music;
var w, h;

function setup() {
	music = document.getElementById("music");
	w = windowHeight / (SIZE_Y * 0.1);
	if (w > windowWidth) {
		w = windowWidth * 0.9;
	}

	h = w * (SIZE_Y * 0.1);

	createCanvas(windowWidth, windowHeight);
	autoMoveDown = true;
	// colorMode(HSB);
	background(57, 255 * 0.035, 255 * 0.2);
	tetris = new Tetris(10, 20);
	frameRate(1.4);
	strokeWeight(tetris.scale * 0.03);
	stroke(0);
	loaded = true;
}

function draw() {
	background(0);
	translate(createVector(width / 2 - w / 2, 0));
	tetris.update(autoMoveDown);
}

function keyTyped() {
	if (!loaded) return;
	if (tetris.isGameOver) return;
	if (key == "q") {
		tetris.rotate(LEFT);
	} else if (key == "e") {
		tetris.rotate(RIGHT);
	} else if (key == "w") {
		tetris.rotate(LEFT);
	} else if (key == "a") {
		tetris.move(LEFT);
	} else if (key == "d") {
		tetris.move(RIGHT);
	} else if (key == "s") {
		tetris.move(DOWN);
	}
	autoMoveDown = false;
	redraw();
}

function keyPressed() {
	if (!loaded) return;
	if (tetris.isGameOver) return;
	if (keyCode == 37) {
		tetris.move(LEFT);
	} else if (keyCode == 39) {
		tetris.move(RIGHT);
	} else if (keyCode == 40) {
		tetris.move(DOWN);
	} else if (keyCode == 38) {
		tetris.rotate(LEFT);
	} else if (keyCode == 32 || keyCode == 13) {
		tetris.hardDrop();
	}
	autoMoveDown = false;
	redraw();
}
