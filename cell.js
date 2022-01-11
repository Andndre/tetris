class Cell {
	constructor(x, scale, hex) {
		this.x = x;
		this.scale = scale;
		this.hex = hex;
	}

	static display(x, y, scale, hex, overlay) {
		push();
		let coords = createVector(x * scale, y * scale);
		fill(overlay ? color(grey) : color(hex));
		rect(coords.x, coords.y, scale);
		pop();
	}

	display(overlay, y) {
		push();
		let coords = createVector(this.x * this.scale, y * this.scale);
		fill(overlay ? color(grey) : color(this.hex));
		rect(coords.x, coords.y, this.scale);
		pop();
	}
}
