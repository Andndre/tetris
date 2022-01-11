var SIZE_X = 10;
var SIZE_Y = 24;
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

// Not to change
const LEFT = -1;
const RIGHT = 1;
const DOWN = 0;
const GAMEOVER = -1;
const WALL = 0;
const MOVE = 1;
const SPAWN = 2;

class Tetris {
	constructor() {
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
		this.scale = w / SIZE_X;
		this.boxes = [];
		this.activeMaterial = colors[floor(random(colors.length))];
		this.activeType = floor(random(6));
		this.activeCoord = createVector(0, 0);
		this.isGameOver = false;
		this.rotation = 0;
		this.score = 0;
		this.nextActiveType = floor(random(6));
		this.nextActiveMaterial = colors[floor(random(colors.length))];
		this.nextActiveCoord = createVector(SIZE_X / 2, 1);

		for (let i = 0; i <= SIZE_Y; i++) {
			this.boxes.push([]);
		}

		for (let i = 0; i < SIZE_X; i++) {
			this.boxes[SIZE_Y].push(new Cell(i, this.scale, grey));
		}
		this.spawn();
		this.update();
	}

	spawn() {
		this.rotation = 0;
		this.activeMaterial = this.nextActiveMaterial;
		this.activeType = this.nextActiveType;
		this.activeCoord = this.nextActiveCoord;
		this.nextActiveMaterial = colors[floor(random(colors.length))];
		this.nextActiveType = floor(random(6));
		this.nextActiveCoord = createVector(SIZE_X / 2, 1);
		this.renderActive();
	}

	display(overlay) {
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = 0; j < this.boxes[i].length; j++) {
				this.boxes[i][j].display(overlay, i);
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
			Cell.display(
				coord.x,
				coord.y,
				this.scale,
				this.activeMaterial,
				false
			);
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
		for (let i = 0; i < SIZE_Y; i++) {
			Cell.display(-1, i, this.scale, grey);
			Cell.display(SIZE_X, i, this.scale, grey);
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
			if (this.boxes[i].length == SIZE_X) {
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
				if (coord.x == -1 || coord.x == SIZE_X) return WALL;
			}
		}

		if (dir == DOWN) {
			for (let coord of coords) {
				if (coord.y >= SIZE_Y) return SPAWN;
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

	getIndexes(type, index, rotation) {
		let result = [];
		for (let i = 0; i < this.shapesOffsets[type][rotation].length; i++) {
			result.push(index + this.shapesOffsets[type][rotation][i]);
		}
		return result;
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
		if (this.activeCoord.x <= 0 || this.activeCoord.x >= SIZE_X - 1)
			return WALL;
		return MOVE;
	}

	gameOver() {
		noLoop();
		this.display(true);
		push();
		fill(255);
		textSize(this.scale);
		textAlign(CENTER);
		text("Game Over", w / 2, height / 2);
		textSize(this.scale * 0.7);
		text("Score: " + this.score, w / 2, height / 2 + tetris.scale);
		pop();
		this.isGameOver = true;
	}

	update(mv) {
		this.display(this.isGameOver);
		if (this.isGameOver) {
			this.gameOver();
		} else {
			this.updateScore();
		}
		if (mv) this.move(DOWN);
		autoMoveDown = true;
		// this.renderDropped();
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
		let minDistance = SIZE_Y;
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
		textSize(this.scale * 0.5);
		text("Score: " + this.score, 20, this.scale);
	}
}
