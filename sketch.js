var tetris, move;
var loaded = false;
var spacebarImg;
var arrowImg;

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
	image(
		spacebarImg,
		0,
		h - spacebarImg.height / 3,
		spacebarImg.width / 3,
		spacebarImg.height / 3
	);
	image(
		arrowImg,
		w - arrowImg.width / 2,
		h - arrowImg.height / 2,
		arrowImg.width / 2,
		arrowImg.height / 2
	);
	pop();
}

function mouseClicked() {
	if (tetris.isGameOver) return;
	if (mouseY > h - arrowImg.height / 2) {
		if (mouseY < h - arrowImg.height / 4) {
			if (
				mouseX > w - arrowImg.width / 2 + arrowImg.width / 6 &&
				mouseX < w - arrowImg.width / 6
			) {
				tetris.rotate(LEFT);
				move = false;
				redraw();
				return;
			}
		}
		if (mouseX < spacebarImg.width / 3) {
			tetris.hardDrop();
			move = false;
			redraw();
			return;
		}
		if (mouseY > h - arrowImg.height / 4) {
			if (mouseX > w - arrowImg.width / 6) {
				tetris.move(RIGHT);
				move = false;
				redraw();
				return;
			}
			if (mouseX > w - (arrowImg.width / 2) * (2 / 3)) {
				tetris.move(DOWN);
				move = false;
				redraw();
				return;
			}
			if (mouseX > w - arrowImg.width / 2) {
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
