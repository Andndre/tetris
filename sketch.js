var tetris, move;
var loaded = false;
var spacebarImg;
var arrowImg;
let spacebarHeight;
let spacebarWidth;
let arrowImgHeight;
let arrowImgWidth;

let w, h;

const LEFT = -1;
const RIGHT = 1;
var DOWN;

function preload() {
	spacebarImg = loadImage("assets/spacebarkey.png");
	arrowImg = loadImage("assets/arrowkeys.png");
}

function setup() {
	w = windowHeight / (SIZE_Y * 0.1);
	if (w > windowWidth) {
		w = windowWidth * 0.9;
	}

	h = w * (SIZE_Y * 0.1);

	DOWN = SIZE_X;
	createCanvas(w, h);
	move = true;
	colorMode(HSB);
	background(57, 255 * 0.035, 255 * 0.2);
	tetris = new Tetris(10, 20);
	spacebarHeight = (spacebarImg.height / 100) * tetris.scale;
	spacebarWidth = (spacebarImg.width / 100) * tetris.scale;
	arrowImgWidth = (arrowImg.width / 65) * tetris.scale;
	arrowImgHeight = (arrowImg.height / 65) * tetris.scale;
	frameRate(1.4);
	strokeWeight(2);
	stroke(0);
	loaded = true;
}

function draw() {
	background(57, 255 * 0.035, 255 * 0.2);
	tetris.update(move);
	push();
	colorMode(RGB);
	tint(255, 75);
	image(spacebarImg, 0, h - spacebarHeight, spacebarWidth, spacebarHeight);
	image(
		arrowImg,
		w - arrowImgWidth,
		h - arrowImgHeight,
		arrowImgWidth,
		arrowImgHeight
	);
	pop();
}

function mouseClicked() {
	if (tetris.isGameOver) return;
	if (mouseY > h - arrowImgHeight) {
		if (mouseY < h - arrowImgHeight / 2) {
			if (
				mouseX > w - arrowImgWidth + arrowImgWidth / 3 &&
				mouseX < w - arrowImgWidth / 3
			) {
				tetris.rotate(LEFT);
				move = false;
				redraw();
				return;
			}
		}
		if (mouseX < spacebarWidth) {
			tetris.hardDrop();
			move = false;
			redraw();
			return;
		}
		if (mouseY > h - arrowImgHeight / 2) {
			if (mouseX > w - arrowImgWidth / 3) {
				tetris.move(RIGHT);
				move = false;
				redraw();
				return;
			}
			if (mouseX > w - arrowImgWidth * (2 / 3)) {
				tetris.move(DOWN);
				move = false;
				redraw();
				return;
			}
			if (mouseX > w - arrowImgWidth) {
				tetris.move(LEFT);
				move = false;
				redraw();
				return;
			}
		}
	}
}

function keyTyped() {
	if (!loaded) return;
	if (tetris.isGameOver) return;
	if (key == "a") {
		tetris.rotate(LEFT);
	} else if (key == "d") {
		tetris.rotate(RIGHT);
	}
	move = false;
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
	} else if (keyCode == 32) {
		tetris.hardDrop();
	}
	move = false;
	redraw();
}
