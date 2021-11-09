var SIZE_X = 10;
var SIZE_Y = 24;
let showCellNumber = false;

// Not to change
const GAMEOVER = -1;
const WALL = 0;
const MOVE = 1;
const SPAWN = 2;
const SHAPES_OFFSETS = [
	// O
	[[0, 1, -SIZE_X, -SIZE_X + 1]],
	// I
	[
		[-SIZE_X, 0, SIZE_X],
		[-1, 0, 1],
	],
	// Z
	[
		[-SIZE_X + 1, -SIZE_X, 0, -1],
		[SIZE_X + 1, 1, 0, -SIZE_X],
	],
	// T
	[
		[-SIZE_X, -1, 0, 1],
		[1, -SIZE_X, 0, SIZE_X],
		[SIZE_X, 1, 0, -1],
		[-1, -SIZE_X, 0, SIZE_X],
	],
	// L
	[
		[-SIZE_X, 0, SIZE_X, SIZE_X + 1],
		[1, 0, -1, SIZE_X - 1],
		[SIZE_X, 0, -SIZE_X, -SIZE_X - 1],
		[-1, 0, 1, -SIZE_X + 1],
	],
	// J
	[
		[-SIZE_X, 0, SIZE_X, SIZE_X - 1],
		[1, 0, -1, -SIZE_X - 1],
		[SIZE_X, 0, -SIZE_X, -SIZE_X + 1],
		[-1, 0, 1, SIZE_X + 1],
	],
];

class Tetris {
	constructor() {
		this.scale = width / SIZE_X;
		this.boxes = [];
		this.activeMaterial = random(100);
		this.activeType = floor(random(6));
		this.activeIndex = 15;
		this.isGameOver = false;
		this.rotation = 0;
		this.score = 0;

		for (let i = 0; i < SIZE_Y; i++) {
			this.boxes.push([]);
		}

		this.spawn();
	}

	spawn() {
		this.rotation = 0;
		this.activeMaterial = random(100);
		this.activeType = floor(random(6));
		this.activeIndex = floor(SIZE_X + SIZE_X / 2);
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
		let coords = this.getCoords(this.activeIndex, this.rotation);
		for (let coord of coords) {
			Cell.display(
				coord[0],
				coord[1],
				this.scale,
				this.activeMaterial,
				false
			);
		}
	}

	renderDropped() {
		let coords = this.hardDropCoords();
		for (let coord of coords) {
			Cell.display(
				coord[0],
				coord[1],
				this.scale,
				this.activeMaterial,
				true
			);
		}
	}

	move(dir) {
		let before = this.getCoords(this.activeIndex, this.rotation);
		let after = this.getCoords(this.activeIndex + dir, this.rotation);

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

		this.activeIndex += dir;
		this.renderActive();
	}

	applyBoxes(coords) {
		for (let coord of coords) {
			if (coord[1] <= 3) {
				this.isGameOver = true;
				return;
			}
			this.boxes[coord[1]].push(
				new Cell(coord[0], this.scale, this.activeMaterial)
			);
			print(this.boxes.length);
		}
	}

	checkForScore() {
		for (let i = this.boxes.length - 1; i >= 0; i--) {
			if (this.boxes[i].length == SIZE_X) {
				this.boxes.splice(i, 1);
				this.boxes.unshift([]);
				this.score++;
				i++;
			}
		}
	}

	checkWallOnMove(dir, coords) {
		if (dir == LEFT || dir == RIGHT) {
			for (let coord of coords) {
				let index = coordsToIndex(coord[0], coord[1]);
				if (dir == LEFT && index % SIZE_X == 0) {
					return WALL;
				} else if (dir == RIGHT && (index - 1) % SIZE_X == 0) {
					return WALL;
				}
			}
		}

		if (dir == DOWN) {
			for (let coord of coords) {
				let index = coordsToIndex(coord[0], coord[1]);
				if (index > SIZE_X * SIZE_Y) {
					return SPAWN;
				}
			}
		}

		return MOVE;
	}

	rotate(rot) {
		let wall = this.checkWallOnRotation();
		if (wall == WALL) return;
		let after = this.rotation;

		after += rot;
		after %= SHAPES_OFFSETS[this.activeType].length;

		if (after == -1) {
			after = SHAPES_OFFSETS[this.activeType].length - 1;
		}

		let coords = this.getCoords(this.activeIndex, after);
		let intersects = this.checkIntersection(coords);

		if (intersects == SPAWN) return;

		this.rotation = after;
	}

	getIndexes(index, rotation) {
		let result = [];
		for (
			let i = 0;
			i < SHAPES_OFFSETS[this.activeType][rotation].length;
			i++
		) {
			result.push(index + SHAPES_OFFSETS[this.activeType][rotation][i]);
		}
		return result;
	}

	getCoords(index, rotation) {
		let result = [];
		for (
			let i = 0;
			i < SHAPES_OFFSETS[this.activeType][rotation].length;
			i++
		) {
			result.push(
				indexToCoords(
					index + SHAPES_OFFSETS[this.activeType][rotation][i]
				)
			);
		}
		return result;
	}

	checkIntersection(coords) {
		for (let i = 0; i < coords.length; i++) {
			for (let j = 0; j < this.boxes[coords[i][1]].length; j++) {
				if (this.boxes[coords[i][1]][j].x == coords[i][0]) {
					return SPAWN;
				}
			}
		}
		return MOVE;
	}

	checkWallOnRotation() {
		if (
			(this.activeIndex - 1) % SIZE_X == 0 ||
			this.activeIndex % SIZE_X == 0
		)
			return WALL;
		return MOVE;
	}

	gameOver() {
		noLoop();
		this.display(true);

		push();
		fill(255);
		textSize(29);
		textAlign(CENTER);
		text("Game Over", width / 2, height / 2);
		textSize(20);
		text("Score: " + this.score, width / 2, height / 2 + 30);
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
		move = true;
		this.renderActive();
		this.renderDropped();
		this.checkForScore();
	}

	hardDropCoords() {
		let coords = this.getCoords(this.activeIndex, this.rotation);
		let minDistance = SIZE_Y;
		for (let coord of coords) {
			let hit = false;
			for (let i = coord[1] + 1; i < this.boxes.length; i++) {
				for (let j = 0; j < this.boxes[i].length; j++) {
					if (coord[0] == this.boxes[i][j].x) {
						minDistance = min(minDistance, i - coord[1] - 1);
						hit = true;
						break;
					}
				}
				if (hit) break;
				if (i == this.boxes.length - 1) {
					minDistance = min(minDistance, i - coord[1]);
					if (minDistance <= 1) return coords;
				}
			}
		}

		for (let i = 0; i < coords.length; i++) {
			coords[i][1] += minDistance;
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
		textSize(20);
		text("Score: " + this.score, 10, 25);
	}
}

class Cell {
	constructor(x, scale, hue) {
		this.x = x;
		this.scale = scale;
		this.hue = hue;
	}

	static display(x, y, scale, hue, overlay) {
		let coords = createVector(x * scale, y * scale);
		fill((hue * 30) % 255, 175, overlay ? 25 : 100);
		rect(coords.x, coords.y, scale);

		if (!showCellNumber) return;
		push();
		fill(75);
		textSize(9);
		textAlign(CENTER);
		text(
			"(" + x + ", " + y + ")\n" + coordsToIndex(x, y),
			coords.x + scale / 2,
			coords.y + scale / 2
		);
		pop();
	}

	display(overlay, y) {
		let coords = createVector(this.x * this.scale, y * this.scale);
		fill((this.hue * 30) % 255, 175, overlay ? 25 : 100);
		rect(coords.x, coords.y, this.scale);

		if (!showCellNumber) return;
		push();
		fill(75);
		textSize(9);
		textAlign(CENTER);
		text(
			"(" + this.x + ", " + y + ")\n" + coordsToIndex(this.x, y, 10),
			coords.x + this.scale / 2,
			coords.y + this.scale / 2
		);
		pop();
	}
}

function coordsToIndex(x, y) {
	return y * SIZE_X + x + 1;
}

function indexToCoords(index) {
	return [(index - 1) % SIZE_X, ceil(index / SIZE_X) - 1];
}
