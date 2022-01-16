let showCellNumber = false;
let grey = "#6e6e6e";
let colors = [
	"#f02011",
	"#f07211",
	"#f0c311",
	"#c7f011",
	"#11ecf0",
	"#1172f0",
	"#b511f0",
	"#f0118c",
];

class Tetris {
	constructor(sizeX, sizeY) {
		this.highScore = localStorage.getItem("highscore") || 0;
		this.sizeX = sizeX;
		this.sizeY = sizeY;

		this.shapesOffsets = [
			// O
			[
				[
					createVector(0, 0),
					createVector(1, 0),
					createVector(0, -1),
					createVector(1, -1),
				],
			],
			// I
			[
				[
					createVector(0, -1),
					createVector(0, 0),
					createVector(0, 1),
					createVector(0, 2),
				],
				[
					createVector(-1, 0),
					createVector(0, 0),
					createVector(1, 0),
					createVector(2, 0),
				],
			],
			// Z
			[
				[
					createVector(1, -1),
					createVector(0, -1),
					createVector(0, 0),
					createVector(-1, 0),
				],
				[
					createVector(1, 1),
					createVector(1, 0),
					createVector(0, 0),
					createVector(0, -1),
				],
			],
			// T
			[
				[
					createVector(0, -1),
					createVector(-1, 0),
					createVector(0, 0),
					createVector(1, 0),
				],
				[
					createVector(0, 0),
					createVector(0, -1),
					createVector(1, 0),
					createVector(0, 1),
				],
				[
					createVector(0, 1),
					createVector(1, 0),
					createVector(0, 0),
					createVector(-1, 0),
				],
				[
					createVector(-1, 0),
					createVector(0, -1),
					createVector(0, 0),
					createVector(0, 1),
				],
			],
			// L
			[
				[
					createVector(0, -1),
					createVector(0, 0),
					createVector(0, 1),
					createVector(1, 1),
				],
				[
					createVector(1, 0),
					createVector(0, 0),
					createVector(-1, 0),
					createVector(-1, 1),
				],
				[
					createVector(0, 1),
					createVector(0, 0),
					createVector(0, -1),
					createVector(-1, -1),
				],
				[
					createVector(-1, 0),
					createVector(0, 0),
					createVector(1, 0),
					createVector(1, -1),
				],
			],
			// J
			[
				[
					createVector(0, -1),
					createVector(0, 0),
					createVector(0, 1),
					createVector(-1, 1),
				],
				[
					createVector(1, 0),
					createVector(0, 0),
					createVector(-1, 0),
					createVector(-1, -1),
				],
				[
					createVector(0, 1),
					createVector(0, 0),
					createVector(0, -1),
					createVector(1, -1),
				],
				[
					createVector(-1, 0),
					createVector(0, 0),
					createVector(1, 0),
					createVector(1, 1),
				],
			],
		];
		this.width = windowHeight / (this.sizeY * 0.1);
		if (this.width > windowWidth) {
			this.width = windowWidth * 0.9;
		}
		this.height = this.width * (this.sizeY * 0.1);
		this.scale = this.width / this.sizeX;
		this.boxes = [];
		this.activeMaterial = random(colors);
		this.activeType = floor(random(6));
		this.activeCoord = createVector(0, 0);
		this.isGameOver = false;
		this.rotation = 0;
		this.score = 0;
		this.lines = 0;
		this.level = 0;
		frameRate(PAL_FPS[this.level]);
		this.nextActiveType = floor(random(6));
		this.nextActiveMaterial = random(colors);
		this.nextActiveCoord = createVector(this.sizeX / 2, 1);

		for (let i = 0; i <= this.sizeY; i++) {
			this.boxes.push([]);
		}

		for (let i = 0; i < this.sizeX; i++) {
			this.boxes[this.sizeY].push(new Cell(i, this.scale, grey));
		}
		this.spawn();
		this.update();
	}

	restart() {
		this.boxes = [];
		for (let i = 0; i <= this.sizeY; i++) {
			this.boxes.push([]);
		}

		for (let i = 0; i < this.sizeX; i++) {
			this.boxes[this.sizeY].push(new Cell(i, this.scale, grey));
		}
		this.score = 0;
		this.isGameOver = false;
		this.level = 1;
		this.spawn();
	}

	spawn() {
		this.rotation = 0;
		this.activeMaterial = this.nextActiveMaterial;
		this.activeType = this.nextActiveType;
		this.activeCoord = this.nextActiveCoord;
		this.nextActiveMaterial = random(colors);
		this.nextActiveType = floor(random(6));
		this.nextActiveCoord = createVector(this.sizeX / 2, 1);
		this.renderActive();
	}

	render() {
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = 0; j < this.boxes[i].length; j++) {
				this.boxes[i][j].render(i);
			}
		}
	}

	renderActive() {
		let coords = this.getCoords(
			this.activeType,
			this.activeCoord,
			this.rotation
		);
		for (let coord of coords) {
			Cell.render(coord.x, coord.y, this.scale, this.activeMaterial);
		}
	}

	renderNext() {
		push();
		fill(255);
		textSize(this.scale * 1.1);
		text("Next", -this.scale * 6.5, this.scale * 1.5);
		pop();

		let coords = this.getCoords(
			this.nextActiveType,
			this.nextActiveCoord,
			0
		);

		for (let coord of coords) {
			Cell.render(
				coord.x - 10.5,
				coord.y + 3,
				this.scale,
				this.nextActiveMaterial,
				false
			);
		}
	}

	renderBorder() {
		for (let i = 0; i < this.sizeY; i++) {
			Cell.render(-1, i, this.scale, grey);
			Cell.render(this.sizeX, i, this.scale, grey);
		}
	}

	move(dir) {
		let before = this.getCoords(
			this.activeType,
			this.activeCoord,
			this.rotation
		);
		let newCoord = createVector(
			dir == LEFT || dir == RIGHT
				? this.activeCoord.x + dir
				: this.activeCoord.x,
			dir == DOWN ? this.activeCoord.y + 1 : this.activeCoord.y
		);
		let after = this.getCoords(this.activeType, newCoord, this.rotation);
		let wall = this.checkWallOnMove(dir, after);

		if (dir == DOWN) this.score++;

		if (wall == WALL) return;
		if (wall == SPAWN) {
			if (dir == LEFT || dir == RIGHT) return;
			this.applyBoxes(before);
			this.spawn();
			this.update();
			return;
		}
		let intersects = this.checkIntersection(after);
		if (intersects == SPAWN) {
			if (dir == LEFT || dir == RIGHT) return;
			this.applyBoxes(before);
			this.spawn();
			this.update();
			return;
		}

		this.activeCoord = newCoord;
		this.renderActive();
	}

	applyBoxes(coords) {
		for (let coord of coords) {
			if (coord.y <= 3) {
				this.isGameOver = true;
				return;
			}
			this.boxes[coord.y].push(
				new Cell(coord.x, this.scale, this.activeMaterial)
			);
		}
	}

	checkForScore() {
		let combo = 0;
		for (let i = this.boxes.length - 2; i >= 0; i--) {
			if (this.boxes[i].length == this.sizeX) {
				this.boxes.splice(i, 1);
				this.boxes.unshift([]);
				combo++;
				this.lines++;
				i++;
			}
		}
		switch (combo) {
			case 0:
				return;
			case 1:
				this.score += 100 * this.level;
				break;
			case 2:
				this.score += 300 * this.level;
				break;
			case 3:
				this.score += 500 * this.level;
				break;
			case 4:
			default:
				this.score += 800 * this.level;
				break;
		}
		let cleared = true;

		for (let arr of this.boxes) {
			if (arr.length != 0) {
				cleared = false;
				break;
			}
		}

		if (cleared) {
			switch (combo) {
				case 1:
					this.score += 800 * this.level;
					break;
				case 2:
					this.score += 1200 * this.level;
					break;
				case 3:
					this.score += 1800 * this.level;
					break;
				case 4:
				default:
					this.score += 2000 * this.level;
					break;
			}
		}

		if (this.lines >= 10 * this.level + 5) {
			this.level++;
			fps = PAL_FPS[this.level];
			frameRate(fps);
		}
		if (this.score > this.highScore) {
			this.highScore = this.score;
			localStorage.setItem("highscore", this.score);
		}
	}

	checkWallOnMove(dir, coords) {
		if (dir == LEFT || dir == RIGHT) {
			for (let coord of coords) {
				if (coord.x == -1 || coord.x == this.sizeX) return WALL;
			}
		}

		if (dir == DOWN) {
			for (let coord of coords) {
				if (coord.y >= this.sizeY) return SPAWN;
			}
		}

		return MOVE;
	}

	rotate(rot) {
		let wall = this.checkWallOnRotation();
		if (wall == WALL) return;
		let after = this.rotation;

		after += rot;
		after %= this.shapesOffsets[this.activeType].length;

		if (after == -1) {
			after = this.shapesOffsets[this.activeType].length - 1;
		}

		let coords = this.getCoords(this.activeType, this.activeCoord, after);
		let intersects = this.checkIntersection(coords);

		if (intersects == SPAWN) return;

		this.rotation = after;
	}

	getCoords(type, center, rotation) {
		let result = [];
		for (let i = 0; i < this.shapesOffsets[type][rotation].length; i++) {
			let offset = this.shapesOffsets[type][rotation][i];
			result.push(createVector(offset.x + center.x, offset.y + center.y));
		}
		return result;
	}

	checkIntersection(coords) {
		for (let i = 0; i < coords.length; i++) {
			for (let j = 0; j < this.boxes[coords[i].y].length; j++) {
				if (this.boxes[coords[i].y][j].x == coords[i].x) {
					return SPAWN;
				}
			}
		}
		return MOVE;
	}

	checkWallOnRotation() {
		if (
			this.activeCoord.x <= 0 ||
			this.activeCoord.x >= this.sizeX - (this.activeType == 1 ? 2 : 1)
		)
			return WALL;
		return MOVE;
	}

	update(mv) {
		this.render();
		if (this.isGameOver) {
			tetrisScreen.currentScreen = STATE_GAMEOVER;
			redraw();
			return;
		} else {
			this.updateStats();
		}
		if (mv) this.move(DOWN);
		autoMoveDown = true;
		this.renderActive();
		this.checkForScore();
		this.renderNext();
		this.renderBorder();
	}

	hardDropCoords() {
		let coords = this.getCoords(
			this.activeType,
			this.activeCoord,
			this.rotation
		);
		let minDistance = this.sizeY;
		for (let coord of coords) {
			let hit = false;
			for (let i = coord.y + 1; i < this.boxes.length; i++) {
				for (let j = 0; j < this.boxes[i].length; j++) {
					if (coord.x == this.boxes[i][j].x) {
						minDistance = min(minDistance, i - coord.y - 1);
						hit = true;
						break;
					}
				}
				if (hit) break;
			}
		}

		this.score += 2 * minDistance;

		for (let i = 0; i < coords.length; i++) {
			coords[i].y += minDistance;
		}
		return coords;
	}

	hardDrop() {
		let coords = this.hardDropCoords();
		this.applyBoxes(coords);
		this.spawn();
		this.update();
	}

	updateStats() {
		push();
		fill(255);
		textSize(this.scale * 1.1);
		let xPos = this.width + this.scale * 3;
		text("Score", xPos, this.scale * 1.5);
		text("Lines", xPos, this.scale * 3.5);
		text("Level", xPos, this.scale * 5.5);
		textSize(this.scale);
		fill(color(colors[3]));
		text("" + this.score, xPos, this.scale * 2.5);
		fill(color(colors[1]));
		text("" + this.lines, xPos, this.scale * 4.5);
		fill(color(colors[0]));
		text("" + this.level, xPos, this.scale * 6.5);
		pop();
	}
}
