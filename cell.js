class Cell {
	constructor(x, scale, hex) {
		this.x = x;
		this.scale = scale;
		this.hex = hex;
	}

	static render(x, y, scale, hex) {
		push();
		let coords = createVector(x * scale, y * scale);
		let col = color(hex);
		let dist = scale * 0.06;
		noStroke();
		// upper triangle
		fill(brighten(hex, 40));
		beginShape();
		vertex(coords.x, coords.y);
		vertex(coords.x + scale, coords.y);
		vertex(coords.x, coords.y + scale);
		endShape();

		// lower triangle
		fill(darken(hex, 40));
		beginShape();
		vertex(coords.x + scale, coords.y);
		vertex(coords.x + scale, coords.y + scale);
		vertex(coords.x, coords.y + scale);
		endShape();

		// center rectangle
		fill(col);
		rect(coords.x + dist, coords.y + dist, scale - dist * 2);
		pop();
	}

	render(y) {
		Cell.render(this.x, y, this.scale, this.hex);
	}
}

function darken(hex, percent) {
	let result = color(hex);
	result.levels[0] -= result.levels[0] * (percent / 100);
	result.levels[1] -= result.levels[1] * (percent / 100);
	result.levels[2] -= result.levels[2] * (percent / 100);
	return result;
}

function brighten(hex, percent) {
	return darken(hex, -percent);
}

function spreadCells(count) {
	for (let i = 0; i < count; i++) {
		let col = darken(random(colors), 60);
		Cell.render(
			ceil(random(0, width / tetris.scale)),
			ceil(random(0, height / tetris.scale)),
			tetris.scale,
			col
		);
	}
}
