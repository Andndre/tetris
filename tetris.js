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
		this.spawn();
	}

	spawn() {
		this.rotation = 0;
		this.activeMaterial = this.nextActiveMaterial;
		this.activeType = this.nextActiveType;
		this.activeCoord = this.nextActiveCoord;
		this.nextActiveMaterial = colors[floor(random(colors.length))];
		this.nextActiveType = floor(random(6));
		this.nextActiveCoord = createVector(this.sizeX / 2, 1);
		this.renderActive();
	}

	render() {
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = 0; j < this.boxes[i].length; j++) {
				this.boxes[i][j].display(i);
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
			Cell.display(coord.x, coord.y, this.scale, this.activeMaterial);
		}
	}

	renderNext() {
		let coords = this.getCoords(
			this.nextActiveType,
			this.nextActiveCoord,
			0
		);
		for (let coord of coords) {
			Cell.display(
				coord.x - 10,
				coord.y + 3,
				this.scale,
				this.nextActiveMaterial,
				false
			);
		}
	}

	renderBorder() {
		for (let i = 0; i < this.sizeY; i++) {
			Cell.display(-1, i, this.scale, grey);
			Cell.display(this.sizeX, i, this.scale, grey);
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
				i++;
			}
		}
		switch (combo) {
			case 0:
				break;
			case 1:
				this.score += 40;
				break;
			case 2:
				this.score += 100;
				break;
			case 3:
				this.score += 300;
				break;
			case 4:
			default:
				this.score += 1200;
				break;
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
			screen.currentScreen = STATE_GAMEOVER;
			redraw();
			return;
		} else {
			this.updateScore();
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

	updateScore() {
		fill(255);
		textSize(this.scale);
		text(
			"Score: " + this.score,
			this.width + this.scale * 3,
			this.scale * 1.5
		);
	}
}
