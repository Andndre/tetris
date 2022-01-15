var tetris, autoMoveDown;
var loaded = false;
var fps = 1.4;
var music;
var playImg;
var screen;
var blockyFont;

function preload() {
	playImg = loadImage("assets/play.png");
	blockyFont = loadFont("assets/origa___.ttf");
}

function setup() {
	music = document.getElementById("music");
	tetris = new Tetris(10, 24);
	screen = new TetrisScreen();
	autoMoveDown = true;
	textFont(blockyFont);
	frameRate(fps);
	strokeWeight(tetris.scale * 0.03);
	stroke(0);
	loaded = true;
}

function draw() {
	background(0);
	push();
	screen.render();
	pop();
}

function mouseClicked() {
	screen.mouseClicked();
}

function keyTyped() {
	if (!loaded || tetris.isGameOver || screen.currentScreen != STATE_IN_GAME)
		return;
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
	if (!loaded || tetris.isGameOver || screen.currentScreen != STATE_IN_GAME)
		return;
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
