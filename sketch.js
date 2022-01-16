let tetris, autoMoveDown;
let loaded = false;
let fps = PAL_FPS[0];

let music;
let playArrImg;
let leftArrImg;
let rightArrImg;
let downArrImg;
let rotateImg;
let hardDropImg;
let fullScreenImg;

let blockyFont;
let tetrisScreen;

function toggleFullscreen(elem) {
	elem = elem || document.documentElement;

	if (
		!document.fullscreenElement &&
		!document.mozFullScreenElement &&
		!document.webkitFullscreenElement &&
		!document.msFullscreenElement
	) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
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
	}
}

function preload() {
	playArrImg = loadImage("assets/play.png");

	leftArrImg = loadImage("assets/arrow_left_15601.png");
	rightArrImg = loadImage("assets/arrow_right_15600.png");
	downArrImg = loadImage("assets/arrowdown_flech_1539.png");
	rotateImg = loadImage("assets/refresh_arrow_1546.png");
	hardDropImg = loadImage("assets/28_Drop_Box_24258.png");
	fullScreenImg = loadImage(
		"assets/full-full-screen-layout-orientation-expand-screen_81433.png"
	);

	blockyFont = loadFont("assets/clacon2.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	music = document.getElementById("music");
	tetris = new Tetris(10, 24);
	tetrisScreen = new TetrisScreen();
	autoMoveDown = true;
	textFont(blockyFont);
	frameRate(fps);
	strokeWeight(tetris.scale * 0.03);
	stroke(0);
	loaded = true;
	background(0);
	tetrisScreen.render();
}

function draw() {
	background(0);
	push();
	tetrisScreen.render();
	pop();
}

function mouseClicked() {
	tetrisScreen.mouseClicked();
}

function keyTyped() {
	if (
		!loaded ||
		tetris.isGameOver ||
		tetrisScreen.currentScreen != STATE_IN_GAME
	)
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
	if (
		!loaded ||
		tetris.isGameOver ||
		tetrisScreen.currentScreen != STATE_IN_GAME
	)
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

function windowResized() {
	autoMoveDown = false;
	tetris.onResized();
	autoMoveDown = false;
	tetrisScreen.onResized();
	redraw();
}
